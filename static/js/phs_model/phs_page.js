keys = ["ta", "tr", "vel", "met", "clo", "rh"];

envVarLimits.ta.si.min = 15;
envVarLimits.ta.si.max = 50;
envVarLimits.ta.si.default = 35;
envVarLimits.ta.ip.min = 59;
envVarLimits.ta.ip.max = 122;
envVarLimits.ta.ip.default = 95;
envVarLimits.tr.si.min = 15;
envVarLimits.tr.si.max = 50;
envVarLimits.tr.si.default = 35;
envVarLimits.tr.ip.min = 59;
envVarLimits.tr.ip.max = 122;
envVarLimits.tr.ip.default = 95;
envVarLimits.vel.si.min = 0.1;
envVarLimits.vel.si.max = 3;
envVarLimits.vel.si.default = 0.3;
envVarLimits.vel.ip.min = 20;
envVarLimits.vel.ip.max = 590;
envVarLimits.vel.ip.default = 59;
envVarLimits.rh.default = 71;
envVarLimits.met.default = 2.5;
envVarLimits.met.max = 7;
envVarLimits.met.min = 2.5;
envVarLimits.clo.default = 0.5;
envVarLimits.clo.max = 1.0;
envVarLimits.clo.min = 0.1;

const vRelativeValue = $("#relative-air-speed-value");
const dynamicCloValue = $("#dynamic-clo-value");

$(document).ready(function () {
  // highlight navigation bar button
  $("a.active").removeClass("active");
  $("#nav_a_phs").addClass("active");

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

  phs_chart.draw(d);

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
  $("#ta").spinner({
    step: envVarLimits.ta.si.step,
    min: envVarLimits.ta.si.min,
    max: envVarLimits.ta.si.max,
    numberFormat: "n",
  });

  $("#tr").spinner({
    step: envVarLimits.tr.si.step,
    min: envVarLimits.tr.si.min,
    max: envVarLimits.tr.si.max,
    numberFormat: "n",
  });

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

  $("#rh").spinner({
    step: envVarLimits.rh.step,
    min: envVarLimits.rh.min,
    max: envVarLimits.rh.max,
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
    d.ta = util.FtoC(d.ta);
    d.tr = util.FtoC(d.tr);
    d.trm = util.FtoC(d.trm);
    d.vel /= 196.9;
    if (window.humUnit === "wetbulb" || window.humUnit === "dewpoint")
      d.rh = util.FtoC(d.rh);
    else if (window.humUnit === "vappress") d.rh *= 2953;
  } else {
    if (window.humUnit === "vappress") d.rh *= 1000;
  }
  d.rh = psy.convert(d.rh, d.ta, window.humUnit, "rh");

  // fixme I need to allow the user to change the other parameters
  // fixme I need to allow the user to change the posture
  const results = comf.phs(
    d.ta,
    d.tr,
    d.rh,
    d.vel,
    d.met * 58.15,
    d.clo,
    2,
    true
  );
  $("#t_re").html(results.t_re);
  $("#d_lim_t_re").html(results.d_lim_t_re);

  phs_chart.update();
}

function setDefaults() {
  if (!isCelsius) toggleUnits();
  const defaults = {
    ta: envVarLimits.ta.si.default,
    tr: envVarLimits.tr.si.default,
    vel: envVarLimits.vel.si.default,
    rh: envVarLimits.rh.default,
    met: envVarLimits.met.default,
    clo: envVarLimits.clo.default,
    trm: envVarLimits.trm.si.default,
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
