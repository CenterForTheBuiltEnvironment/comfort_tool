# CBE Thermal Comfort Tool

A web interface for comfort model calculations and visualizations according to ASHRAE Standard-55, EN Standard 16798 and ISO Standard 7730. 

[Live deployment of the tool](http://comfort.cbe.berkeley.edu/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Python 3 installed on your machine.

If you do not have Python installed on your machine you can follow [this guide](https://wiki.python.org/moin/BeginnersGuide/Download)

## Installation

This guide is for Mac OSX, Linux or Windows.

**Check out from the repo.**
```
$ git clone https://github.com/CenterForTheBuiltEnvironment/comfort-tool.git
$ cd comfort_tool
```
**Create a vitrual environment using the following command:**

On Linux and MAC ` $ python3 -m venv venv `

On Windows ` py -3 -m venv venv `

**Activate the virtualenv:**

On Linux and MAC ` $ . venv/bin/activate `

On Windows ` venv\Scripts\activate `

Your shell prompt will change to show the name of the activated environment.

The dependencies of the comfort tool are all contained in *requirements.txt*. 
Install them all using:
`$ pip install -r requirements.txt`

Now you should be ready to run the tool locally.
`python3 comfort.py`

Visit http://localhost:5000 in your browser to check it out. 
Note that whenever you want to run the tool, you have to activate the virtualenv first.

## Static files
If you're serving static files from somewhere other than /static/, modify the static file paths ...

Set STATIC_URL_PATH in `comfort.py`

Set util.STATIC_URL_PATH in `static/js/util.js`

Finally, manually change the path as needed in `static/html/leed.html` for the `/static/css/psychchart.css` stylesheet.

## Features

1. Models.
    * Adaptive (inputs: air temperature, MRT, mean outdoor temperature, air velocity)
    * PMV with and without elevated air speed
2. Clothing ensemble creator.
3. Clothing and metabolic activity tables.
4. Dual units (SI, IP).
5. Local air speed control.
6. Operative temperature specification or Air temperature and Mean Radiant Temperature specification.
7. 1-to-1 humidity specification conversion (Relative humidity, vapor pressure, dew point, wet bulb, humidity ratio).
8. Globe temperature to MRT converter – input: air temperature, air speed, globe temperature, globe diameter, globe emissivity. Output: Mean Radiant Temperature.
9. Local thermal discomfort: short questionnaire that allows the user to assess risks of local thermal discomfort as defined by Standard 55.
10. Interactive charts: psychrometric chart, temperature–relative humidity chart, adaptive chart.
11. Mouse values: psychrometric variables displayed for each position of the cursor when the mouse moves on the chart.
12. Dynamic predictive clothing calculator.
13. Comfort Ranges: the ability to plot how the PMV and PPD ranges change in the psychrometric chart when clothing, metabolic activity, air velocity, and mean radiant temperature variables are changed within a given range.
14. Comparison of comfort conditions: possibility of visually comparing two or more thermal comfort simulations. Instead of manually transcribing the output of thermal comfort simulations with the tool, it would be practical to enable a simple visualization to compare several conditions.
15. EN 15251 compliance: this section of the tool can be used to assess the compliance of indoor conditions to the European standard.


## Documentation
To edit or generate new documentation please refer to the README.md file which is located in the website folder.


## Deploy to Google Cloud Run

You can follow [this guide](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/python).
Key stepssummarized below. Dependencies: [Cloud SDK](https://cloud.google.com/sdk/docs/install)

Build your container image using Cloud Build, by running the following command from the directory containing the Dockerfile:
```
gcloud builds submit --tag gcr.io/legacy-cbe-comfort-tool/comfort-tool  --project=legacy-cbe-comfort-tool
```

Deploying to Cloud Run -- To deploy the container image use the following command:
```
gcloud run deploy --image gcr.io/legacy-cbe-comfort-tool/comfort-tool --platform managed  --project=legacy-cbe-comfort-tool
```
