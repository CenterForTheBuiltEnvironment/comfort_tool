---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---

## Version 2.0.5 (2020-09-04)

Features:

- Fixed issues with calculation of outputs in the Upload tool and removed link to Codelab
- Added SET chart, which displays SET outputs as a function of the inout variables selected
- Added a note below SET chart
- Added a note below PMV heat loss chart
- Minor edits to the layout of the comfort tool  

## Version 2.0.4 (2020-07-17)

Features:

- Displaying the relative air speed and dynamic clothing among the outputs.
  
Fix:

- Fixed calculation comfort zone in Ranges

## Version 2.0.3 (2020-06-24)

Features:

- The Upload tool can be used to calculate LEED compliance.
- The Share button now also shares the chart type.
- Added notes about relative air speed and dynamic clothing calculation below charts.
- Added mean radiant temperature as input in the SolarCal tool.
  
Fix:

- Share fixed the issue with air speed and clothing.
- Changes y-label in chart air speed vs operative temperature.

## Version 2.0.2 (2020-06-09)

Features:

- The [dynamic clothing insulation](http://centerforthebuiltenvironment.github.io/comfort_tool/docs/pmv#dynamic-clothing-insulation) is automatically calculated by the tool.
  
Fix:

- Upload was throwing error for files with more than 1000 inputs.
- Improved calculation speed for Upload tool.

## Version 2.0.1 (2020-06-05)

Features:

- The [relative air speed](http://centerforthebuiltenvironment.github.io/comfort_tool/docs/pmv#relative-air-speed) is automatically calculated by the tool.
- Added Save, Restore and Share button.
- Added tooltips to provide additional information to the user.
  
Fix:

- Upload not does not throw an error if the cooling effect cannot be calculated.
- Upgraded to new version of pythermalcomfort.
- Fixed issue solar gain calculation with IP units.

## Version 2.0.0 (2020-05-06)

Features:

- Navigation bar responsive.
- Created new documentation website.
  
Fix:

- Issue with HeatLoss chart.
  
  