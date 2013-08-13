import os
import csv
from flask import Flask, request, make_response, render_template, json

ALLOWED_EXTENSIONS = set(['csv', 'json'])

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def csv2json(f):
    l = []
    csv_reader = csv.reader(f)
    head = csv_reader.next()
    for row in csv_reader:
        d = dict(zip(head, row))
        l.append(d)
    return l

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['files[]']
        if f and allowed_file(f.filename):
            conds = csv2json(f) 
            return make_response(json.dumps(conds))
                 
    return render_template('upload.html')

@app.route('/simulation')
def simulation():
    return render_template('simulation.html')

@app.route('/heat-loss')
def heat_loss():
    return render_template('heat-loss.html')

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
    app.run(debug=True)
