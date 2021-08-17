/*
This file contains all the global variables shared among the .js file.

I have grouped them all here so there is no repetition, hence, it should be easier to fix issues and maintain consistency.

Remember to include this file in the HTML file if you want to access these variables
 */

let d = {
  ta: "",
  tr: "",
  vel: "",
  rh: "",
  met: "",
  clo: "",
  trm: "",
  vel_a: "",
};

let d_cache = {
  ta: "",
  tr: "",
  vel: "",
  rh: "",
  met: "",
  clo: "",
  trm: "",
  vel_a: "",
};

let keys = ["ta", "tr", "vel", "rh", "met", "clo", "trm", "vel_a"];

// Clothes ensembles that are shown in the drop down menu. The values are sorted by clo in ascending order
let cloInsulationTypicalEnsembles = [
  {
    clothing: "Walking shorts, short-sleeve shirt: 0.36 clo",
    clo: 0.36,
  },
  {
    clothing: "Typical summer indoor clothing: 0.5 clo",
    clo: 0.5,
  },
  {
    clothing:
      "Knee-length skirt, short-sleeve shirt, sandals, underwear: 0.54 clo",
    clo: 0.54,
  },
  {
    clothing: "Trousers, short-sleeve shirt, socks, shoes, underwear: 0.57 clo",
    clo: 0.57,
  },
  {
    clothing: "Trousers, long-sleeve shirt: 0.61 clo",
    clo: 0.61,
  },
  {
    clothing: "Knee-length skirt, long-sleeve shirt, full slip: 0.67 clo",
    clo: 0.67,
  },
  {
    clothing: "Sweat pants, long-sleeve sweatshirt: 0.74 clo",
    clo: 0.74,
  },
  {
    clothing: "Jacket, Trousers, long-sleeve shirt: 0.96 clo",
    clo: 0.96,
  },
  {
    clothing: "Typical winter indoor clothing: 1.0 clo",
    clo: 1.0,
  },
];

// Clothing insulation of individual
let cloInsulationGarments = [
  {
    article: "Metal chair",
    clo: 0.0,
  },
  {
    article: "Bra",
    clo: 0.01,
  },
  {
    article: "Wooden stool",
    clo: 0.01,
  },
  {
    article: "Ankle socks",
    clo: 0.02,
  },
  {
    article: "Shoes or sandals",
    clo: 0.02,
  },
  {
    article: "Slippers",
    clo: 0.03,
  },
  {
    article: "Panty hose",
    clo: 0.02,
  },
  {
    article: "Calf length socks",
    clo: 0.03,
  },
  {
    article: "Women's underwear",
    clo: 0.03,
  },
  {
    article: "Men's underwear",
    clo: 0.04,
  },
  {
    article: "Knee socks (thick)",
    clo: 0.06,
  },
  {
    article: "Short shorts",
    clo: 0.06,
  },
  {
    article: "Walking shorts",
    clo: 0.08,
  },
  {
    article: "T-shirt",
    clo: 0.08,
  },
  {
    article: "Standard office chair",
    clo: 0.1,
  },
  {
    article: "Executive chair",
    clo: 0.15,
  },
  {
    article: "Boots",
    clo: 0.1,
  },
  {
    article: "Sleeveless scoop-neck blouse",
    clo: 0.12,
  },
  {
    article: "Half slip",
    clo: 0.14,
  },
  {
    article: "Long underwear bottoms",
    clo: 0.15,
  },
  {
    article: "Full slip",
    clo: 0.16,
  },
  {
    article: "Short-sleeve knit shirt",
    clo: 0.17,
  },
  {
    article: "Sleeveless vest (thin)",
    clo: 0.1,
  },
  {
    article: "Sleeveless vest (thick)",
    clo: 0.17,
  },
  {
    article: "Sleeveless short gown (thin)",
    clo: 0.18,
  },
  {
    article: "Short-sleeve dress shirt",
    clo: 0.19,
  },
  {
    article: "Sleeveless long gown (thin)",
    clo: 0.2,
  },
  {
    article: "Long underwear top",
    clo: 0.2,
  },
  {
    article: "Thick skirt",
    clo: 0.23,
  },
  {
    article: "Long-sleeve dress shirt",
    clo: 0.25,
  },
  {
    article: "Long-sleeve flannel shirt",
    clo: 0.34,
  },
  {
    article: "Long-sleeve sweat shirt",
    clo: 0.34,
  },
  {
    article: "Short-sleeve hospital gown",
    clo: 0.31,
  },
  {
    article: "Short-sleeve short robe (thin)",
    clo: 0.34,
  },
  {
    article: "Short-sleeve pajamas",
    clo: 0.42,
  },
  {
    article: "Long-sleeve long gown",
    clo: 0.46,
  },
  {
    article: "Long-sleeve short wrap robe (thick)",
    clo: 0.48,
  },
  {
    article: "Long-sleeve pajamas (thick)",
    clo: 0.57,
  },
  {
    article: "Long-sleeve long wrap robe (thick)",
    clo: 0.69,
  },
  {
    article: "Thin trousers",
    clo: 0.15,
  },
  {
    article: "Thick trousers",
    clo: 0.24,
  },
  {
    article: "Sweatpants",
    clo: 0.28,
  },
  {
    article: "Overalls",
    clo: 0.3,
  },
  {
    article: "Coveralls",
    clo: 0.49,
  },
  {
    article: "Thin skirt",
    clo: 0.14,
  },
  {
    article: "Long-sleeve shirtdress (thin)",
    clo: 0.33,
  },
  {
    article: "Long-sleeve shirtdress (thick)",
    clo: 0.47,
  },
  {
    article: "Short-sleeve shirtdress",
    clo: 0.29,
  },
  {
    article: "Sleeveless, scoop-neck shirt (thin)",
    clo: 0.23,
  },
  {
    article: "Sleeveless, scoop-neck shirt (thick)",
    clo: 0.27,
  },
  {
    article: "Sleeveless vest (thin)",
    clo: 0.13,
  },
  {
    article: "Sleeveless vest (thick)",
    clo: 0.22,
  },
  {
    article: "Long sleeve shirt (thin)",
    clo: 0.25,
  },
  {
    article: "Long sleeve shirt (thick)",
    clo: 0.36,
  },
  {
    article: "Single-breasted coat (thin)",
    clo: 0.36,
  },
  {
    article: "Single-breasted coat (thick)",
    clo: 0.44,
  },
  {
    article: "Double-breasted coat (thin)",
    clo: 0.42,
  },
  {
    article: "Double-breasted coat (thick)",
    clo: 0.48,
  },
];

// Metabolic rates of typical activities
let metRatesTypicalTasks = [
  {
    activity: "Sleeping: 0.7",
    met: 0.7,
  },
  {
    activity: "Reclining: 0.8",
    met: 0.8,
  },
  {
    activity: "Seated, quiet: 1.0",
    met: 1.0,
  },
  {
    activity: "Reading, seated: 1.0",
    met: 1.0,
  },
  {
    activity: "Writing: 1.0",
    met: 1.0,
  },
  {
    activity: "Typing: 1.1",
    met: 1.1,
  },
  {
    activity: "Standing, relaxed: 1.2",
    met: 1.2,
  },
  {
    activity: "Filing, seated: 1.2",
    met: 1.2,
  },
  {
    activity: "Flying aircraft, routine: 1.2",
    met: 1.2,
  },
  {
    activity: "Filing, standing: 1.4",
    met: 1.4,
  },
  {
    activity: "Driving a car: 1.5",
    met: 1.5,
  },
  {
    activity: "Walking about: 1.7",
    met: 1.7,
  },
  {
    activity: "Cooking: 1.8",
    met: 1.8,
  },
  {
    activity: "Table sawing: 1.8",
    met: 1.8,
  },
  {
    activity: "Walking 2mph (3.2kmh): 2.0",
    met: 2.0,
  },
  {
    activity: "Lifting/packing: 2.1",
    met: 2.1,
  },
  {
    activity: "Seated, heavy limb movement: 2.2",
    met: 2.2,
  },
  {
    activity: "Light machine work: 2.2",
    met: 2.2,
  },
  {
    activity: "Flying aircraft, combat: 2.4",
    met: 2.4,
  },
  {
    activity: "Walking 3mph (4.8kmh): 2.6",
    met: 2.6,
  },
  {
    activity: "House cleaning: 2.7",
    met: 2.7,
  },
  {
    activity: "Driving, heavy vehicle: 3.2",
    met: 3.2,
  },
  {
    activity: "Dancing: 3.4",
    met: 3.4,
  },
  {
    activity: "Calisthenics: 3.5",
    met: 3.5,
  },
  {
    activity: "Walking 4mph (6.4kmh): 3.8",
    met: 3.8,
  },
  {
    activity: "Tennis: 3.8",
    met: 3.8,
  },
  {
    activity: "Heavy machine work: 4.0",
    met: 4.0,
  },
  {
    activity: "Handling 100lb (45 kg) bags: 4.0",
    met: 4.0,
  },
  {
    activity: "Pick and shovel work: 4.4",
    met: 4.4,
  },
  {
    activity: "Basketball: 6.3",
    met: 6.3,
  },
  {
    activity: "Wrestling: 7.8",
    met: 7.8,
  },
];

// Metabolic rates of typical activities ASHRAE removed reclining and sleeping
let metRatesTypicalTasksASHRAE = metRatesTypicalTasks.filter(function (el) {
  return (
    el.met > 0.7 && el.met <= 4.0 // 0.8 is the reclining met
  ); // as defined in page 36 ASHRAE 55
});

// defined below the upper and lower limits for environmental variables as specified in ISO 7730 and ASHRAE
let envVarLimits = {
  ta: {
    si: {
      step: 0.5,
      default: 25,
      min: 0,
      max: 50,
    },
    ip: {
      step: 0.5,
      default: 77,
      min: 32,
      max: 122,
    },
  },
  tr: {
    si: {
      step: 0.5,
      default: 25,
      min: 0,
      max: 50,
    },
    ip: {
      step: 0.5,
      default: 77,
      min: 32,
      max: 122,
    },
  },
  vel: {
    si: {
      step: 0.1,
      default: 0.1,
      min: 0,
      max: 4,
      elevated_air_speed: 0.2,
    },
    ip: {
      step: 0.1,
      default: 20,
      min: 0,
      max: 790,
    },
  },
  rh: {
    step: 1,
    default: 50,
    min: 0,
    max: 100,
  },
  met: {
    step: 0.1,
    default: 1,
    min: 0.7,
    max: 4,
  },
  clo: {
    step: 0.1,
    default: 0.61, // this value needs to match one in the cloInsulationTypicalEnsambles
    min: 0,
    max: 4, // ISO imposes 2 and ASHRAE 1.5
  },
  trm: {
    si: {
      step: 0.5,
      default: 25,
      min: 10,
      max: 35,
    },
    ip: {
      step: 0.5,
      min: 40,
      max: 95,
    },
  },
  twb: {
    si: {
      step: 0.1,
      default: 25,
      min: 0.1,
      max: 36,
    },
    ip: {
      step: 0.1,
      default: 50,
      min: 33.2,
      max: 100,
    },
  },
  tdp: {
    si: {
      step: 0.1,
      default: 0.1,
      min: 15,
      max: 32,
    },
    ip: {
      step: 0.1,
      default: 45,
      min: 0.1,
      max: 90,
    },
  },
};

// Handles the toggling of the units between SI and IP
function toggleUnits() {
  let v;
  let hs = $("#humidity-spec").val();
  isCelsius = !isCelsius;

  // if the unit system is the SI
  if (isCelsius) {
    // change the temperature unit
    $(".tempunit").each(function () {
      $(this).html(" &deg;C");
    });

    // Convert the temperature to Celsius and revert the spinner limits
    $("#ta, #tr, #trm").each(function () {
      v = util.FtoC($(this).val());
      $(this).val(v.toFixed(1)).spinner({
        step: envVarLimits.ta.si.step,
        min: envVarLimits.ta.si.min,
        max: envVarLimits.ta.si.max,
      });
    });

    // change the air speed unit
    $(".vel-unit").html(" m/s");

    // Convert the air speed to m/s and revert the spinner limits
    v = $("#vel").val();
    $("#vel")
      .val(v / 196.9)
      .spinner({
        step: envVarLimits.vel.si.step,
        min: envVarLimits.vel.si.min,
        max: envVarLimits.vel.si.max,
        numberFormat: "n",
      });

    // change dewpoint and wetbulb temperature units
    if (hs === "dewpoint") {
      $("#rh-unit").html(" &deg;C");
      v = util.FtoC($("#rh").val());
      $("#rh").val(v.toFixed(1)).spinner({
        step: envVarLimits.tdp.si.step,
        min: envVarLimits.tdp.si.min,
        max: envVarLimits.tdp.si.max,
        numberFormat: "n",
      });
    } else if (hs == "wetbulb") {
      $("#rh-unit").html(" &deg;C");
      v = util.FtoC($("#rh").val());
      $("#rh").val(v.toFixed(1)).spinner({
        step: envVarLimits.twb.si.step,
        min: envVarLimits.twb.si.min,
        max: envVarLimits.twb.si.max,
        numberFormat: "n",
      });
    } else if (hs == "vappress") {
      $("#rh-unit").html(" KPa");
      v = $("#rh").val() * 2.953;
      $("#rh").val(v.toFixed(2));
    } else if (hs === "w") {
      $("#rh-unit").html(
        " <sup>kg<sub>water</sub></sup>&frasl;<sub>kg<sub>dry air</sub></sub>"
      );
    }

    // if instead the unit system is IP
  } else {
    // change the temperature unit
    $(".tempunit").each(function () {
      $(this).html(" &deg;F");
    });

    // Convert the temperature to Fahrenheit and change the spinner limits
    $("#ta, #tr, #trm").each(function () {
      v = util.CtoF($(this).val());
      $(this).val(v.toFixed(1)).spinner({
        step: envVarLimits.ta.ip.step,
        min: envVarLimits.ta.ip.min,
        max: envVarLimits.ta.ip.max,
      });
    });

    // change the air speed unit
    $(".vel-unit, #vel-a-unit").html(" fpm");

    // Convert the air speed to fpm and change spinner limit
    v = $("#vel").val();
    $("#vel")
      .val(v * 196.9)
      .spinner({
        step: envVarLimits.vel.ip.step,
        min: envVarLimits.vel.ip.min,
        max: envVarLimits.vel.ip.max,
        numberFormat: "n",
      });

    if (hs === "dewpoint") {
      $("#rh-unit").html(" &deg;F");
      v = util.CtoF($("#rh").val());
      $("#rh").val(v.toFixed(1)).spinner({
        step: envVarLimits.tdp.ip.step,
        min: envVarLimits.tdp.ip.min,
        max: envVarLimits.tdp.ip.max,
        numberFormat: "n",
      });
    } else if (hs === "wetbulb") {
      $("#rh-unit").html(" &deg;F");
      v = util.CtoF($("#rh").val());
      $("#rh").val(v.toFixed(1)).spinner({
        step: envVarLimits.twb.ip.step,
        min: envVarLimits.twb.ip.min,
        max: envVarLimits.twb.ip.max,
        numberFormat: "n",
      });
    } else if (hs === "vappress") {
      $("#rh-unit").html(" in HG");
      v = $("#rh").val() / 2.953;
      $("#rh").val(v.toFixed(2));
    } else if (hs === "w") {
      $("#rh-unit").html(
        " <sup>klb<sub>water</sub></sup>&frasl;<sub>klb<sub>dry air</sub></sub>"
      );
    }
  }
  try {
    pc.toggleUnits(isCelsius);
    bc.toggleUnits(isCelsius);
    ac.toggleUnits(isCelsius);
    // only in the ASHRAE page has the speed chart
    vc.toggleUnits(isCelsius);
  } catch {}
}

function LoadData(_data) {
  // check if user has toggled the units between saved session and reload
  if (isCelsius !== _data.unit) {
    // if so toggle the unit back to what was saved
    toggleUnits();
    // save the new state
    isCelsius = _data.unit;
  }

  const chartSelection = _data.chartSelection;

  // delete the stored information about the units since no longer needed
  delete _data.unit;
  delete _data.chartSelection;

  // loop through the stored parameters
  for (let [key, value] of Object.entries(_data)) {
    // if used saved values in IP units convert C to F
    if (!isCelsius && (key === "ta" || key === "tr" || key === "trm")) {
      value = util.CtoF(value);
    } else if (!isCelsius && (key === "vel_a" || key === "vel")) {
      value = value * 196.9;
    }
    // load the saved variables in the DOM
    $("#" + key).val(value);
  }
  update();

  $("#chartSelect").val(chartSelection).change();
}

// check user entry
function validateUserEntry(
  i,
  message = "The value you entered is outside the standard's applicability limits."
) {
  keys.forEach(function (element) {
    d_cache[element] = d[element];
    let e = document.getElementById(element + i).value;

    // replace comma with dot
    e = e.replace(/,/g, ".");

    // define which measurement system is being used
    let measurementSystem;
    if (isCelsius) {
      measurementSystem = "si";
    } else {
      measurementSystem = "ip";
    }

    // check user entry. if value is beyond the acceptability limit replace it with the default value
    try {
      if (
        e > envVarLimits[element][measurementSystem]["max"] ||
        e < envVarLimits[element][measurementSystem]["min"]
      ) {
        $("#" + element + i).val(
          envVarLimits[element][measurementSystem]["default"]
        );
        e = envVarLimits[element][measurementSystem]["default"];
        window.alert(message);
      }
    } catch (err) {}
    try {
      if (
        e > envVarLimits[element]["max"] ||
        e < envVarLimits[element]["min"]
      ) {
        $("#" + element + i).val(envVarLimits[element]["default"]);
        e = envVarLimits[element]["default"];
        window.alert(message);
      }
    } catch (err) {}

    // store the value into json
    d[element] = parseFloat(e);
  });

  // fixme the EN page has no air vel local control tab, hence the following code throws an error. I have wrapped around a try{} catch{} but we should look for a more elegant way to do this
  try {
    if (d.clo > 0.7 || d.met > 1.3) {
      const select = document.getElementById("local-control" + i);
      select.selectedIndex = 1;
      $("#local-control" + i).hide();
    } else {
      $("#local-control" + i).show();
    }
  } catch (e) {}
}

// changed humidity dropdown selection
function change_humidity_selection() {
  const v = $("#humidity-spec").val();
  let ta = parseFloat($("#ta").val());
  if (!isCelsius) ta = util.FtoC(ta);
  const maxVapPress = parseFloat(psy.satpress(ta));
  const maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
  let rh = parseFloat($("#rh").val());
  if (
    !isCelsius &&
    (window.humUnit === "wetbulb" || window.humUnit === "dewpoint")
  )
    rh = util.FtoC(rh);
  if (window.humUnit === "vappress")
    if (!isCelsius) rh *= 2953;
    else rh *= 1000;

  if (v === "rh") {
    $("#rh").val(psy.convert(rh, ta, window.humUnit, "rh"));
    $("#rh-unit").html(" %");
    $("#rh-description").html("Relative humidity");
    inputFields("rh");
  } else if (v === "dewpoint") {
    $("#rh-description").html("Dew point temperature");
    if (isCelsius) {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "dewpoint"));
      $("#rh-unit").html(" &deg;C");
    } else {
      $("#rh").val(util.CtoF(psy.convert(rh, ta, window.humUnit, "dewpoint")));
      $("#rh-unit").html(" &deg;F");
    }
    inputFields("rh");
  } else if (v === "wetbulb") {
    $("#rh-description").html("Wet bulb temperature");
    if (isCelsius) {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "wetbulb"));
      $("#rh-unit").html(" &deg;C");
    } else {
      $("#rh").val(util.CtoF(psy.convert(rh, ta, window.humUnit, "wetbulb")));
      $("#rh-unit").html(" &deg;F");
    }
    inputFields("rh");
  } else if (v === "w") {
    $("#rh-description").html("Humidity ratio");
    $("#rh").val(psy.convert(rh, ta, window.humUnit, "w"));
    $("#rh-unit").html("");
    $("#rh").spinner({
      step: 0.001,
      min: 0,
      max: maxHumRatio,
    });
    if (isCelsius) {
      $("#rh-unit").html(
        " <sup>kg<sub>water</sub></sup>&frasl;<sub>kg<sub>dry air</sub></sub>"
      );
    } else {
      $("#rh-unit").html(
        " <sup>klb<sub>water</sub></sup>&frasl;<sub>klb<sub>dry air</sub></sub>"
      );
    }
  } else if (v === "vappress") {
    $("#rh-description").html("Vapor pressure");
    if (isCelsius) {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "vappress") / 1000);
      $("#rh-unit").html(" KPa");
    } else {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "vappress") / 2953);
      $("#rh-unit").html(" in HG");
    }
    $("#rh").spinner({
      step: 0.01,
      min: 0,
      max: maxVapPress / 1000.0,
    });
  }
  window.humUnit = v;
}

function populate_clo_dropdown() {
  const cloSelect = document.getElementById("cloSelect");
  cloInsulationTypicalEnsembles.forEach(function (element) {
    cloSelect.options.add(new Option(element.clothing, element.clo));
  });
  // select by default the value in the dropdown that matches the default value of clo
  document.querySelector(
    '#cloSelect [value="' + envVarLimits.clo.default + '"]'
  ).selected = true;
}

function populate_met_dropdown(metRates) {
  let actSelect = document.getElementById("actSelect");
  metRates.forEach(function (element) {
    actSelect.options.add(new Option(element.activity, element.met));
  });
  // select by default the value in the dropdown that matches the default value of met
  document.querySelector(
    '#actSelect [value="' + envVarLimits.met.default + '"]'
  ).selected = true;
}

function resetDefaultValues() {
  if (!isCelsius) toggleUnits();

  const defaults = {
    ta: envVarLimits.ta.si.default,
    tr: envVarLimits.tr.si.default,
    vel: envVarLimits.vel.si.default,
    rh: envVarLimits.rh.default,
    met: envVarLimits.met.default,
    clo: envVarLimits.clo.default,
    trm: envVarLimits.trm.si.default,
    vel_a: 0.2,
  };

  keys.forEach(function (element) {
    document.getElementById(element).value = defaults[element];
  });
}

function inputFields(id, number = "") {
  try {
    $("#" + id + number).spinner({
      step: envVarLimits[id].si.step,
      min: envVarLimits[id].si.min,
      max: envVarLimits[id].si.max,
      numberFormat: "n",
    });
  } catch {
    $("#" + id + number).spinner({
      step: envVarLimits[id].step,
      min: envVarLimits[id].min,
      max: envVarLimits[id].max,
      numberFormat: "n",
    });
  }
}

function highlightNabBarItem(id) {
  // highlight navigation bar button
  $("a.active").removeClass("active");
  $(id).addClass("active");
}

function dropdownsCloMet() {
  metRatesTypicalTasks = metRatesTypicalTasks.filter(
    (activity) => activity.met >= envVarLimits.met.min
  );

  metRatesTypicalTasks = metRatesTypicalTasks.filter(
    (activity) => activity.met <= envVarLimits.met.max
  );
  cloInsulationTypicalEnsembles = cloInsulationTypicalEnsembles.filter(
    (ensemble) => ensemble.clo >= envVarLimits.clo.min
  );
  cloInsulationTypicalEnsembles = cloInsulationTypicalEnsembles.filter(
    (ensemble) => ensemble.clo <= envVarLimits.clo.max
  );

  const cloSelect = document.getElementById("cloSelect");
  cloSelect.onchange = function () {
    document.getElementById("clo").value = cloSelect.value;
    update();
  };

  populate_clo_dropdown(cloInsulationTypicalEnsembles);

  const cloMultiSelect = document.getElementById("cloMultiSelect");
  cloInsulationGarments.forEach(function (element) {
    cloMultiSelect.options.add(new Option(element.article, element.clo));
  });

  const actSelect = document.getElementById("actSelect");
  actSelect.onchange = function () {
    document.getElementById("met").value = actSelect.value;
    update();
  };

  populate_met_dropdown(metRatesTypicalTasks);

  $(function () {
    $(".multiselect").multiselect({
      sortable: false,
      searchable: false,
      dividerLocation: 0.5,
    });
  });
}

function globeTemperature() {
  $("#globeTemp").click(function () {
    var container = $("#globedialog");
    $.ajax({
      url: util.STATIC_URL + "/html/globetemp.html",
      success: function (data) {
        $("#globedialog").html(data);
        if (!isCelsius) {
          $("#ta-g").val("77");
          $("#vel-g").val("20");
          $("#tglobe").val("77");
          $("#diameter").val("6");
          $("#g-ta-unit").html(" &deg;F");
          $("#g-vel-unit").html(" fpm");
          $("#g-tglobe-unit").html(" &deg;F");
          $("#g-globediam-unit").html(" in");
          $("#g-mrt-unit").html(" &deg;F");
        }
      },
      async: false,
    });
    container.dialog("open");
    updateGlobe();
    $(".input-dialog").focusout(function () {
      updateGlobe();
    });
  });
}
