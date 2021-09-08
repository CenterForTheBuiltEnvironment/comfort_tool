# Changelog

## Version 2.3.1 \(2020-07-30\)

Fix:

* Fix equation to calculate radiative heat transfer coefficient in SET equation

Features:

* Assuming that a person is sitting when calculating SET temperature

## Version 2.3.0 \(2020-07-29\)

Features:

* Added PHS model
* Added fan heatwaves model

## Version 2.2.0 \(2020-07-14\)

Fix:

* Error calculation of PMV in EN tab

Features:

* Improved tooltip look

## Version 2.1.7 \(2020-04-16\)

Features:

* Improved documentation and made charts responsive

## Version 2.1.6 \(2020-04-09\)

Fix:

* Removed old vertical temperature gradient calculator

## Version 2.1.5 \(2020-04-06\)

Fix:

* Local discomfort tab the code was broken

## Version 2.1.4 \(2020-03-30\)

Fix:

* Spinner behavior compare tab
* Units in note under range chart
* dilation coefficient in SET equation

Features:

* Implemented test for all the major functions
* Added `bumpversion` to track version of the tool

## Version 2.1.3 \(2020-03-17\)

Features:

* Changed compliance from ASHRAE 55 2017 to ASHRAE 55 2020

## Version 2.1.2 \(2020-03-11\)

Fix:

* Equation to calculate heat transfer coefficient SET equation.
* Default value of clo and met dropdown now matches the default input value.

Features:

* Wrote testing for ERF, SET and PMV equations

## Version 2.1.1 \(2021-02-04\)

Fix:

* Error calculation SHARP and solar altitude supine person.  

## Version 2.1.0 \(2020-10-19\)

Features:

* Changed limit for elevated air speed calculation from 0.2 m/s to 0.1 m/s.  

## Version 2.0.6 \(2020-09-08\)

Features:

* Fixed minor issue in the erf equation. Updated fp tables and E\_diff equation.  

## Version 2.0.5 \(2020-09-04\)

Features:

* Fixed issues with calculation of outputs in the Upload tool and removed link to Codelab
* Added SET chart, which displays SET outputs as a function of the inout variables selected
* Added a note below SET chart
* Added a note below PMV heat loss chart
* Minor edits to the layout of the comfort tool  

## Version 2.0.4 \(2020-07-17\)

Features:

* Displaying the relative air speed and dynamic clothing among the outputs.

Fix:

* Fixed calculation comfort zone in Ranges

## Version 2.0.3 \(2020-06-24\)

Features:

* The Upload tool can be used to calculate LEED compliance.
* The Share button now also shares the chart type.
* Added notes about relative air speed and dynamic clothing calculation below charts.
* Added mean radiant temperature as input in the SolarCal tool.

Fix:

* Share fixed the issue with air speed and clothing.
* Changes y-label in chart air speed vs operative temperature.

## Version 2.0.2 \(2020-06-09\)

Features:

* The [dynamic clothing insulation](https://center-for-the-built-environment.gitbook.io/thermal-comfort-tool/documentation/pmv#dynamic-clothing-insulation) is automatically calculated by the tool.

Fix:

* Upload was throwing error for files with more than 1000 inputs.
* Improved calculation speed for Upload tool.

## Version 2.0.1 \(2020-06-05\)

Features:

* The [relative air speed](https://center-for-the-built-environment.gitbook.io/thermal-comfort-tool/documentation/pmv#air-speed) is automatically calculated by the tool.
* Added Save, Restore and Share button.
* Added tooltips to provide additional information to the user.

Fix:

* Upload not does not throw an error if the cooling effect cannot be calculated.
* Upgraded to new version of pythermalcomfort.
* Fixed issue solar gain calculation with IP units.

## Version 2.0.0 \(2020-05-06\)

This version complies with the ASHRAE Standard 55-2017. You can access this version of the tool using [this link](https://comfort-tool-63o6tweb2a-uc.a.run.app). Please note that this version is no longer supported and may contain errors that have been fixed in newer releases.

Features:

* Navigation bar responsive.
* Created new documentation website.

Fix:

* Issue with HeatLoss chart.

