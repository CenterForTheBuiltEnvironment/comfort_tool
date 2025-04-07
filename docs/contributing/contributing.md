# Contributing

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Python 3 and Node.js installed on your machine.

If you do not have Python installed on your machine you can follow [this guide](https://wiki.python.org/moin/BeginnersGuide/Download)

If you do not have Node.js installed on your machine you can follow [this guide](https://nodejs.org/en/download/)

## Installation

This guide is for Mac OSX, Linux or Windows.

1.  **Get the source code from the GitHub repository**

    ```
     $ git clone https://github.com/CenterForTheBuiltEnvironment/comfort-tool.git
     $ cd comfort_tool
    ```
2. **Create a virtual environment using pipenv to install the dependencies (recommended):**
3.  **Install Node.js dependencies**

    `npm install`
4.  **Run CBE Thermal Comfort Tool locally**

    Now you should be ready to run the tool locally. `python3 comfort.py`

    Visit [http://localhost:5000](http://localhost:5000) in your browser to check it out. Note that whenever you want to run the tool, you have to activate the virtual environment first.

## Testing

We are using [Jest](https://jestjs.io/docs/en/getting-started.html) to test the JavaScript functions.

If you want to find out more please read their official documentation or look at how we are testing the [ERF functions (file name erf.js)](../../static/js/erf.js) using the test file `erf.test.js`.

Finally, run `npm run test`. You should write tests for all the new functions you add and ensure that you get positive results from the tests. Also run tests before deploying a new version of the CBE Thermal Comfort Tool.

## Versioning

When you release a new version of the tool you should first use `bumpversion` to update the version of the tool. You can use the following command:

```
bumpversion patch  # alternatively, you can use minor or major instead of patch
```

Secondly, you should describe the changes in `docs/changelog/changelog.md`

## Deploying

We are deploying the tool using Google Cloud Run. The project is automatically deployed when you push to `master` the commit message that includes the word `bump version`. Check the GitHub action in the folder `./.github/workflows/deploy.yml` for more information about how we build and deploy the application.

Alternatively, you can deploy a new version of the tool to Google Cloud Run using the following command. Please note that you must set a valid account before running the command and add your email in the code below.

````
# Test version

```bash
gcloud components update --quiet
pipenv requirements > requirements.txt
gcloud config set account <your-email>
gcloud builds submit --project=comfort-327718 \
  --substitutions=_REPO_NAME="comfort-tool-test",_PROJ_NAME="comfort-327718",_IMG_NAME="comfort-tool-test"
```

# Public facing version

```bash
gcloud components update --quiet
pipenv requirements > requirements.txt
gcloud config set account <your-email>
gcloud builds submit --project=comfort-327718 \
  --substitutions=_REPO_NAME="comfort-tool",_PROJ_NAME="comfort-327718",_IMG_NAME="comfort-tool-main"
```
````
