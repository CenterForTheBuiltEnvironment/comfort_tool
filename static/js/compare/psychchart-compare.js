var pc = new (function () {
  let pageWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  this.width = pageWidth;
  if (pageWidth > 580) {
    this.width = 580;
  }

  this.margin = 40;
  this.rbmargin = 60;
  this.height = 500;
  this.db_min = 10;
  this.db_max = 36;

  this.db_extent = [this.db_min, this.db_max];
  this.db_scale = d3.scale
    .linear()
    .range([this.margin, this.width - this.rbmargin])
    .domain(this.db_extent);

  this.db_extent_F = [util.CtoF(this.db_min), util.CtoF(this.db_max)];
  this.db_scale_F = d3.scale
    .linear()
    .range([this.margin, this.width - this.rbmargin])
    .domain(this.db_extent_F);

  this.hr_extent = [0, 30];
  this.hr_scale = d3.scale
    .linear()
    .range([this.height - this.rbmargin, this.rbmargin])
    .domain(this.hr_extent);

  this.pline = d3.svg
    .line()
    .x(function (d) {
      return this.db_scale(d.db);
    })
    .y(function (d) {
      return this.hr_scale(1000 * d.hr);
    });

  this.drawChart = function () {
    var db_axis = d3.svg.axis().scale(pc.db_scale);
    var db_axis_F = d3.svg.axis().scale(pc.db_scale_F);
    var hr_axis = d3.svg.axis().scale(pc.hr_scale).orient("right");

    d3.svg
      .line()
      .x(function (d) {
        return pc.db_scale(d.db);
      })
      .y(function (d) {
        return pc.hr_scale(1000 * d.hr);
      })
      .interpolate("cardinal");

    d3.select("#chart-div")
      .append("svg")
      .attr("class", "svg-psych")
      .attr("id", "svg-psych")
      .attr("width", pc.width)
      .attr("height", pc.height);

    pc.svg = d3.select(".svg-psych");

    pc.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", pc.width - pc.margin - pc.rbmargin)
      .attr("height", pc.height - pc.margin - pc.rbmargin - 20)
      .attr("transform", "translate(" + pc.margin + "," + pc.rbmargin + ")");

    pc.draw_rh_lines();

    // box with values changing with the mouse movement  ----------------------------
    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 10) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
      .append("text")
      .text("db")
      .attr("class", "box-texts")
      .attr("id", "box-db")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 10) + ")"
      );
    document.getElementById("box-db").style.fontSize = "9px";

    pc.svg
      .append("text")
      .text("°C")
      .attr("class", "box-texts")
      .attr("id", "unit-dbt")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 10) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Relative_humidity")
      .append("text")
      .text("rh")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 30) + ")"
      );

    pc.svg
      .append("text")
      .text("%")
      .attr("class", "box-texts")
      .attr("id", "unit-rh")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 30) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr(
        "xlink:href",
        "http://en.wikipedia.org/wiki/Humidity#Absolute_humidity"
      )
      .append("text")
      .text("W")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 50) + ")"
      );

    pc.svg
      .append("text")
      .text("a")
      .attr("class", "box-texts")
      .attr("id", "box-a")
      .attr(
        "transform",
        "translate(" + (pc.margin + 12) + "," + (pc.rbmargin + 50) + ")"
      );

    document.getElementById("box-a").style.fontSize = "9px";

    pc.svg
      .append("text")
      .text("g")
      .attr("class", "box-texts")
      .attr("id", "unit-hr1")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 50) + ")"
      );

    pc.svg
      .append("text")
      .text("w")
      .attr("class", "box-texts")
      .attr("id", "unit-hr2")
      .attr(
        "transform",
        "translate(" + (pc.margin + 76) + "," + (pc.rbmargin + 50) + ")"
      );

    document.getElementById("unit-hr2").style.fontSize = "9px";

    pc.svg
      .append("text")
      .text("/kg")
      .attr("class", "box-texts")
      .attr("id", "unit-hr3")
      .attr(
        "transform",
        "translate(" + (pc.margin + 83) + "," + (pc.rbmargin + 50) + ")"
      );

    pc.svg
      .append("text")
      .text("da")
      .attr("class", "box-texts")
      .attr("id", "unit-hr4")
      .attr(
        "transform",
        "translate(" + (pc.margin + 105) + "," + (pc.rbmargin + 50) + ")"
      );

    document.getElementById("unit-hr4").style.fontSize = "9px";

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 70) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
      .append("text")
      .text("wb")
      .attr("class", "box-texts")
      .attr("id", "wb")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 70) + ")"
      );

    document.getElementById("wb").style.fontSize = "9px";

    pc.svg
      .append("text")
      .text("°C")
      .attr("class", "box-texts")
      .attr("id", "unit-wbt")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 70) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 90) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
      .append("text")
      .text("dp")
      .attr("class", "box-texts")
      .attr("id", "box-dp")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 90) + ")"
      );

    document.getElementById("box-dp").style.fontSize = "9px";

    pc.svg
      .append("text")
      .text("°C")
      .attr("class", "box-texts")
      .attr("id", "unit-dew")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 90) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "http://en.wikipedia.org/wiki/Enthalpy")
      .append("text")
      .text("h")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 110) + ")"
      );

    pc.svg
      .append("text")
      .text("kJ/kg")
      .attr("class", "box-texts")
      .attr("id", "unit-ent")
      .attr(
        "transform",
        "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 110) + ")"
      );

    // this is for the initial values, set to 0.0
    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-dbt")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 10) + ")"
      );

    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-rh")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 30) + ")"
      );

    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-hr")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 50) + ")"
      );

    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-wbt")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 70) + ")"
      );

    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-dew")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 90) + ")"
      );

    pc.svg
      .append("text")
      .text("0.0")
      .attr("class", "box-texts")
      .attr("id", "box-ent")
      .attr(
        "transform",
        "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 110) + ")"
      );

    pc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-C")
      .attr("transform", "translate(0," + (pc.height - pc.rbmargin) + ")")
      .call(db_axis);

    pc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-F")
      .attr("opacity", "0")
      .attr("transform", "translate(0," + (pc.height - pc.rbmargin) + ")")
      .call(db_axis_F);

    pc.svg
      .append("g")
      .attr("class", "hr axis")
      .attr("transform", "translate(" + (pc.width - pc.rbmargin) + ",0)")
      .call(hr_axis);

    d3.select("#db-axis-C")
      .append("text")
      .text("Dry-bulb Temperature [°C]")
      .attr("class", "db-unit")
      .attr("id", "db-axis-C-label")
      .attr("x", pc.width / 2 - 1.9 * pc.margin)
      .attr("y", pc.rbmargin / 1.3);

    d3.select("#db-axis-F")
      .append("text")
      .text("Dry-bulb Temperature [°F]")
      .attr("class", "db-unit")
      .attr("id", "db-axis-F-label")
      .attr("x", pc.width / 2 - 1.9 * pc.margin)
      .attr("y", pc.rbmargin / 1.3);

    d3.select(".hr.axis")
      .append("text")
      .attr("id", "hr-text")
      .attr("transform", "rotate (-90, -43, 0) translate(-360,90)")
      .append("tspan")
      .text("Humidity Ratio [g")
      .attr("id", "hr-unit0");

    d3.select("#hr-text")
      .append("tspan")
      .text("w")
      .style("baseline-shift", "sub");

    d3.select("#hr-text").append("tspan").text(" / kg").attr("id", "hr-unit1");

    d3.select("#hr-text")
      .append("tspan")
      .text("da")
      .style("baseline-shift", "sub");

    d3.select("#hr-text").append("tspan").text("]");

    // drawing the comfort and psy regions...........................

    const psybound = pc.findPsyBoundary();
    pc.drawPsyRegion(psybound);
    pc.drawThings("1");
  };

  this.remove_rh_lines = function () {
    d3.selectAll(".rhline").remove();
    d3.select(".rh100").remove();
  };

  this.draw_rh_lines = function () {
    // dynamic way of drawing rh lines
    let i;
    for (i = 100; i >= 10; i -= 10) {
      let rh_line = [];
      for (let t = pc.db_min; t <= pc.db_max; t += 0.5) {
        rh_line.push({
          db: t,
          hr: pc.getHumRatio(t, i),
        });
      }
      if (i === 100) {
        d3.select("svg")
          .append("path")
          .attr("d", pc.pline(rh_line))
          .attr("class", "rh100")
          .attr("clip-path", "url(#clip)");
      } else {
        d3.select("svg")
          .append("path")
          .attr("d", pc.pline(rh_line))
          .attr("class", "rhline")
          .attr("clip-path", "url(#clip)");
      }
    }
  };

  this.clearChart = function () {
    d3.selectAll("circle").remove();

    d3.selectAll(".comfortzone1").remove();
    d3.selectAll(".comfortzone2").remove();
    d3.selectAll(".comfortzone3").remove();
  };

  this.redraw_rh_lines = function () {
    pc.remove_rh_lines();
    pc.draw_rh_lines();
    pc.clearChart();

    if ($("#inputs1").is(":checked")) pc.drawThings("1");
    if ($("#inputs2").is(":checked")) pc.drawThings("2");
    if ($("#inputs3").is(":checked")) pc.drawThings("3");
  };

  this.drawThings = function (i) {
    const json = [
      {
        db: d.ta,
        hr: pc.getHumRatio(d.ta, d.rh),
      },
    ];
    const b = pc.findComfortBoundary(d, 0.5);

    pc.drawComfortRegion(b, i);
    pc.drawPoint(json, i);
  };

  //moveToFront construction
  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  // calculate the values and draws the numbers in the box -------------------------------

  this.mousemove = function () {
    let mouseDBT = pc.db_scale.invert(d3.mouse(this)[0]);
    let mouseHR = pc.hr_scale.invert(d3.mouse(this)[1]);
    let mouseVP = (psy.PROP.Patm * mouseHR) / 1000 / (0.62198 + mouseHR / 1000);
    let mouseEnt =
      (1.006 * mouseDBT + mouseHR * (2501 + 1.86 * mouseDBT)) / 1000;
    let mouseRH = (mouseVP / psy.satpress(mouseDBT)) * 100;
    let mouseWBT = psy.wetbulb(mouseDBT, mouseHR / 1000);
    let mouseDew =
      -35.957 -
      1.8726 * Math.log(mouseVP) +
      1.1689 * Math.pow(Math.log(mouseVP), 2);
    if (mouseVP <= 0.01) {
      mouseDew = -35.0;
    }
    if (mouseRH >= 100) {
      mouseRH = 100;
    }
    if (!isCelsius) {
      mouseDBT = util.CtoF(mouseDBT);
      mouseDew = util.CtoF(mouseDew);
      mouseWBT = util.CtoF(mouseWBT);
      mouseEnt *= 0.43;
    }
    d3.select("#box-dbt").text(mouseDBT.toFixed(1));
    d3.select("#box-rh").text(mouseRH.toFixed(1));
    d3.select("#box-hr").text(mouseHR.toFixed(1));
    d3.select("#box-wbt").text(mouseWBT.toFixed(1));
    d3.select("#box-dew").text(mouseDew.toFixed(1));
    d3.select("#box-ent").text(mouseEnt.toFixed(1));
  };

  this.convertBox = function () {
    let dbt = parseFloat($("#box-dbt").text());
    let wbt = parseFloat($("#box-wbt").text());
    let dew = parseFloat($("#box-dew").text());
    let ent = parseFloat($("#box-ent").text());
    if (isCelsius) {
      dbt = util.FtoC(dbt);
      wbt = util.FtoC(wbt);
      dew = util.FtoC(dew);
      ent /= 0.43;
      $("#unit-dbt").text("°C");
      $("#unit-wbt").text("°C");
      $("#unit-dew").text("°C");
      $("#unit-ent").text("kJ/kg");
      $("#unit-hr1").text("g");
      $("#unit-hr3").text("/kg");
    } else {
      dbt = util.CtoF(dbt);
      wbt = util.CtoF(wbt);
      dew = util.CtoF(dew);
      ent *= 0.43;
      $("#unit-dbt").text("°F");
      $("#unit-wbt").text("°F");
      $("#unit-dew").text("°F");
      $("#unit-ent").text("btu/lb");
      $("#unit-hr1").text("lb");
      $("#unit-hr3").text("/klb");
    }
    $("#box-dbt").text(dbt.toFixed(1));
    $("#box-wbt").text(wbt.toFixed(1));
    $("#box-dew").text(dew.toFixed(1));
    $("#box-ent").text(ent.toFixed(1));
  };

  // Comfort zones
  this.drawComfortRegion = function (data, i) {
    pc.svg
      .append("path")
      .attr("clip-path", "url(#clip)")
      .attr("d", pc.pline(data) + "Z")
      .attr("class", "comfortzone" + i)
      .attr("id", "psych-comfortzone" + i)
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfortzone" + i + "over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfortzone" + i);
      })
      .on("mousemove", pc.mousemove);
  };

  this.redrawComfortRegion = function (data, i) {
    d3.select("#psych-comfortzone" + i)
      .transition()
      .attr("d", pc.pline(data) + "Z");
  };

  // Entire Chart - this is the new background

  this.drawPsyRegion = function (data) {
    d3.select("svg")
      .append("path")
      .attr("clip-path", "url(#clip)")
      .attr("d", pc.pline(data) + "Z")
      .attr("class", "psyregion")
      .on("mousemove", pc.mousemove);
  };

  this.drawPoint = function (data, i) {
    pc.svg
      .append("circle")
      .attr("class", "point" + i)
      .attr("id", "psych-outer" + i)
      .attr("r", 12);

    pc.svg
      .append("circle")
      .attr("class", "point" + i)
      .attr("id", "psych-inner" + i)
      .attr("r", 2);

    d3.select("#psych-inner" + i)
      .moveToFront()
      .attr("cx", pc.db_scale(data[0].db))
      .attr("cy", pc.hr_scale(1000 * data[0].hr));
    d3.select("#psych-outer" + i)
      .moveToFront()
      .attr("cx", pc.db_scale(data[0].db))
      .attr("cy", pc.hr_scale(1000 * data[0].hr));
  };

  this.redrawPoint = function (data, i) {
    d3.select("#psych-inner" + i)
      .moveToFront()
      .transition()
      .attr("cx", pc.db_scale(data[0].db))
      .attr("cy", pc.hr_scale(1000 * data[0].hr));
    d3.select("#psych-outer" + i)
      .moveToFront()
      .transition()
      .attr("cx", pc.db_scale(data[0].db))
      .attr("cy", pc.hr_scale(1000 * data[0].hr));
  };

  this.getHumRatio = function (db, rh) {
    return psy.humratio(psy.PROP.Patm, (rh * psy.satpress(db)) / 100);
  };

  this.findComfortBoundary = function (d, pmvlimit) {
    let boundary = [];

    function rhclos(rhx, target) {
      return function (db) {
        // return comf.pmvElevatedAirspeed(db, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv - target
        if ($("#chartSelect").val() === "psychtop") {
          return (
            comf.pmvElevatedAirspeed(db, db, d.vel, rhx, d.met, d.clo, 0).pmv -
            target
          );
        } else {
          return (
            comf.pmvElevatedAirspeed(db, d.tr, d.vel, rhx, d.met, d.clo, 0)
              .pmv - target
          );
        }
      };
    }

    function solve(rhx, target) {
      const epsilon = 0.001; // ta precision
      const a = -50;
      const b = 50;
      const fn = rhclos(rhx, target);
      //                t = util.bisect(a, b, fn, epsilon, 0)
      t = util.secant(a, b, fn, epsilon);
      return {
        db: t,
        hr: pc.getHumRatio(t, rhx),
      };
    }

    const incr = 10;
    let rhx;
    for (rhx = 0; rhx <= 100; rhx += incr) {
      boundary.push(solve(rhx, -pmvlimit));
    }
    while (true) {
      t += 0.5;
      boundary.push({
        db: t,
        hr: pc.getHumRatio(t, 100),
      });
      if (
        comf.pmvElevatedAirspeed(t, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv >
        pmvlimit
      )
        break;
    }
    for (rhx = 100; rhx >= 0; rhx -= incr) {
      boundary.push(solve(rhx, pmvlimit));
    }
    return boundary;
  };

  this.findPsyBoundary = function () {
    var psyboundary = [];

    psyboundary.push({
      db: 10,
      hr: 0,
    });
    psyboundary.push({
      db: 10,
      hr: pc.getHumRatio(10, 100),
    });
    t = 10;
    while (true) {
      t += 0.5;
      psyboundary.push({
        db: t,
        hr: pc.getHumRatio(t, 100),
      });
      if (pc.getHumRatio(t, 100) > 30) break;
    }
    psyboundary.push({
      db: 36,
      hr: 30,
    });
    psyboundary.push({
      db: 36,
      hr: 0,
    });

    return psyboundary;
  };

  this.toggleUnits = function (isCelsius) {
    if (isCelsius) {
      d3.select("#db-axis-C").attr("opacity", "100");
      d3.select("#db-axis-F").attr("opacity", "0");
      document.getElementById("hr-unit0").textContent = "Humidity Ratio [g";
      document.getElementById("hr-unit1").textContent = "/ kg";
    } else {
      d3.select("#db-axis-C").attr("opacity", "0");
      d3.select("#db-axis-F").attr("opacity", "100");
      document.getElementById("hr-unit0").textContent = "Humidity Ratio [lb";
      document.getElementById("hr-unit1").textContent = "/ klb";
    }
    this.convertBox();
  };
})();
