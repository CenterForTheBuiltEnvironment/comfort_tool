# CBE Thermal Comfort Tool

A web interface for comfort model calculations and visualizations according to ASHRAE Standard-55, EN Standard 16798 and ISO Standard 7730. 

[Live deployment of the tool](http://comfort.cbe.berkeley.edu/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Python 3 and Node.js installed on your machine.

If you do not have Python installed on your machine you can follow [this guide](https://wiki.python.org/moin/BeginnersGuide/Download)

If you do not have Node.js installed on your machine you can follow [this guide](https://nodejs.org/en/download/)

### Installation

This guide is for Mac OSX, Linux or Windows.

1. **Get the source code from the GitHub repository**
```
$ git clone https://github.com/CenterForTheBuiltEnvironment/comfort-tool.git
$ cd comfort_tool
```
2. **Create a virtual environment using the following command:**

On Linux and MAC ` $ python3 -m venv venv `

On Windows ` py -3 -m venv venv `

3. **Activate the virtualenv:**

On Linux and MAC ` $ . venv/bin/activate `

On Windows ` venv\Scripts\activate `

Your shell prompt will change to show the name of the activated environment.

4. **Install Python dependencies**

The dependencies of the comfort tool are all contained in *requirements.txt*. 
Install them all using:
`$ pip install -r requirements.txt`

5. **Install Node.js dependencies**

`npm install`

6. **Run CBE Thermal Comfort Tool locally**

Now you should be ready to run the tool locally.
`python3 comfort.py`

Visit http://localhost:5000 in your browser to check it out. 
Note that whenever you want to run the tool, you have to activate the virtualenv first.

### Testing

We are using [Jest](https://jestjs.io/docs/en/getting-started.html) to test the JavaScript functions.

If you want to find out more please read their official documentation or look at how we are testing the [ERF functions (file name erf.js)](https://github.com/CenterForTheBuiltEnvironment/comfort_tool/blob/master/static/js/erf.js) using the test file `erf.test.js`.

Finally run `npm run test`. You should write tests for all the new functions you add and ensure that you get positive results from the tests. Also run tests before deploying a new version of the CBE Thermal Comfort Tool.

### Versioning
When you release a new version of the tool you should first use `bumpversion` to update the version of the tool. You can use the following command:
```cmd
bumpversion patch  # alternatively you can use minor or major instead of patch
```

Secondly you should describe the changes in `docs/changelog.md`

### Features

1. Models.
    * Adaptive (inputs: air temperature, MRT, mean outdoor temperature, air speed)
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
13. Comfort Ranges: the ability to plot how the PMV and PPD ranges change in the psychrometric chart when clothing, metabolic activity, air speed, and mean radiant temperature variables are changed within a given range.
14. Comparison of comfort conditions: possibility of visually comparing two or more thermal comfort simulations. Instead of manually transcribing the output of thermal comfort simulations with the tool, it would be practical to enable a simple visualization to compare several conditions.
15. EN 15251 compliance: this section of the tool can be used to assess the compliance of indoor conditions to the European standard.


## Documentation
To edit or generate new documentation please refer to the [README.md](https://github.com/CenterForTheBuiltEnvironment/comfort_tool/blob/master/website/README.md) file which is located in the `./website` folder.