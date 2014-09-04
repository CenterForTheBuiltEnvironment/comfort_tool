comfort-tool
============

The Center for the Built Environment at University of California Berkeley has been developing a web-based tool for Standard-55 with several goals and motives in mind. Foremost, the need for having thermal comfort calculations available on all platforms, in particular Mac OSX, and the need for the ability to quickly fix bugs and update the software according to Standard Addenda. There is great potential for informative, interactive visualizations that would be suited very well for implementation in a browser. The existing tool is robust, but the C++/WIN32 platform has limitations. It would be much more difficult to implement visualizations for the tool, and they would still reach a smaller audience due to platform dependence.

A web application is instead easy to update and maintain, has great potential and resources for visualization, and can be used in any device with a supported browser, including mobile devices. The latest version of the tool is available here: cbe.berkeley.edu/comforttool

Existing features of the web-tool
The short development time of the initial phase of the project has yielded most existing features of the official tool in web-based format. It has been designed with principles of user-friendliness and simplicity.


Features
========

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
