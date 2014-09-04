Comfort models
==============

This describes comfort model API, consisting of the functions of the comf object. To use this, simply include util.js, psychrometrics.js, and comfortmodels.js as scripts:

```
<script type="text/javascript" src="/static/js/util.js"></script>
<script type="text/javascript" src="/static/js/psychrometrics.js"></script>
<script type="text/javascript" src="/static/js/comfortmodels.js"></script>
```

Details
-------

### comf.pmv(ta, tr, vel, rh, met, clo, wme)

This function is Fanger's Predicted Mean Vote model.

*Input parameters:*

* ta : Air temperature [°C]
* tr : Mean radiant temperature [°C]
* vel : Air velocity [m/s]
* rh : Relative humidity [%]
* met : Metabolic rate [met]
* clo : Clothing insulation level [clo]
* wme : External work [W/m^2] (typically zero)

*Outputs an object with properties pmv, and ppd, where*

* pmv : Predicted mean vote
* ppd : Percent predicted dissatisfied

### comf.pmvElevatedAirspeed(ta, tr, vel, rh, met, clo, wme)

This is the PMV model, with a special technique that allows air speeds above 0.15m/s to be modeled.

*Input parameters as in comf.pmv*.

*Outputs an object with properties:*

* pmv : Predicted mean vote
* ppd : Percent predicted dissatisfied [%]
* ta_adj: Air temperature adjusted for air speed [°C]
* cooling_effect : The difference between the air temperature and adjusted air temperature [°C]
* set: The Standard Effective Temperature [°C] (see below)

### comf.pierceSET(ta, tr, vel, rh, met, clo, wme)

This is the pierce Standard Effective Temperature model, also known as the "two-node" model.

*Input parameters as in comf.pmv*.

*Outputs a number representing SET [°C]*

### comf.adaptiveComfortASH55(ta, tr, runningMean, vel)

The ASHRAE Standard-55 adaptive comfort model.

*Input parameters:*

* ta : Air temperature [°C]
* tr : Mean radiant temperature [°C]
* runningMean : Mean daily average outdoor temperature (see standard 55) [°C]
* vel : Air velocity [m/s]. Must be less than or equal to 0.3, or one of 0.6, 0.9, and 1.2

*Outputs an object with properties*:

* tComfLower80 : The lower boundary of the 80% acceptability limits [°C]
* tComfUpper80 : The upper boundary of the 80% acceptability limits [°C]
* tComfLower90 : The lower boundary of the 90% acceptability limits [°C]
* tComfUpper90 : The upper boundary of the 90% acceptability limits [°C]
* acceptability80 : True if the input conditions lie within the 80% acceptability limits, false otherwise
* acceptability90 : True if the input conditions lie within the 90% acceptability limits, false otherwise

### comf.adaptiveComfortEN15251(ta, tr, runningMean)

The EN-15251 adaptive comfort model.

*Input parameters:*

* ta : Air temperature [°C]
* tr : Mean radiant temperature [°C]
* runningMean : Running mean average outdoor temperature (see EN15251) [°C]

*Outputs an object with properties:*

* tComfILower : The lower boundary of the class I acceptability limits [°C]
* tComfIUpper : The upper boundary of the class I acceptability limits [°C]
* tComfIILower : The lower boundary of the class II acceptability limits [°C]
* tComfIIUpper : The upper boundary of the class II acceptability limits [°C]
* tComfIIILower : The lower boundary of the class III acceptability limits [°C]
* tComfIIIUpper : The upper boundary of the class III acceptability limits [°C]
* acceptabilityI : True if the input conditions lie within the class I acceptability limits, false otherwise
* acceptabilityII : True if the input conditions lie within the class II acceptability limits, false otherwise
* acceptabilityIII : True if the input conditions lie within the class III acceptability limits, false otherwise
