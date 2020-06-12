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

    results = []
    ta = df['ta'].values
    tr = df['tr'].values
    vel = df['vel'].values
    rh = df['rh'].values
    met = df['met'].values
    clo = df['clo'].values

    for ix in range(df.shape[0]):
        if si_unit:
            units = "SI"
            _vr = v_relative(vel[ix], met[ix])
        else:
            units = "IP"
            _vr = v_relative(vel[ix] / 60 * 0.3048, met[ix]) * 3.28084

        try:
            _set = set_tmp(ta[ix], tr[ix], _vr, rh[ix], met[ix], clo[ix], units=units)
        except:
            _set = ""
        try:
            _ce = cooling_effect(ta[ix], tr[ix], _vr, rh[ix], met[ix], clo[ix],
                units=units)
        except:
            _ce = ""
        try:
            _pmv_ppd = pmv_ppd(ta[ix], tr[ix], _vr, rh[ix], met[ix], clo[ix],
                standard="ashrae", units=units)
            _pmv = _pmv_ppd['pmv']
            _ppd = _pmv_ppd['ppd']
        except:
            _pmv, _ppd = ["", ""]
        results.append({"pmv": _pmv, "ppd": _ppd, "ce": _ce, "vr": _vr, "set": _set})

    # split the pmv column in two since currently contains both pmv and ppd values
    df_ = pd.DataFrame(results)
    df = pd.concat([df, df_], axis=1, sort=False)

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
    app.run(debug=False)
