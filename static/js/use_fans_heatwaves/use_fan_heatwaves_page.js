keys = ["vel", "met", "clo"];

envVarLimits.vel.si.min = 0.3;
envVarLimits.vel.si.max = 4.5;
envVarLimits.vel.si.default = 0.8;
envVarLimits.vel.ip.min = 59;
envVarLimits.vel.ip.max = 885;
envVarLimits.vel.ip.default = 157;
envVarLimits.met.default = 1.1;
envVarLimits.met.max = 1.9;
envVarLimits.clo.default = 0.5;
envVarLimits.clo.max = 0.6;
envVarLimits.clo.min = 0;

$(document).ready(function () {
  highlightNabBarItem("#nav_a_fans");
  dropdownsCloMet();

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

  $("button").button();
  $(".buttons").buttonset();

  // create spinners and impose limits based on value defined in envValLimits
  inputFields("vel");
  inputFields("clo");
  inputFields("met");

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

$(".inputfield").click(function () {
  update();
});

$(".inputfield").focusout(function () {
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
  const message =
    "The value you entered is outside the tool's applicability limits. Air speed is " +
    "limited between " +
    envVarLimits.vel.si.min +
    " and " +
    envVarLimits.vel.si.max +
    " m/s; metabolic rate between " +
    envVarLimits.met.min +
    " and " +
    envVarLimits.met.max +
    " met; and " +
    "clothing level between " +
    envVarLimits.clo.min +
    " and " +
    envVarLimits.clo.max +
    " clo.";

  validateUserEntry("", message);

  d.wme = 0;
  if (!isCelsius) {
    d.vel /= 196.9;
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
