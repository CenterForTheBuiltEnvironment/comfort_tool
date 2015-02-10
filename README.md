CBE Thermal Comfort Tool
========================

A web interface for comfort model calculations and visualizations according to ASHRAE Standard-55. [Live deployment of the tool](http://smap.cbe.berkeley.edu/comforttool).

Installation
------------

This guide is for Mac OSX or Linux. For Windows, you can follow the instructions below, substituting the appropriate windows commands found in the [Flask installation instructions](http://flask.pocoo.org/docs/0.10/installation/).

The installation is easiest with [pip](http://pip.readthedocs.org/en/latest/installing.html), a tool for managing python packages.

Once you have pip, start by installing virutalenv:

`$ sudo pip install virtualenv`

Next, check out from the repo and create a virtualenv:

```
$ git clone https://github.com/CenterForTheBuiltEnvironment/comfort-tool.git
$ cd comfort-tool
$ virtualenv venv
```

Activate the virtualenv:

`$ . venv/bin/activate`

The dependencies of the comfort tool are all contained in `requirements.txt`. Installing them all in one command is pretty nifty:

`$ pip install -r requirements.txt`

Now you should be ready to run the tool locally.

`$ python comfort.py`

Visit http://localhost:5000 in your browser to check it out. Note that whenever you want to run the tool, you have to activate the virtualenv first.

Static files
------------

If you're serving static files from somewhere other than /static/, modify the static file paths ...

Set STATIC_URL_PATH in `comfort.py`

Set util.STATIC_URL_PATH in `static/js/util.js`

Finally, manually change the path as needed in `static/html/leed.html` for the `/static/css/psychchart.css` stylesheet.

Features
--------

1. Models
  * Adaptive (input: air temperature, MRT, mean outdoor temperature, air velocity)
  * PMV with elevated air speed
2. Clothing ensemble creator
3. Clothing and metabolic activity tables
4. Dual units (SI, IP)
5. Local air speed control
6. Operative temperature specification or Air temperature and Mean Radiant Temperature specification
7. 1-to-1 humidity specification conversion (Relative humidity, vapor pressure, dew point, wet bulb, humidity ratio)
8. Globe temperature to MRT converter – input: air temperature, air speed, globe temperature, globe diameter, globe emissivity. Output: Mean Radiant Temperature
9. Feeding model calculations to a LEED document: This feature automates the creation of LEED documents relating to thermal comfort. It includes thermal comfort model outputs and local thermal discomfort questionnaire.
10. Local thermal discomfort: short questionnaire that allows the user to assess risks of local thermal discomfort as defined by Standard 55
11. Interactive charts: psychrometric chart, temperature–relative humidity chart, adaptive chart
12. Mouse values: psychrometric variables displayed for each position of the cursor when the mouse moves on the chart
13. Dynamic predictive clothing calculator
14. Comfort Ranges: the ability to plot how the PMV and PPD ranges change in the psychrometric chart when clothing, metabolic activity, air velocity, and mean radiant temperature variables are changed within a given range
15. Comparison of comfort conditions: possibility of visually comparing two or more thermal comfort simulations. Instead of manually transcribing the output of thermal comfort simulations with the tool, it would be practical to enable a simple visualization to compare several conditions
16. EN 15251 compliance: this section of the tool can be used to assess the compliance of indoor conditions to the European standard.
