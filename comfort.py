import os
from io import TextIOWrapper
from flask import (
    Flask,
    request,
    render_template,
    send_from_directory,
    abort,
    jsonify,
    make_response,
    )
from pythermalcomfort.models import pmv_ppd, set_tmp, cooling_effect
from pythermalcomfort.psychrometrics import v_relative, clo_dynamic
import pandas as pd

ALLOWED_EXTENSIONS = {"csv"}

STATIC_URL_PATH = "/static"

app = Flask(__name__, static_url_path=STATIC_URL_PATH)


# define the extension files that can be uploaded by users
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1] in ALLOWED_EXTENSIONS


@app.route("/download/<path:filename>")
def download_file(filename):
    if ".." in filename:
        abort(404)
    return send_from_directory(
        "./media/", filename, mimetype="application/octet-stream"
        )


@app.route("/api/v1/comfort/pmv", methods=["GET"])
def api_id():
    # Check if an ID was provided as part of the URL.
    # If ID is provided, assign it to a variable.
    # If no ID is provided, display an error in the browser.
    try:
        clo = float(request.args["clo"])
        ta = float(request.args["ta"])
        tr = float(request.args["tr"])
        v = float(request.args["v"])
        met = float(request.args["met"])
        rh = float(request.args["rh"])
    except:
        return "Error: You did not provided all the input parameters"

    # Create an empty list for our results
    results = dict()

    value = pmv_ppd(ta, tr, v, rh, met, clo, wme=0, standard="ASHRAE")
    results["data"] = []
    results["data"].append(value)
    results["message"] = "success"

    # Use the jsonify function from Flask to convert our list of
    # Python dictionaries to the JSON format.
    return jsonify(results)


# Upload page - The user can upload a csv with input environmental parameters and
# returns a csv with indexes calculated
@app.route(
    "/upload"
    )  # tutorial https://stackoverflow.com/questions/27628053/uploading-and
# -downloading-files-with-flask
def upload():
    return render_template("upload.html")


# Upload page - The user can upload a csv with input environmental parameters and
# returns a csv with indexes calculated
@app.route(
    "/other_tools"
    )  # tutorial https://stackoverflow.com/questions/27628053/uploading-and
# -downloading-files-with-flask
def other_tools():
    return render_template("other_tools.html")


# this function process the uploaded file and automatically downloads the file with the
# results
@app.route("/transform", methods=["POST"])
def transform_view():
    # get the uploaded file
    request_file = request.files["data_file"]

    # check file
    if not request_file:
        return "No file selected"
    if not allowed_file(request_file.filename):
        return "The file format is not allowed. Please upload a csv"

    # read file
    csv_file = TextIOWrapper(request_file, encoding="utf-8")
    df = pd.read_csv(csv_file)
    fields = {
        "Air temperature": "ta",
        "MRT": "tr",
        "Air velocity": "vel",
        "Relative humidity": "rh",
        "Metabolic rate": "met",
        "Clothing level": "clo",
        }
    si_unit = True
    if any([True for x in df.columns if x.split(" [")[1] == "F]"]):
        si_unit = False
    df.columns = [fields[x.split(" [")[0]] for x in df.columns]

    df["clo_dynamic"] = df.apply(
        lambda row: clo_dynamic(clo=row["clo"], met=row["met"]), axis=1
        )

    if si_unit:
        df["vr"] = df.apply(
            lambda row: v_relative(v=row["vel"], met=row["met"]), axis=1
            )
        df["PMV"] = df.apply(
            lambda row: pmv_ppd(
                tdb=row["ta"],
                tr=row["tr"],
                vr=row["vr"],
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                standard="ashrae",
                ),
            axis=1,
            )
        df["SET"] = df.apply(
            lambda row: set_tmp(
                tdb=row["ta"],
                tr=row["tr"],
                v=row["vel"],
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                ),
            axis=1,
            )
        df["CE"] = df.apply(
            lambda row: ""
            if row["vel"] < 0.2
            else cooling_effect(
                tdb=row["ta"],
                tr=row["tr"],
                vr=row["vel"],
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                ),
            axis=1,
            )
    else:
        df["vr"] = df.apply(
            lambda row: v_relative(v=row["vel"] / 60 * 0.3048, met=row["met"])
                        * 3.28084,
            axis=1,
            )
        df["PMV"] = df.apply(
            lambda row: pmv_ppd(
                tdb=row["ta"],
                tr=row["tr"],
                vr=row["vr"],
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                units="IP",
                standard="ashrae",
                ),
            axis=1,
            )
        df["SET"] = df.apply(
            lambda row: set_tmp(
                tdb=row["ta"],
                tr=row["tr"],
                v=row["vel"] / 60,
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                units="IP",
                ),
            axis=1,
            )
        df["CE"] = df.apply(
            lambda row: ""
            if row["vel"] / 60 * 0.3048 < 0.2
            else cooling_effect(
                tdb=row["ta"],
                tr=row["tr"],
                vr=row["vel"] / 60,
                rh=row["rh"],
                met=row["met"],
                clo=row["clo"],
                units="IP",
                ),
            axis=1,
            )

    # split the pmv column in two since currently contains both pmv and ppd values
    df = pd.concat([df.drop(["PMV", "vr"], axis=1), df["PMV"].apply(pd.Series)], axis=1)

    resp = make_response(df.to_csv(index=False))
    resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
    resp.headers["Content-Type"] = "text/csv"
    return resp


@app.route("/compare")
def compare():
    return render_template("compare.html")


@app.route("/ranges")
def ranges():
    return render_template("ranges.html")


@app.route("/EN")
def EN():
    return render_template("EN.html")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
