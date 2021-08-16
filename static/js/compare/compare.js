keys = ["ta", "tr", "vel", "rh", "met", "clo"];

$(document).ready(function () {
  highlightNabBarItem("#nav_a_compare");

  $(function () {
    $(".multiselect").multiselect({
      sortable: false,
      searchable: false,
      dividerLocation: 0.5,
    });
  });
  $("#temphumchart-div").hide();

  window.isCelsius = true;
  window.humUnit = "rh";

  setDefaults1();
  setDefaults2();
  setDefaults3();
  update("1");

  pc.drawChart(d);
  bc.drawChart(d);

  setTimeout(function () {
    $(
      ".inputbox2, .unit2, .tempunit2, .result2, .inputbox3, .unit3, .tempunit3, .result3"
    ).hide();
  }, 10);

  $(
    "#pmv-inputs, #pmv-outputs, #cloInput, #actInput, #humidity-spec-cont, #chart-div, #chart-title-pmv"
  ).show();
  $("#temphumchart-div, #temphumchart-title").hide();

  $("#db-axis-C-label").text("Operative Temperature [°C]");
  $("#db-axis-F-label").text("Operative Temperature [°F]");
});

$(function () {
  $("#inputs1")
    .button({})
    .click(function () {
      var $this = $(this);
      if ($this.is(":checked")) {
        $(".inputbox1, .unit1, .tempunit1, .result1").show();
        keys.forEach(function (element) {
          d_cache[element] = d[element];
          d[element] = parseFloat(document.getElementById(element + "1").value);
        });

        pc.drawThings("1");
        bc.drawThings("1");
        let r = comf.pmvElevatedAirspeed(
          d.ta,
          d.tr,
          d.vel,
          d.rh,
          d.met,
          d.clo,
          0
        );
        renderPmvElevResults(r, "1");
        calcPmvElevCompliance(d, r, "1");
      } else {
        $(".inputbox1, .unit1, .tempunit1, .result1").hide();
        d3.selectAll("path.comfortzone1").remove();
        d3.selectAll("circle.point1").remove();
      }
    });
  $("#inputs2")
    .button({})
    .click(function () {
      var $this = $(this);
      if ($this.is(":checked")) {
        $(".inputbox2, .unit2, .tempunit2, .result2").show();
        keys.forEach(function (element) {
          d_cache[element] = d[element];
          d[element] = parseFloat(document.getElementById(element + "2").value);
        });
        if (!isCelsius) {
          d.ta = util.FtoC(d.ta);
          d.tr = util.FtoC(d.tr);
          d.vel = d.vel / 196.85;
        }
        pc.drawThings("2");
        bc.drawThings("2");
        r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
        renderPmvElevResults(r, "2");
        calcPmvElevCompliance(d, r, "2");
      } else {
        $(".inputbox2, .unit2, .tempunit2, .result2").hide();
        d3.selectAll("path.comfortzone2").remove();
        d3.selectAll("circle.point2").remove();
      }
    });
  $("#inputs3")
    .button({})
    .click(function () {
      var $this = $(this);
      if ($this.is(":checked")) {
        $(".inputbox3, .unit3, .tempunit3, .result3").show();
        keys.forEach(function (element) {
          d_cache[element] = d[element];
          d[element] = parseFloat(document.getElementById(element + "3").value);
        });
        if (!isCelsius) {
          d.ta = util.FtoC(d.ta);
          d.tr = util.FtoC(d.tr);
          d.vel = d.vel / 196.85;
        }
        pc.drawThings("3");
        bc.drawThings("3");
        r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
        renderPmvElevResults(r, "3");
        calcPmvElevCompliance(d, r, "3");
      } else {
        $(".inputbox3, .unit3, .tempunit3, .result3").hide();
        d3.selectAll("path.comfortzone3").remove();
        d3.selectAll("circle.point3").remove();
      }
    });

  $("#link").click(function () {
    if ($("#tr-input").is(":hidden")) {
      $("#ta-lab").html(
        '<td colspan="3"><a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a></td>'
      );
      $("#tr-input, #tr-lab").show();
      $("#labelforlink").html("&#9744; Use operative temp");
    } else {
      $("#ta-lab").html(
        '<td colspan="3"><a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a></td>'
      );
      $("#tr-input, #tr-lab").hide();
      $("#labelforlink").html("&#9746; Use operative temp");
    }
  });

  $("#local-control").button();
  $("#radio").buttonset();

  $("#chartSelect").change(function () {
    const chart = $("#chartSelect").val();
    if (chart === "temphum") {
      $("#chart-div, #chart-title-pmv").hide();
      $("#temphumchart-div, #temphumchart-title").show();
    } else if (chart === "psychta") {
      $("#temphumchart-div, #temphumchart-title").hide();
      $("#chart-div, #chart-title-pmv").show();
      $("#db-axis-C-label").text("Dry-bulb Temperature [°C]");
      $("#db-axis-F-label").text("Dry-bulb Temperature [°F]");

      $("#ta-lab").html(
        '<td colspan="3"><a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a></td>'
      );
      $("#tr-input, #tr-lab, #labelforlink").show();
      $("#labelforlink").html("&#9744; Use operative temp");
    } else if (chart === "psychtop") {
      $("#temphumchart-div, #temphumchart-title").hide();
      $("#chart-div, #chart-title-pmv").show();

      $("#ta-lab").html(
        '<td colspan="3"><a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a></td>'
      );
      $("#tr-input, #tr-lab, #labelforlink").hide();
      $("#db-axis-C-label").text("Operative Temperature [°C]");
      $("#db-axis-F-label").text("Operative Temperature [°F]");
    }
    update("1");
    update("2");
    update("3");
  });

  $("#customClo")
    .button({
      icons: {
        primary: "ui-icon-person",
      },
    })
    .click(function () {
      $("#customCloToggle").toggle("fast");
    });

  $("button").button();
  $(".buttons").buttonset();

  for (let i = 1; i < 4; i++) {
    inputFields("ta", String(i));
    inputFields("tr", String(i));
    inputFields("vel", String(i));
    inputFields("clo", String(i));
    inputFields("met", String(i));
    inputFields("rh", String(i));
  }
});

$("#humidity-spec").change(function () {
  const v = $("#humidity-spec").val();
  var ta1 = parseFloat($("#ta1").val());
  var ta2 = parseFloat($("#ta2").val());
  var ta3 = parseFloat($("#ta3").val());
  if (!isCelsius) {
    ta1 = util.FtoC(ta1);
    ta2 = util.FtoC(ta2);
    ta3 = util.FtoC(ta3);
  }
  var maxVapPress1 = parseFloat(psy.satpress(ta1));
  var maxVapPress2 = parseFloat(psy.satpress(ta2));
  var maxVapPress3 = parseFloat(psy.satpress(ta3));
  var maxHumRatio1 = psy.humratio(psy.PROP.Patm, maxVapPress1);
  var maxHumRatio2 = psy.humratio(psy.PROP.Patm, maxVapPress2);
  var maxHumRatio3 = psy.humratio(psy.PROP.Patm, maxVapPress3);
  var rh1 = parseFloat($("#rh1").val());
  var rh2 = parseFloat($("#rh2").val());
  var rh3 = parseFloat($("#rh3").val());
  if (
    !isCelsius &&
    (window.humUnit === "wetbulb" || window.humUnit === "dewpoint")
  ) {
    rh1 = util.FtoC(rh1);
    rh2 = util.FtoC(rh2);
    rh3 = util.FtoC(rh3);
  }
  if (window.humUnit === "vappress")
    if (!isCelsius) {
      rh1 *= 2953;
      rh2 *= 2953;
      rh3 *= 2953;
    } else {
      rh1 *= 1000;
      rh2 *= 1000;
      rh3 *= 1000;
    }

  if (v === "rh") {
    $("#rh-description").html("Relative humidity");
    $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "rh"));
    $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "rh"));
    $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "rh"));
    $("#rh-unit1, #rh-unit2, #rh-unit3").html(" %");
    $("#rh1, #rh2, #rh3").spinner({
      step: envVarLimits.rh.step,
      min: envVarLimits.rh.min,
      max: envVarLimits.rh.max,
      numberFormat: "n",
    });
  } else if (v === "dewpoint") {
    $("#rh-description").html("Dew point temperature");
    if (isCelsius) {
      $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "dewpoint"));
      $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "dewpoint"));
      $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "dewpoint"));
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;C");
      $("#rh1, #rh2, #rh3").spinner({
        step: envVarLimits.tdp.si.step,
        min: envVarLimits.tdp.si.min,
        max: envVarLimits.tdp.si.max,
        numberFormat: "n",
      });
    } else {
      $("#rh1").val(
        util.CtoF(psy.convert(rh1, ta1, window.humUnit, "dewpoint"))
      );
      $("#rh2").val(
        util.CtoF(psy.convert(rh2, ta2, window.humUnit, "dewpoint"))
      );
      $("#rh3").val(
        util.CtoF(psy.convert(rh3, ta3, window.humUnit, "dewpoint"))
      );
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;F");
      $("#rh1, #rh2, #rh3").spinner({
        step: envVarLimits.tdp.ip.step,
        min: envVarLimits.tdp.ip.min,
        max: envVarLimits.tdp.ip.max,
        numberFormat: "n",
      });
    }
  } else if (v === "wetbulb") {
    $("#rh-description").html("Wet bulb temperature");
    // SI units
    if (isCelsius) {
      $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "wetbulb"));
      $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "wetbulb"));
      $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "wetbulb"));
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;C");
      $("#rh1, #rh2, #rh3").spinner({
        step: envVarLimits.twb.si.step,
        min: envVarLimits.twb.si.min,
        max: envVarLimits.twb.si.max,
        numberFormat: "n",
      });

      // IP units
    } else {
      $("#rh1").val(
        util.CtoF(psy.convert(rh1, ta1, window.humUnit, "wetbulb"))
      );
      $("#rh2").val(
        util.CtoF(psy.convert(rh2, ta2, window.humUnit, "wetbulb"))
      );
      $("#rh3").val(
        util.CtoF(psy.convert(rh3, ta3, window.humUnit, "wetbulb"))
      );
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;F");
      $("#rh1, #rh2, #rh3").spinner({
        step: envVarLimits.twb.ip.step,
        min: envVarLimits.twb.ip.min,
        max: envVarLimits.twb.ip.max,
        numberFormat: "n",
      });
    }
  } else if (v === "w") {
    $("#rh-description").html("Humidity ratio");
    $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "w"));
    $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "w"));
    $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "w"));
    $("#rh-unit1, #rh-unit2, #rh-unit3").html("");
    $("#rh1").spinner({
      step: 0.001,
      min: 0,
      max: maxHumRatio1,
    });
    $("#rh2").spinner({
      step: 0.001,
      min: 0,
      max: maxHumRatio2,
    });
    $("#rh3").spinner({
      step: 0.001,
      min: 0,
      max: maxHumRatio3,
    });

    if (isCelsius) {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(
        " <sup>kg<sub>water</sub></sup>&frasl;<sub>kg<sub>dry air</sub></sub>"
      );
    } else {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(
        " <sup>klb<sub>water</sub></sup>&frasl;<sub>klb<sub>dry air</sub></sub>"
      );
    }
  } else if (v === "vappress") {
    $("#rh-description").html("Vapor pressure");
    if (isCelsius) {
      $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "vappress") / 1000);
      $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "vappress") / 1000);
      $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "vappress") / 1000);
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" KPa");
    } else {
      $("#rh1").val(psy.convert(rh1, ta1, window.humUnit, "vappress") / 2953);
      $("#rh2").val(psy.convert(rh2, ta2, window.humUnit, "vappress") / 2953);
      $("#rh3").val(psy.convert(rh3, ta3, window.humUnit, "vappress") / 2953);
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" in HG");
    }
    $("#rh1").spinner({
      step: 0.01,
      min: 0,
      max: maxVapPress1 / 1000.0,
    });
    $("#rh2").spinner({
      step: 0.01,
      min: 0,
      max: maxVapPress2 / 1000.0,
    });
    $("#rh3").spinner({
      step: 0.01,
      min: 0,
      max: maxVapPress3 / 1000.0,
    });
  }
  window.humUnit = v;
});

$(".inputbox").keydown(function (event) {
  if (event.keyCode === 13) {
    let inputs = $(".inputbox:visible:enabled");
    let nextBox = inputs.index(this) + 1;
    if (nextBox === inputs.length) nextBox = 0;
    inputs[nextBox].focus();
  }
});

$(".inputcell1").click(function () {
  update("1");
});

$(".inputcell2").click(function () {
  update("2");
});

$(".inputcell3").click(function () {
  update("3");
});

$(".inputbox1").focusout(function () {
  update("1");
});

$(".inputbox2").focusout(function () {
  update("2");
});

$(".inputbox3").focusout(function () {
  update("3");
});

$("#unitsToggle").click(function () {
  toggleUnits();
  update("1");
  update("2");
  update("3");
});

$("#restart").click(function () {
  setDefaults1();
  setDefaults2();
  setDefaults3();
  update("1");
  update("2");
  update("3");
});

$("#specPressure").click(function () {
  let customPressure = prompt(
    "Enter atmospheric pressure in ".concat(
      isCelsius ? "Pascals (Pa)" : "inches of mercury (inHg)"
    )
  );
  if (customPressure !== "" && customPressure != null) {
    customPressure = parseFloat(customPressure);
    if (!isCelsius) {
      customPressure *= 3386.39;
    }
    if (
      !isNaN(customPressure) &&
      customPressure >= 30000 &&
      customPressure <= 110000
    ) {
      psy.PROP.Patm = customPressure;
      pc.redraw_rh_lines();
      update("1");
      update("2");
      update("3");
    } else {
      window.alert("The entered atmospheric pressure is invalid.");
    }
  }
});

function update(i) {
  if ($("#tr-input").is(":hidden")) {
    $("#tr" + i).val($("#ta" + i).val());
  }

  // get user input and validate that complies with standard applicability limits
  validateUserEntry(i);

  d.wme = 0;

  if (!isCelsius) {
    d.ta = util.FtoC(d.ta);
    d.tr = util.FtoC(d.tr);
    d.vel /= 196.9;
    if (window.humUnit === "wetbulb" || window.humUnit === "dewpoint")
      d.rh = util.FtoC(d.rh);
    else if (window.humUnit === "vappress") d.rh *= 2953;
  } else {
    if (window.humUnit === "vappress") d.rh *= 1000;
  }
  d.rh = psy.convert(d.rh, d.ta, window.humUnit, "rh");

  const r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
  renderPmvElevResults(r, i);
  calcPmvElevCompliance(d, r, i);

  let b;
  if ($("#chart-div").is(":visible")) {
    b = pc.findComfortBoundary(d, 0.5);
    pc.redrawComfortRegion(b, i);
    var pointdata = [
      {
        db: d.ta,
        hr: pc.getHumRatio(d.ta, d.rh),
      },
    ];
    pc.redrawPoint(pointdata, i);
  } else if ($("#temphumchart-div").is(":visible")) {
    b = bc.findComfortBoundary(d, 0.5);
    bc.redrawComfortRegion(b, i);
    bc.redrawPoint(i);
  }
  d3.selectAll("circle").moveToFront();
}

function renderPmvResults(r, i) {
  $("#pmv-res" + i).html(r.pmv.toFixed(2));
  $("#ppd-res" + i).html(r.ppd.toFixed(0));
  var sensation = util.getSensation(r.pmv);
  $("#sensation" + i).html(sensation);
  if (!isCelsius) {
    r.set = util.CtoF(r.set);
  }
  $("#set" + i).html(r.set.toFixed(1));
}

function renderPmvElevResults(r, i) {
  renderPmvResults(r, i);
  if (!isCelsius) {
    r.ta_adj = util.CtoF(r.ta_adj);
    r.cooling_effect = (r.cooling_effect * 9) / 5;
  }
  $("#ta-still" + i).html(r.ta_adj.toFixed(1));
  $("#cooling-effect" + i).html(r.cooling_effect.toFixed(1));
}

function calcPmvElevCompliance(d, r, i) {
  let special_msg = "";
  // let compliance_ranges, unit_t, unit_v;
  let comply = true;

  const pmv_comply = Math.abs(r.pmv) <= 0.5;
  const met_comply = d.met <= 2 && d.met >= 1;
  const clo_comply = d.clo <= 1.5;

  let local_control = false;
  if (i === "1") {
    local_control = $("#local-control1").val() === "true";
  } else if (i === "2") {
    local_control = $("#local-control2").val() === "true";
  } else if (i === "3") {
    local_control = $("#local-control3").val() === "true";
  }

  if (!met_comply) {
    comply = false;
    special_msg +=
      "Input " +
      i +
      " - Metabolic rates below 1.0 or above 2.0 are not covered by the ASHRAE 55 Standard<br>";
  }

  if (!clo_comply) {
    comply = false;
    special_msg +=
      "Input " +
      i +
      " - Clo values above 1.5 are not covered by the ASHRAE 55 Standard<br>";
  }

  // if no local control is available
  let max_airspeed;
  if (!local_control) {
    const to = (d.ta + d.tr) / 2;
    if (to > 25.5) {
      max_airspeed = 0.8;
    } else if (to < 23.0) {
      max_airspeed = 0.2;
    } else {
      max_airspeed = 50.49 - 4.4047 * to + 0.096425 * to * to;
      if (max_airspeed < 0.2) max_airspeed = 0.2;
      if (max_airspeed > 0.8) max_airspeed = 0.8;
    }
  }
  if (d.vel > max_airspeed) {
    comply = false;
    // language=HTML
    special_msg +=
      "Input " +
      i +
      " - The air speed value selected is outside the range defined by the ASHRAE 55 Standard for occupants with no local air speed control";
  } else {
    special_msg += "";
  }

  if (!pmv_comply) {
    comply = false;
  }

  if (d.vel > 0.1) {
    $("#pmv-out-label").html("PMV with elevated air speed");
    $("#ppd-out-label").html("PPD with elevated air speed");
    $("#pmv-elev-outputs").show();
  } else {
    $("#pmv-out-label").html("PMV");
    $("#ppd-out-label").html("PPD");
    $("#pmv-elev-outputs").hide();
  }
  renderCompliance(comply, special_msg, i);
}

function renderCompliance(comply, special_msg, i) {
  var comply_msg = "&#10004;";
  var no_comply_msg = "&#10008";

  $("#vel-range" + i).html("");
  if (comply) {
    $("#comply-msg" + i).html(comply_msg);
    $("#comply-msg" + i).css("color", "green");
    $("#special-msg" + i).html(special_msg);
  } else {
    $("#comply-msg" + i).html(no_comply_msg);
    $("#comply-msg" + i).css("color", "red");
    $("#special-msg" + i).html(special_msg); //changed this for the special message
  }
}

function setDefaults1() {
  if (!isCelsius) toggleUnits();
  var hs = $("#humidity-spec").val();
  var rh = psy.convert(50, 25, "rh", hs);
  if (hs === "vappress") {
    rh /= 1000;
  }
  const defaults = {
    ta: envVarLimits.ta.si.default + 1,
    tr: envVarLimits.tr.si.default,
    vel: envVarLimits.vel.si.default,
    rh: rh.toFixed(psy.PREC[hs]),
    met: envVarLimits.met.default,
    clo: envVarLimits.clo.default - 0.1,
  };

  keys.forEach(function (element) {
    document.getElementById(element + "1").value = defaults[element];
  });
}

function setDefaults2() {
  if (!isCelsius) toggleUnits();
  var hs = $("#humidity-spec").val();
  var rh = psy.convert(50, 28, "rh", hs);
  if (hs === "vappress") {
    rh /= 1000;
  }
  const defaults = {
    ta: envVarLimits.ta.si.default,
    tr: envVarLimits.tr.si.default,
    vel: envVarLimits.vel.si.default,
    rh: rh.toFixed(psy.PREC[hs]),
    met: envVarLimits.met.default + 0.1,
    clo: envVarLimits.clo.default,
  };

  keys.forEach(function (element) {
    document.getElementById(element + "2").value = defaults[element];
  });
}

function setDefaults3() {
  if (!isCelsius) toggleUnits();
  var hs = $("#humidity-spec").val();
  let rh = psy.convert(50, 22, "rh", hs);
  if (hs === "vappress") {
    rh /= 1000;
  }
  const defaults = {
    ta: envVarLimits.ta.si.default - 2,
    tr: envVarLimits.tr.si.default - 2,
    vel: envVarLimits.vel.si.default,
    rh: rh.toFixed(psy.PREC[hs]),
    met: envVarLimits.met.default + 0.2,
    clo: envVarLimits.clo.default + 0.1,
  };

  keys.forEach(function (element) {
    document.getElementById(element + "3").value = defaults[element];
  });
}

function toggleUnits() {
  var v, v2, v3;
  const hs = $("#humidity-spec").val();
  isCelsius = !isCelsius;
  if (isCelsius) {
    $(".tempunit1, .tempunit2, .tempunit3").each(function () {
      $(this).html(" &deg;C");
    });
    $("#ta1, #tr1, #ta2, #tr2, #ta3, #tr3").each(function () {
      v = util.FtoC($(this).val());
      $(this).val(v.toFixed(1));
    });
    $(".vel-unit").html(" m/s");
    v = $("#vel1").val();
    v2 = $("#vel2").val();
    v3 = $("#vel3").val();
    $("#vel1")
      .val(v / 196.9)
      .spinner({
        step: 0.01,
        min: 0,
        max: 3,
        numberFormat: "n",
      });
    $("#vel2")
      .val(v2 / 196.9)
      .spinner({
        step: 0.01,
        min: 0,
        max: 3,
        numberFormat: "n",
      });
    $("#vel3")
      .val(v3 / 196.9)
      .spinner({
        step: 0.01,
        min: 0,
        max: 3,
        numberFormat: "n",
      });
    if (hs == "dewpoint" || hs == "wetbulb") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;C");
      v = util.FtoC($("#rh1").val());
      v2 = util.FtoC($("#rh2").val());
      v3 = util.FtoC($("#rh3").val());
      $("#rh1").val(v.toFixed(1));
      $("#rh2").val(v2.toFixed(1));
      $("#rh3").val(v3.toFixed(1));
    } else if (hs == "vappress") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" KPa");
      v = $("#rh1").val() * 2.953;
      v2 = $("#rh2").val() * 2.953;
      v3 = $("#rh3").val() * 2.953;
      $("#rh1").val(v.toFixed(2));
      $("#rh2").val(v2.toFixed(2));
      $("#rh3").val(v3.toFixed(2));
    } else if (hs === "w") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(
        " <sup>kg<sub>water</sub></sup>&frasl;<sub>kg<sub>dry air</sub></sub>"
      );
    }
  } else {
    $(".tempunit1, .tempunit2, .tempunit3").each(function () {
      $(this).html(" &deg;F");
    });
    $("#ta1, #tr1, #ta2, #tr2, #ta3, #tr3").each(function () {
      v = util.CtoF($(this).val());
      $(this).val(v.toFixed(1));
      $(this).val(v.toFixed(1)).spinner({
        step: envVarLimits.ta.ip.step,
        min: envVarLimits.ta.ip.min,
        max: envVarLimits.ta.ip.max,
      });
    });
    $(".vel-unit").html(" fpm");
    v = $("#vel1").val();
    v2 = $("#vel2").val();
    v3 = $("#vel3").val();
    $("#vel1")
      .val(v * 196.9)
      .spinner({
        step: 1,
        min: 0,
        max: 300,
        numberFormat: "n",
      });
    $("#vel2")
      .val(v2 * 196.9)
      .spinner({
        step: 1,
        min: 0,
        max: 300,
        numberFormat: "n",
      });
    $("#vel3")
      .val(v3 * 196.9)
      .spinner({
        step: 1,
        min: 0,
        max: 300,
        numberFormat: "n",
      });
    if (hs === "dewpoint" || hs === "wetbulb") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" &deg;F");
      v = util.CtoF($("#rh1").val());
      v2 = util.CtoF($("#rh2").val());
      v3 = util.CtoF($("#rh3").val());
      $("#rh1").val(v.toFixed(1));
      $("#rh2").val(v2.toFixed(1));
      $("#rh3").val(v3.toFixed(1));
    } else if (hs == "vappress") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(" in HG");
      v = $("#rh1").val() / 2.953;
      v2 = $("#rh2").val() / 2.953;
      v3 = $("#rh3").val() / 2.953;
      $("#rh1").val(v.toFixed(2));
      $("#rh2").val(v2.toFixed(2));
      $("#rh3").val(v3.toFixed(2));
    } else if (hs === "w") {
      $("#rh-unit1, #rh-unit2, #rh-unit3").html(
        " <sup>klb<sub>water</sub></sup>&frasl;<sub>klb<sub>dry air</sub></sub>"
      );
    }
  }
  pc.toggleUnits(isCelsius);
  bc.toggleUnits(isCelsius);
}
