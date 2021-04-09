import os
import csv
from io import TextIOWrapper
from flask import Flask, request, render_template, send_from_directory, abort, redirect, jsonify
from pythermalcomfort.models import pmv_ppd, set_tmp, cooling_effect
from flask_csv import send_csv

ALLOWED_EXTENSIONS = {'csv'}

STATIC_URL_PATH = '/static'

app = Flask(__name__, static_url_path=STATIC_URL_PATH)


# define the extension files that can be uploded by users
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/download/<path:filename>')
def download_file(filename):
    if '..' in filename:
        abort(404)
    return send_from_directory('./media/', filename, mimetype="application/octet-stream")


@app.route('/api/v1/comfort/pmv', methods=['GET'])
def api_id():
    # Check if an ID was provided as part of the URL.
    # If ID is provided, assign it to a variable.
    # If no ID is provided, display an error in the browser.
    try:
        clo = float(request.args['clo'])
        ta = float(request.args['ta'])
        tr = float(request.args['tr'])
        v = float(request.args['v'])
        met = float(request.args['met'])
        rh = float(request.args['rh'])
    except:
        return "Error: You did not provided all the input parameters"

    # Create an empty list for our results
    results = dict()

    value = pmv_ppd(ta, tr, v, rh, met, clo, wme=0, standard="ASHRAE")
    results['data'] = []
    results['data'].append(value)
    results['message'] = "success"

    # Use the jsonify function from Flask to convert our list of
    # Python dictionaries to the JSON format.
    return jsonify(results)


# Upload page - The user can upload a csv with input environmental parameters and retruns a csv with indexes calculated
@app.route('/upload')  # tutorial https://stackoverflow.com/questions/27628053/uploading-and-downloading-files-with-flask
def upload():
    return render_template('upload.html')


# Upload page - The user can upload a csv with input environmental parameters and retruns a csv with indexes calculated
@app.route('/other_tools')  # tutorial https://stackoverflow.com/questions/27628053/uploading-and-downloading-files-with-flask
def other_tools():
    return render_template('other_tools.html')


# this function process the uploaded file and automatically downloads the file with the results
@app.route('/transform', methods=["POST"])
def transform_view():
    # get the uploeded file
    request_file = request.files['data_file']

    # check file
    if not request_file:
        return "No file selected"
    if not allowed_file(request_file.filename):
        return "The file format is not allowed. Please upload a csv"

    # read file
    csv_file = TextIOWrapper(request_file, encoding='utf-8')
    csv_reader = csv.DictReader(csv_file, delimiter=',')
    fields = {'Air temperature': 'ta', 'MRT': 'tr', 'Air velocity': 'vel', 'Relative humidity': 'rh', 'Metabolic rate': 'met', 'Clothing level': 'clo'}
    si_unit = True
    if any([True for x in csv_reader.fieldnames if x.split(' [')[1] == 'F]']):
        si_unit = False
    csv_reader.fieldnames = [fields[x.split(' [')[0]] for x in csv_reader.fieldnames]
    results = []

    # calculated indexes and return file
    for row in csv_reader:
        for element in row.keys():
            row[element] = float(row[element])
        if si_unit:
            r = pmv_ppd(ta=row['ta'], tr=row['tr'], vr=row['vel'], rh=row['rh'], met=row['met'], clo=row['clo'], standard="ashrae")
            row['SET'] = set_tmp(ta=row['ta'], tr=row['tr'], v=row['vel'], rh=row['rh'], met=row['met'], clo=row['clo'])
            row['CE'] = cooling_effect(ta=row['ta'], tr=row['tr'], vr=row['vel'], rh=row['rh'], met=row['met'], clo=row['clo'])
        else:
            v = row['vel'] / 60
            r = pmv_ppd(ta=row['ta'], tr=row['tr'], vr=v, rh=row['rh'], met=row['met'], clo=row['clo'], units="IP", standard="ashrae")
            row['SET'] = set_tmp(ta=row['ta'], tr=row['tr'], v=v, rh=row['rh'], met=row['met'], clo=row['clo'], units="IP")
            row['CE'] = cooling_effect(ta=row['ta'], tr=row['tr'], vr=v, rh=row['rh'], met=row['met'], clo=row['clo'], units="IP")
        row['PMV'] = r['pmv']
        row['PPD'] = r['ppd']
        results.append(row)

    return send_csv(results, "results.csv", list(row.keys()))


@app.route('/compare')
def compare():
    return render_template('compare.html')


@app.route('/ranges')
def ranges():
    return render_template('ranges.html')


@app.route('/EN')
def EN():
    return render_template('EN.html')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
