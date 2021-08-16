keys = ["ta", "tr", "vel", "rh", "met", "clo"];

factor_names = {
  ta: "air temperature",
  tr: "mean radiant temperature",
  vel: "air speed",
  rh: "relative humidity",
  met: "metabolic rate",
  clo: "clothing level",
};

factor_units = {
  ta: '<span class="tempunit">&deg;C</span>',
  tr: '<span class="tempunit">&deg;C</span>',
  vel: '<span class="vel-unit">m/s</span>',
  rh: "%",
  met: "met",
  clo: "clo",
};

$(document).ready(function () {
  highlightNabBarItem("#nav_a_ranges");

  $(function () {
    $(".multiselect").multiselect({
      sortable: false,
      searchable: false,
      dividerLocation: 0.5,
    });
  });

  $("#temphumchart-div, #output-ranges").hide();
  $("#hover-output").css("color", "transparent");

  window.isCelsius = true;
  window.humUnit = "rh";
  rangeYes = false;

  resetDefaultValues();
  update();
  pc.drawChart(d);
  bc.drawChart(d);

  $("#tr1")
    .spinner({
      step: envVarLimits.tr.si.step,
      min: envVarLimits.tr.si.min,
      max: envVarLimits.tr.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.tr.si.default - envVarLimits.tr.si.step);

  $("#tr2")
    .spinner({
      step: envVarLimits.tr.si.step,
      min: envVarLimits.tr.si.min,
      max: envVarLimits.tr.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.tr.si.default + envVarLimits.tr.si.step);

  $("#vel1")
    .spinner({
      step: envVarLimits.vel.si.step,
      min: envVarLimits.vel.si.min,
      max: envVarLimits.vel.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.vel.si.default - envVarLimits.vel.si.step);

  $("#vel2")
    .spinner({
      step: envVarLimits.vel.si.step,
      min: envVarLimits.vel.si.min,
      max: envVarLimits.vel.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.vel.si.default + envVarLimits.vel.si.step);

  $("#met1")
    .spinner({
      step: envVarLimits.met.step,
      min: envVarLimits.met.min,
      max: envVarLimits.met.max,
      numberFormat: "n",
    })
    .val(envVarLimits.met.default - envVarLimits.met.step);

  $("#met2")
    .spinner({
      step: envVarLimits.met.step,
      min: envVarLimits.met.min,
      max: envVarLimits.met.max,
      numberFormat: "n",
    })
    .val(envVarLimits.met.default + envVarLimits.met.step);

  $("#clo1")
    .spinner({
      step: envVarLimits.clo.step,
      min: envVarLimits.clo.min,
      max: envVarLimits.clo.max,
      numberFormat: "n",
    })
    .val(envVarLimits.clo.default - envVarLimits.clo.step);

  $("#clo2")
    .spinner({
      step: envVarLimits.clo.step,
      min: envVarLimits.clo.min,
      max: envVarLimits.clo.max,
      numberFormat: "n",
    })
    .val(envVarLimits.clo.default + envVarLimits.clo.step);

  drawTRrange();

  parameter_selection_change();

  $("#db-axis-C-label").text("Operative Temperature [°C]");
  $("#db-axis-F-label").text("Operative Temperature [°F]");
});

$(function () {
  $("#link")
    .button({})
    .click(function () {
      if ($("#tr-input").is(":hidden")) {
        $("#ta-lab").html(
          '<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>'
        );
        $("#tr-input, #tr-lab").show();
      } else {
        $("#ta-lab").html(
          '<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>'
        );
        $("#tr-input, #tr-lab").hide();
      }
    });

  $("#chartSelect").change(function () {
    const chart = $("#chartSelect").val();
    const parameter = $("#parameter_select").val();
    const mrtValRow = $("#mrt_val_row");

    if (chart === "temphum") {
      $("#chart-div, #chart-title-pmv").hide();
      $("#temphumchart-div, #temphumchart-title").show();
    } else if (chart === "psychta") {
      $("#temphumchart-div, #temphumchart-title").hide();
      $("#chart-div, #chart-title-pmv").show();

      $("#db-axis-C-label").text("Dry-bulb Temperature [°C]");
      $("#db-axis-F-label").text("Dry-bulb Temperature [°F]");
      $("#parameter_select").append(
        "<option value='sel_t_mrt'>Mean radiant temperature</option>"
      );

      if (!mrtValRow.is(":visible") && parameter !== "sel_t_mrt") {
        mrtValRow.show();
      }
    } else if (chart === "psychtop") {
      $("#temphumchart-div, #temphumchart-title").hide();
      $("#chart-div, #chart-title-pmv").show();

      if (mrtValRow.is(":visible")) {
        mrtValRow.hide();
      }
      $("#db-axis-C-label").text("Operative Temperature [°C]");
      $("#db-axis-F-label").text("Operative Temperature [°F]");
      $("#parameter_select option[value='sel_t_mrt']").remove();
    }
    parameter_selection_change();
  });

  $("#parameter_select").change(function () {
    parameter_selection_change();
  });

  $("button").button();
  $(".buttons").buttonset();

  inputFields("ta");
  inputFields("tr");
  inputFields("vel");
  inputFields("clo");
  inputFields("met");
  inputFields("rh");

  $("select#step-select-tr").change(function () {
    drawTRrange();
  });
  $("select#step-select-vel").change(function () {
    drawVELrange();
  });
  $("select#step-select-met").change(function () {
    drawMETrange();
  });
  $("select#step-select-clo").change(function () {
    drawCLOrange();
  });

  $("#inputfield-tr").click(function () {
    drawTRrange();
  });
  $("#inputfield-vel").click(function () {
    drawVELrange();
  });
  $("#inputfield-met").click(function () {
    drawMETrange();
  });
  $("#inputfield-clo").click(function () {
    drawCLOrange();
  });
});

$("#humidity-spec").change(function () {
  var v = $("#humidity-spec").val();
  var ta = parseFloat($("#ta").val());
  if (!isCelsius) ta = util.FtoC(ta);
  var maxVapPress = parseFloat(psy.satpress(ta));
  var maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
  var rh = parseFloat($("#rh").val());
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
    $("#rh").spinner({
      step: envVarLimits.rh.step,
      min: envVarLimits.rh.min,
      max: envVarLimits.rh.max,
      numberFormat: "n",
    });
  } else if (v === "dewpoint") {
    if (isCelsius) {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "dewpoint"));
      $("#rh-unit").html(" &deg;C");
    } else {
      $("#rh").val(util.CtoF(psy.convert(rh, ta, window.humUnit, "dewpoint")));
      $("#rh-unit").html(" &deg;F");
    }
    $("#rh").spinner({
      step: envVarLimits.rh.step,
      min: envVarLimits.rh.min,
      max: envVarLimits.rh.max,
      numberFormat: "n",
    });
  } else if (v === "wetbulb") {
    if (isCelsius) {
      $("#rh").val(psy.convert(rh, ta, window.humUnit, "wetbulb"));
      $("#rh-unit").html(" &deg;C");
    } else {
      $("#rh").val(util.CtoF(psy.convert(rh, ta, window.humUnit, "wetbulb")));
      $("#rh-unit").html(" &deg;F");
    }
    $("#rh").spinner({
      step: envVarLimits.rh.step,
      min: envVarLimits.rh.min,
      max: envVarLimits.rh.max,
      numberFormat: "n",
    });
  } else if (v === "w") {
    $("#rh").val(psy.convert(rh, ta, window.humUnit, "w"));
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
  if (!rangeYes) {
    update();
  }
});

$(".inputbox").click(function () {
  update();
});

$("#rh-inputcell").click(function () {
  if (rangeYes) {
    pc.redrawRHCurve();
    bc.redrawRHcurve();
  }
});

$("#tr-inputcell").click(function () {
  if (rangeYes) {
    if (rangefactor === "vel") {
      drawVELrange();
    } else if (rangefactor === "met") {
      drawMETrange();
    } else if (rangefactor === "clo") {
      drawCLOrange();
    }
  }
});

$("#vel-inputcell").click(function () {
  if (rangeYes) {
    if (rangefactor === "tr") {
      drawTRrange();
    } else if (rangefactor === "met") {
      drawMETrange();
    } else if (rangefactor === "clo") {
      drawCLOrange();
    }
  }
});

$("#met-inputcell").click(function () {
  if (rangeYes) {
    if (rangefactor === "vel") {
      drawVELrange();
    } else if (rangefactor === "tr") {
      drawTRrange();
    } else if (rangefactor === "clo") {
      drawCLOrange();
    }
  }
});

$("#clo-inputcell").click(function () {
  if (rangeYes) {
    if (rangefactor === "vel") {
      drawVELrange();
    } else if (rangefactor === "met") {
      drawMETrange();
    } else if (rangefactor === "tr") {
      drawTRrange();
    }
  }
});

$("#unitsToggle").click(function () {
  toggleUnits();
  update();
});

$("#restart").click(function () {
  rangeYes = false;
  d3.selectAll("path.comfortzone-range").remove();
  d3.selectAll("path.comfortzone").remove();
  d3.selectAll("path.comfortzone-temphum-range").remove();
  d3.selectAll("path.comfortzone-temphum").remove();
  d3.selectAll("circle").remove();
  $("#output-ranges").hide();
  // $('.inputfield').css('background-color', '#DCE7F7');
  $("#ta-lab, #inputfield-ta").css("visibility", "visible");
  pc.removeRHCurve();
  bc.removeRHcurve();

  resetDefaultValues();

  $("#parameter_select").val("sel_t_mrt").change();

  $("#tr1")
    .spinner({
      step: envVarLimits.tr.si.step,
      min: envVarLimits.tr.si.min,
      max: envVarLimits.tr.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.tr.si.default - envVarLimits.tr.si.step);

  $("#tr2")
    .spinner({
      step: envVarLimits.tr.si.step,
      min: envVarLimits.tr.si.min,
      max: envVarLimits.tr.si.max,
      numberFormat: "n",
    })
    .val(envVarLimits.tr.si.default + envVarLimits.tr.si.step);

  drawTRrange();
});

$("#specPressure").click(function () {
  let customPressure = prompt(
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
      customPressure >= 30000 &&
      customPressure <= 110000
    ) {
      psy.PROP.Patm = customPressure;
      pc.redraw_rh_lines();
      update();
    } else {
      window.alert("The entered atmospheric pressure is invalid.");
    }
  }
});

function toggleUnits() {
  var v;
  var hs = $("#humidity-spec").val();

  const optionsAirSpeed = document.getElementById("step-select-vel");
  const optionsMeanRadiantT = document.getElementById("step-select-tr");

  isCelsius = !isCelsius;
  if (isCelsius) {
    $(".t-unit").html(" &deg;C");
    $(".tempunit").each(function () {
      $(this).html(" &deg;C");
    });
    $("#ta, #tr, #tr1, #tr2").each(function () {
      v = util.FtoC($(this).val());
      $(this).val(v.toFixed(1));
    });
    $("#inner-range-width, #outer-range-width").each(function () {
      v = parseFloat($(this).html()) / 1.8;
      $(this).html(v.toFixed(1));
    });

    $("#range-output1, #range-output2").each(function () {
      v = util.FtoC(parseFloat($(this).html()));
      $(this).html(v.toFixed(1));
    });

    if (rangeYes) {
      if (rangefactor === "tr") {
        $("#factor-output1, #factor-output2").each(function () {
          v = util.FtoC(parseFloat($(this).html()));
          $(this).html(v.toFixed(1));
        });
      }
      if (rangefactor === "vel") {
        v1 = $("#factor-output1").html();
        $("#factor-output1").html((v1 / 196.9).toFixed(2));
        v2 = $("#factor-output2").html();
        $("#factor-output2").html((v2 / 196.9).toFixed(2));
      }
    }
    $(".vel-unit").html(" m/s");
    v = $("#vel").val();
    $("#vel")
      .val(v / 196.9)
      .spinner({
        step: envVarLimits.vel.si.step,
        min: envVarLimits.vel.si.min,
        max: envVarLimits.vel.si.max,
        numberFormat: "n",
      });
    v1 = $("#vel1").val();
    $("#vel1").val((v1 / 196.9).toFixed(2));
    v2 = $("#vel2").val();
    $("#vel2").val((v2 / 196.9).toFixed(2));

    $("#step-select-vel").find("option").remove().end();
    optionsAirSpeed.options.add(new Option("0.05 m/s", 0.05));
    optionsAirSpeed.options.add(new Option("0.1 m/s", 0.1));
    optionsAirSpeed.options.add(new Option("0.2 m/s", 0.2));

    $("#step-select-tr").find("option").remove().end();
    optionsMeanRadiantT.options.add(new Option("0.5 &deg;C", 0.5));
    optionsMeanRadiantT.options.add(new Option("1.0 &deg;C", 1.0));
    optionsMeanRadiantT.options.add(new Option("1.5 &deg;C", 1.5));

    if (hs === "dewpoint" || hs === "wetbulb") {
      $("#rh-unit").html(" &deg;C");
      v = util.FtoC($("#rh").val());
      $("#rh").val(v.toFixed(1));
    } else if (hs === "vappress") {
      $("#rh-unit").html(" KPa");
      v = $("#rh").val() * 2.953;
      $("#rh").val(v.toFixed(2));
    }
  } else {
    $(".tempunit").each(function () {
      $(this).html(" &deg;F");
    });
    $("#ta, #tr, #tr1, #tr2").each(function () {
      v = util.CtoF($(this).val());
      $(this).val(v.toFixed(0));
    });
    $("#inner-range-width, #outer-range-width").each(function () {
      v = parseFloat($(this).html()) * 1.8;
      $(this).html(v.toFixed(1));
    });
    $("#range-output1, #range-output2").each(function () {
      v = util.CtoF(parseFloat($(this).html()));
      $(this).html(v.toFixed(1));
    });

    if (rangeYes) {
      if (rangefactor === "tr") {
        $("#factor-output1, #factor-output2").each(function () {
          v = util.CtoF(parseFloat($(this).html()));
          $(this).html(v.toFixed(1));
        });
      }
      if (rangefactor === "vel") {
        v1 = $("#factor-output1").html();
        $("#factor-output1").html((v1 * 196.9).toFixed(0));
        v2 = $("#factor-output2").html();
        $("#factor-output2").html((v2 * 196.9).toFixed(0));
      }
    }

    $(".vel-unit").html(" fpm");
    v = $("#vel").val();
    $("#vel")
      .val(v * 196.9)
      .spinner({
        step: envVarLimits.vel.ip.step,
        min: envVarLimits.vel.ip.min,
        max: envVarLimits.vel.ip.max,
        numberFormat: "n",
      });
    v1 = $("#vel1").val();
    $("#vel1").val((v1 * 196.9).toFixed(0));
    v2 = $("#vel2").val();
    $("#vel2").val((v2 * 196.9).toFixed(0));

    $("#step-select-vel").find("option").remove().end();
    optionsAirSpeed.options.add(new Option("10 fpm", 10));
    optionsAirSpeed.options.add(new Option("20 fpm", 20));
    optionsAirSpeed.options.add(new Option("40 fpm", 40));

    $("#step-select-tr").find("option").remove().end();
    optionsMeanRadiantT.options.add(new Option("1.0 &deg;F", 1.0));
    optionsMeanRadiantT.options.add(new Option("2.0 &deg;F", 2.0));
    optionsMeanRadiantT.options.add(new Option("3.0 &deg;F", 3.0));

    if (hs === "dewpoint" || hs === "wetbulb") {
      $("#rh-unit").html(" &deg;F");
      v = util.CtoF($("#rh").val());
      $("#rh").val(v.toFixed(1));
    } else if (hs === "vappress") {
      $("#rh-unit").html(" in HG");
      v = $("#rh").val() / 2.953;
      $("#rh").val(v.toFixed(2));
    }
  }
  pc.toggleUnits(isCelsius);
  bc.toggleUnits(isCelsius);
}

function drawRange(factor, incr) {
  rangeYes = true;
  rangefactor = factor;
  d3.selectAll("path.comfortzone").remove();
  d3.selectAll(".comfortzone-temphum").remove();
  d3.selectAll("circle").remove();
  removeRanges();
  // $('.inputfield').css('background-color', '#DCE7F7');
  $("#ta-lab, #inputfield-ta").css("visibility", "hidden");

  setFactors(factor);

  var fakeFactor_1 = factor_1 * 1000;
  var fakeFactor_2 = factor_2 * 1000;

  if (fakeFactor_1 < fakeFactor_2) {
    for (var x = fakeFactor_1; x <= fakeFactor_2; x += incr) {
      d[factor] = x / 1000;

      var bound = pc.findComfortBoundary(d, 0.5);
      var bcBound = bc.convertBoundary(bound);
      pc.drawNewZone(d, bound, factor, x);
      bc.drawNewZone(d, bcBound, factor, x);
    }

    last_value = (x - incr) / 1000;

    var curve = pc.findRHCurve(d, 0.5, factor);
    var line = bc.findRHcurve(d, 0.5, factor);
    pc.drawRHCurve(curve);
    bc.drawRHcurve(line);

    $("#output-ranges").show();
    $(".factor-name").html(factor_names[rangefactor]);
    $("#factor-name").html(factor_names[rangefactor]);
    // $("#inputfield-" + factor).css('background-color', '#CECEE3');
  } else {
    alert("insert the min and max values of the range");
  }
}

function drawTRrange() {
  let tr_incr;
  if (!isCelsius) {
    tr_incr =
      (parseFloat(document.getElementById("step-select-tr").value) / 1.8) *
      1000;
  } else {
    tr_incr =
      parseFloat(document.getElementById("step-select-tr").value) * 1000;
  }
  drawRange("tr", tr_incr);
}

function drawVELrange() {
  let vel_incr;
  if (!isCelsius) {
    vel_incr =
      (parseFloat(document.getElementById("step-select-vel").value) / 196.9) *
      1000;
  } else {
    vel_incr =
      parseFloat(document.getElementById("step-select-vel").value) * 1000;
  }
  drawRange("vel", vel_incr);
}

function drawMETrange() {
  var met_incr =
    parseFloat(document.getElementById("step-select-met").value) * 1000;
  drawRange("met", met_incr);
}

function drawCLOrange() {
  var clo_incr =
    parseFloat(document.getElementById("step-select-clo").value) * 1000;
  drawRange("clo", clo_incr);
}

function setInputs() {
  keys.forEach(function (element) {
    d_cache[element] = d[element];
    var e = document.getElementById(element).value;
    e = e.replace(/,/g, ".");
    d[element] = parseFloat(e);
  });
  d.wme = 0;
}

function setFactors(factor) {
  if (!isCelsius) {
    setInputs();
    d.ta = util.FtoC(d.ta);
    d.tr = util.FtoC(d.tr);
    d.vel /= 196.9;
    if (factor === "tr") {
      factor_1 = util.FtoC(
        parseFloat(document.getElementById(factor + "1").value)
      );
      factor_2 = util.FtoC(
        parseFloat(document.getElementById(factor + "2").value)
      );
    } else if (factor === "vel") {
      factor_1 =
        parseFloat(document.getElementById(factor + "1").value) / 196.9;
      factor_2 =
        parseFloat(document.getElementById(factor + "2").value) / 196.9;
    } else if (factor === "met" || factor === "clo") {
      factor_1 = parseFloat(document.getElementById(factor + "1").value);
      factor_2 = parseFloat(document.getElementById(factor + "2").value);
    }
    if (window.humUnit === "wetbulb" || window.humUnit === "dewpoint")
      d.rh = util.FtoC(d.rh);
    else if (window.humUnit === "vappress") d.rh *= 2953;
  } else {
    if (window.humUnit === "vappress") d.rh *= 1000;
    factor_1 = parseFloat(document.getElementById(factor + "1").value);
    factor_2 = parseFloat(document.getElementById(factor + "2").value);
    setInputs();
  }
  d.rh = psy.convert(d.rh, d.ta, window.humUnit, "rh");
}

function removeRanges() {
  d3.selectAll("path.comfortzone-range").remove();
  pc.removeRHCurve();
  d3.selectAll("path.comfortzone-temphum-range").remove();
  bc.removeRHcurve();
}

function update() {
  if ($("#link").is(":checked")) {
    $("#tr").val($("#ta").val());
  }

  setInputs();

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

  let b;

  if ($("#chart-div").is(":visible")) {
    b = pc.findComfortBoundary(d, 0.5);
    pc.redrawComfortRegion(b);
    var pointdata = [
      {
        db: d.ta,
        hr: pc.getHumRatio(d.ta, d.rh),
      },
    ];
    pc.redrawPoint(pointdata);
  } else if ($("#temphumchart-div").is(":visible")) {
    b = bc.findComfortBoundary(d, 0.5);
    bc.redrawComfortRegion(b);
    bc.redrawPoint();
  }
}

function parameter_selection_change() {
  resetDefaultValues();
  const parameter = $("#parameter_select").val();
  const chart = $("#chartSelect").val();
  $(
    "#inputfield-ta, #tr-lab, #inputfield-tr, #tr_vel, #inputfield-vel, #tr_hum, #inputfield-hum, #tr_met, #inputfield-met, #tr_clo, #inputfield-clo"
  ).hide();
  $(
    "#mrt_val_row, #vel_val_row, #clo_val_row, #met_val_row, #hum_val_row"
  ).hide();
  if (parameter === "sel_t_mrt") {
    $("#tr-lab, #inputfield-tr").show();
    $("#vel_val_row, #clo_val_row, #met_val_row, #hum_val_row").show();
    drawTRrange();
  } else if (parameter === "sel_air_vel") {
    $("#tr_vel, #inputfield-vel").show();
    $("#mrt_val_row, #clo_val_row, #met_val_row, #hum_val_row").show();
    drawVELrange();
  } else if (parameter === "sel_met") {
    $("#tr_met, #inputfield-met").show();
    $("#mrt_val_row, #vel_val_row, #clo_val_row, #hum_val_row").show();
    drawMETrange();
  } else if (parameter === "sel_clo") {
    $("#tr_clo, #inputfield-clo").show();
    $("#mrt_val_row, #vel_val_row, #met_val_row, #hum_val_row").show();
    drawCLOrange();
  }
  if (chart === "psychtop") {
    $("#mrt_val_row").hide();
  }
  update();
}
