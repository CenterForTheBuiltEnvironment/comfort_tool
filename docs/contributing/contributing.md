# Contributing

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Python 3 and Node.js installed on your machine.

If you do not have Python installed on your machine you can follow [this guide](https://wiki.python.org/moin/BeginnersGuide/Download)

If you do not have Node.js installed on your machine you can follow [this guide](https://nodejs.org/en/download/)

## Installation

This guide is for Mac OSX, Linux or Windows.

1. **Get the source code from the GitHub repository**

   ```text
    $ git clone https://github.com/CenterForTheBuiltEnvironment/comfort-tool.git
    $ cd comfort_tool
   ```

2. **Create a virtual environment using the following command:**

   On Linux and MAC `$ python3 -m venv venv`

   On Windows `py -3 -m venv venv`

3. **Activate the virtualenv:**

   On Linux and MAC `$ . venv/bin/activate`

   On Windows `venv\Scripts\activate`

   Your shell prompt will change to show the name of the activated environment.

4. **Install Python dependencies**

   The dependencies of the comfort tool are all contained in _requirements.txt_. Install them all using: `$ pip install -r requirements.txt`

5. **Install Node.js dependencies**

   `npm install`

6. **Run CBE Thermal Comfort Tool locally**

   Now you should be ready to run the tool locally. `python3 comfort.py`

   Visit [http://localhost:5000](http://localhost:5000) in your browser to check it out. Note that whenever you want to run the tool, you have to activate the virtual environment first.

## Testing

We are using [Jest](https://jestjs.io/docs/en/getting-started.html) to test the JavaScript functions.

If you want to find out more please read their official documentation or look at how we are testing the [ERF functions \(file name erf.js\)](https://github.com/CenterForTheBuiltEnvironment/comfort_tool/blob/master/static/js/erf.js) using the test file `erf.test.js`.

Finally, run `npm run test`. You should write tests for all the new functions you add and ensure that you get positive results from the tests. Also run tests before deploying a new version of the CBE Thermal Comfort Tool.

## Versioning

When you release a new version of the tool you should first use `bumpversion` to update the version of the tool. You can use the following command:

```text
    bumpversion patch  # alternatively you can use minor or major instead of patch
```

Secondly, you should describe the changes in `docs/changelog/changelog.md`

