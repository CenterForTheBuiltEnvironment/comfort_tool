import os
import csv
from flask import Flask, request, make_response, render_template, json, send_from_directory, abort, redirect

ALLOWED_EXTENSIONS = set(['csv', 'json'])

STATIC_URL_PATH = '/static'

app = Flask(__name__, static_url_path=STATIC_URL_PATH)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def csv2json(f):
    l = []
    csv_reader = csv.reader(f)
    head = csv_reader.next()
    fields = {'Air temperature': 'ta', 'MRT': 'tr', 'Air velocity': 'vel', 
              'Relative humidity': 'rh', 'Metabolic rate': 'met', 'Clothing level' : 'clo'}
    head_abbr = []
    for h in head:
      found = False
      for f in fields.keys():
        if f in h:
          head_abbr.append(fields[f])
          found = True
      if not found:
        head_abbr.append(h)
    for row in csv_reader:
        d = dict(zip(head_abbr, row))
        l.append(d)
    return l

@app.route('/download/<path:filename>')
def download_file(filename):
  if '..' in filename:
    abort(404)
  return send_from_directory('./media/', filename, mimetype="application/octet-stream")


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['files[]']
        if f and allowed_file(f.filename):
            conds = csv2json(f) 
            return make_response(json.dumps(conds))
                 
    return render_template('upload.html')

@app.route('/mrt')
def mrt():
    return render_template('mrt.html')
    
@app.route('/compare')
def compare():
    return render_template('compare.html')
    
@app.route('/ranges')
def ranges():
    return render_template('ranges.html')

@app.route('/EN')
def EN():
    return render_template('EN.html')

@app.route('/comforttool')
def comforttool():
    return redirect('/')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
