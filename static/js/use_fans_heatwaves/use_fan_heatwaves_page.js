keys = ["vel", "met", "clo"];

envVarLimits.vel.si.min = 0.4;
envVarLimits.vel.si.max = 4.5;
envVarLimits.vel.si.default = 0.8;
envVarLimits.vel.ip.min = 59;
envVarLimits.vel.ip.max = 885;
envVarLimits.vel.ip.default = 157;
envVarLimits.met.default = 1.1;
envVarLimits.met.max = 1.9;
envVarLimits.clo.default = 0.5;
envVarLimits.clo.max = 0.6;
envVarLimits.clo.min = 0.1;

// Clothes ensambles that are shown in the drop down menu. The values are sorted by clo in ascending order
cloInsulationTypicalEnsambles = [
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
    clothing: "Trousers, long-sleeve shirt: 0.6 clo",
    clo: 0.6,
  },
];

metRatesTypicalTasks = [
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
];

const vRelativeValue = $("#relative-air-speed-value");
const dynamicCloValue = $("#dynamic-clo-value");

$(document).ready(function () {
  // highlight navigation bar button
  $("a.active").removeClass("active");
  $("#nav_a_fans").addClass("active");

  var cloSelect = document.getElementById("cloSelect");
  cloSelect.onchange = function () {
    document.getElementById("clo").value = cloSelect.value;
    update();
  };

  cloInsulationTypicalEnsambles.forEach(function (element) {
    cloSelect.options.add(new Option(element.clothing, element.clo));
  });

  var cloMultiSelect = document.getElementById("cloMultiSelect");
  cloInsulationGarments.forEach(function (element) {
    cloMultiSelect.options.add(new Option(element.article, element.clo));
  });

  var actSelect = document.getElementById("actSelect");
  actSelect.onchange = function () {
    document.getElementById("met").value = actSelect.value;
    update();
  };

  metRatesTypicalTasks.forEach(function (element) {
    actSelect.options.add(new Option(element.activity, element.met));
  });

  $(function () {
    $(".multiselect").multiselect({
      sortable: false,
      searchable: false,
      dividerLocation: 0.5,
    });
  });

  window.isCelsius = true;
  window.humUnit = "rh";
  setDefaults();

  use_fans_heatwave_chart.draw(d);

  update();
});

$(function () {
  $("#radio").buttonset();

  $("#customClo").click(function () {
    $("#customCloToggle").toggle("fast");
  });

  $("#dynamicClo").click(function () {
    $("#dynamicCloToggle").toggle("fast");
  });

  $("button").button();
  $(".buttons").buttonset();

  // create spinners and impose limits based on value defined in envValLimits

  $("#vel").spinner({
    step: envVarLimits.vel.si.step,
    min: envVarLimits.vel.si.min,
    max: envVarLimits.vel.si.max,
    numberFormat: "n",
  });

  $("#clo").spinner({
    step: envVarLimits.clo.step,
    min: envVarLimits.clo.min,
    max: envVarLimits.clo.max,
    numberFormat: "n",
  });

  $("#met").spinner({
    step: envVarLimits.met.step,
    min: envVarLimits.met.min,
    max: envVarLimits.met.max,
    numberFormat: "n",
  });

  $("#save_state").click(function () {
    d["unit"] = isCelsius;
    localStorage.setItem("input_data", JSON.stringify(d));
  });

  $("#share_state").click(function () {
    d["unit"] = isCelsius;
    const dataExport = d;

    // calculate relative air speed
    if (dataExport.met > 1) {
      dataExport.vel = dataExport.vel - 0.3 * (dataExport.met - 1);
    }

    // calculate adjusted clothing insulation
    if (dataExport.met > 1.2 && dataExport.met < 2) {
      dataExport.clo = dataExport.clo / (0.6 + 0.4 / dataExport.met);
      console.log(d.clo);
    }

    dataExport.chartSelection = $("#chartSelect").val();

    const b64p = btoa(JSON.stringify(d));
    const new_url = document.URL.split("?")[0] + "?" + b64p;
    window.prompt("Copy to clipboard: Ctrl+C (or Cmd+C on Apple/Mac)", new_url);
  });

  $("#reload_state").click(function () {
    // reload the value that have been saved in the memory
    const stored_values = JSON.parse(localStorage.getItem("input_data"));

    LoadData(stored_values);
  });

  const url_components = document.URL.split("?");
  if (url_components.length > 1) {
    const stored_values = JSON.parse(atob(url_components[1]));

    LoadData(stored_values);
  }
});

$(".inputbox").keydown(function (event) {
  if (event.keyCode === 13) {
    var inputs = $(".inputbox:visible:enabled");
    var nextBox = inputs.index(this) + 1;
    if (nextBox === inputs.length) nextBox = 0;
    inputs[nextBox].focus();
  }
});

$(".in").click(function () {
  update();
});

$(".inputbox").focusout(function () {
  update();
});

$("#unitsToggle").click(function () {
  toggleUnits();
  update();
});

$("#setDefaults").click(function () {
  setDefaults();
  update();
});

$("#specPressure").click(function () {
  var customPressure = prompt(
    "Enter atmospheric pressure in ".concat(
      isCelsius
        ? "Pascals (Pa) default value 101325 Pa"
        : "inches of mercury (inHg)"
    )
  );
  if (customPressure !== "" && customPressure != null) {
    customPressure = parseFloat(customPressure);
    if (!isCelsius) {
      customPressure *= 3386.39;
    }
    if (
      !isNaN(customPressure) &&
      customPressure >= 60000 &&
      customPressure <= 108000
    ) {
      psy.PROP.Patm = customPressure;
      pc.redraw_rh_lines();
      update();
    } else {
      window.alert(
        "The entered atmospheric pressure is invalid. It must be in the range of 60,000 to 108,000 pascals."
      );
    }
  }
});

$("#setClo").click(function () {
  setClo();
  update();
});

$("#addToEnsembles").click(function () {
  addToEnsembles();
});

$("#setDynamicClo").click(function () {
  var ta6 = $("#taOut6").val();
  var clo_r = comf.schiavonClo(ta6);
  $("#clo").val(clo_r.toFixed(2));
  update();
});

function update() {
  // get user input and validate that complies with standard applicability limits
  validateUserEntry("");

  d.wme = 0;
  if (!isCelsius) {
    d.vel /= 196.9;
  }

  // calculate relative air speed
  if (d.met > 1) {
    d.vel = d.vel + 0.3 * (d.met - 1);
    if (isCelsius) {
      vRelativeValue.html(d.vel.toFixed(2));
    } else {
      vRelativeValue.html((d.vel * 196).toFixed(2));
    }
  }

  // calculate adjusted clothing insulation
  if (d.met > 1.2 && d.met < 2) {
    d.clo = d.clo * (0.6 + 0.4 / d.met);
    dynamicCloValue.html(d.clo.toFixed(2));
  }

  use_fans_heatwave_chart.update();
}

function setDefaults() {
  if (!isCelsius) toggleUnits();
  const defaults = {
    vel: envVarLimits.vel.si.default,
    met: envVarLimits.met.default,
    clo: envVarLimits.clo.default,
  };

  keys.forEach(function (element) {
    document.getElementById(element).value = defaults[element];
  });
}

// Set clo value created by the custom ensemble dialog
function setClo() {
  let clo = 0;
  var opt = document.getElementById("cloMultiSelect").options;
  for (let i = 0; i < opt.length; i++) {
    if (opt[i].selected) clo += parseFloat(opt[i].value);
  }
  document.getElementById("clo").value = clo.toFixed(2);
}

// Add selected clothing items to create a custom ensemble
function addToEnsembles() {
  var items = [];
  var ensembleClo = 0;
  var opt = document.getElementById("cloMultiSelect").options;
  for (var i = 0; i < opt.length; i++) {
    if (opt[i].selected) {
      items.push(opt[i].text);
      ensembleClo += parseFloat(opt[i].value);
    }
  }
  cloSelect.options.add(new Option(items.join(", "), ensembleClo.toFixed(2)));
}
