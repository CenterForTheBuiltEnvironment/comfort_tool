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
  this.hr_min = 0;
  this.hr_max = 30;

  this.init = function () {
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

    this.hr_extent = [this.hr_min, this.hr_max];
    this.hr_scale = d3.scale
      .linear()
      .range([this.height - this.rbmargin, this.rbmargin])
      .domain(this.hr_extent);

    this.bColorRange = d3.scale
      .linear()
      .domain([-3, 0])
      .range([d3.rgb("#4A40FF"), d3.rgb("#C2C2C2")]);
    this.rColorRange = d3.scale
      .linear()
      .domain([0, 3])
      .range([d3.rgb("#C2C2C2"), d3.rgb("#FF4040")]);

    this.pline = d3.svg
      .line()
      .x(function (d) {
        return this.db_scale(d.db);
      })
      .y(function (d) {
        return this.hr_scale(1000 * d.hr);
      });
  };
  this.init();

  this.drawChart = function () {
    const db_axis = d3.svg.axis().scale(pc.db_scale);
    const db_axis_F = d3.svg.axis().scale(pc.db_scale_F);
    const hr_axis = d3.svg.axis().scale(pc.hr_scale).orient("right");

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

    // basic frame of the box
    pc.svg
      .append("svg:a")
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Dry-bulb_temperature")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 10) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Dry-bulb_temperature")
      .append("text")
      .text("db")
      .attr("class", "box-texts")
      .attr("id", "box-db")
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 10) + ")"
      );

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
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Relative_humidity")
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
        "https://en.wikipedia.org/wiki/Humidity#Absolute_humidity"
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
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 12) + "," + (pc.rbmargin + 50) + ")"
      );

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
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 76) + "," + (pc.rbmargin + 50) + ")"
      );

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
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 105) + "," + (pc.rbmargin + 50) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Wet-bulb_temperature")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 70) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Wet-bulb_temperature")
      .append("text")
      .text("wb")
      .attr("class", "box-texts")
      .attr("id", "wb")
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 70) + ")"
      );

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
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Dew_point")
      .append("text")
      .text("t")
      .attr("class", "box-texts")
      .attr(
        "transform",
        "translate(" + pc.margin + "," + (pc.rbmargin + 90) + ")"
      );

    pc.svg
      .append("svg:a")
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Dew_point")
      .append("text")
      .text("dp")
      .attr("class", "box-texts")
      .attr("id", "box-dp")
      .attr("class", "subscript")
      .attr(
        "transform",
        "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 90) + ")"
      );

    const elements = document.getElementsByClassName("subscript");

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.fontSize = "9px";
    }

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
      .attr("xlink:href", "https://en.wikipedia.org/wiki/Enthalpy")
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
      .attr("x", pc.width / 2 - this.margin - this.rbmargin)
      .attr("y", pc.rbmargin / 1.3);

    d3.select("#db-axis-F")
      .append("text")
      .text("Dry-bulb Temperature [°F]")
      .attr("class", "db-unit")
      .attr("id", "db-axis-F-label")
      .attr("x", pc.width / 2 - this.margin - this.rbmargin)
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

    // drawing the background
    var psybound = pc.findPsyBoundary();
    pc.drawPsyRegion(psybound);
  };

  // calculate the values and draws the numbers in the box
  this.mousemove = function () {
    let mouseDBT = pc.db_scale.invert(d3.mouse(this)[0]);
    let mouseHR = pc.hr_scale.invert(d3.mouse(this)[1]);
    let mouseVP = (psy.PROP.Patm * mouseHR) / 1000 / (0.62198 + mouseHR / 1000);
    let mouseEnt =
      1.006 * mouseDBT + (mouseHR / 1000) * (2501 + 1.86 * mouseDBT);
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
    const boxDBT = $("#box-dbt");
    const boxWBT = $("#box-wbt");
    const boxDEW = $("#box-dew");
    const boxENT = $("#box-ent");
    let dbt = parseFloat(boxDBT.text());
    let wbt = parseFloat(boxWBT.text());
    let dew = parseFloat(boxDEW.text());
    let ent = parseFloat(boxENT.text());
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

      $("#box-db-unit").text("°C");
      $("#box-mrt-unit").text("°C");
      $("#box-vel-unit").text("m/s");
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

      $("#box-db-unit").text("°F");
      $("#box-mrt-unit").text("°F");
      $("#box-vel-unit").text("fpm");
    }
    boxDBT.text(dbt.toFixed(1));
    boxWBT.text(wbt.toFixed(1));
    boxDEW.text(dew.toFixed(1));
    boxENT.text(ent.toFixed(1));
  };

  this.drawComfortRegion = function (data) {
    const el = d3.select("path.comfortzone")[0][0];

    if (el) {
      d3.select("path.comfortzone").attr("d", pc.pline(data) + "Z");
    } else {
      pc.svg
        .insert("path", "circle")
        .attr("clip-path", "url(#clip)")
        .attr("d", pc.pline(data) + "Z")
        .attr("class", "comfortzone")
        .on("mouseover", function () {
          d3.select(this).attr("class", "comfortzoneover");
        })
        .on("mouseout", function () {
          d3.select(this).attr("class", "comfortzone");
        })
        .on("mousemove", pc.mousemove);
    }
  };

  this.remove_rh_lines = function () {
    d3.selectAll(".rhline").remove();
    d3.select(".rh100").remove();
  };

  this.draw_rh_lines = function () {
    // dynamic way of drawing rh lines
    for (let i = 100; i >= 10; i -= 10) {
      let RHline = [];
      for (let t = pc.db_min; t <= pc.db_max; t += 0.5) {
        RHline.push({ db: t, hr: pc.getHumRatio(t, i) });
      }
      if (i === 100) {
        d3.select("svg")
          .append("path")
          .attr("d", pc.pline(RHline))
          .attr("class", "rh100")
          .attr("clip-path", "url(#clip)");
      } else {
        d3.select("svg")
          .append("path")
          .attr("d", pc.pline(RHline))
          .attr("class", "rhline")
          .attr("clip-path", "url(#clip)");
      }
    }
  };

  this.redraw_rh_lines = function () {
    pc.remove_rh_lines();
    pc.draw_rh_lines();
    pc.clearChart();
    var json = [
      {
        db: d.ta,
        hr: pc.getHumRatio(d.ta, d.rh),
      },
    ];
    const b = pc.findComfortBoundary(d, 0.5);
    pc.drawComfortRegion(b);
    pc.drawPoint(json);
    bc.drawPoint();
    vc.drawPoint();
  };

  this.redrawComfortRegion = function (data) {
    d3.select("path.comfortzone")
      .transition()
      .attr("d", pc.pline(data) + "Z");
  };

  // Background
  this.drawPsyRegion = function (data) {
    d3.select("svg")
      .append("path")
      .attr("clip-path", "url(#clip)")
      .attr("d", pc.pline(data) + "Z")
      .attr("class", "psyregion")
      .on("mousemove", pc.mousemove);
  };

  this.drawPoint = function (data) {
    pc.svg
      .append("circle")
      .attr("class", "outer")
      .attr("clip-path", "url(#clip)")
      .attr("r", 12);

    pc.svg
      .append("circle")
      .attr("class", "inner")
      .attr("clip-path", "url(#clip)")
      .attr("r", 2);

    d3.selectAll("circle")
      .attr("cx", pc.db_scale(data[0].db))
      .attr("cy", pc.hr_scale(1000 * data[0].hr));
  };

  this.clearChart = function () {
    d3.selectAll("circle").remove();

    d3.selectAll(".comfortzone").remove();
  };

  this.redrawPoint = function (data) {
    d3.selectAll("circle")
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
      t = util.secant(a, b, fn, epsilon);
      if (isNaN(t)) {
        t = util.bisect(a, b, fn, epsilon, 0);
      }
      return {
        db: t,
        hr: pc.getHumRatio(t, rhx),
      };
    }

    const incr = 10;
    for (var rhx = 0; rhx <= 100; rhx += incr) {
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
    for (var rhx = 100; rhx >= 0; rhx -= incr) {
      boundary.push(solve(rhx, pmvlimit));
    }
    return boundary;
  };

  this.findPsyBoundary = function () {
    let psyboundary = [];

    psyboundary.push({
      db: 10,
      hr: 0,
    });
    psyboundary.push({
      db: 10,
      hr: pc.getHumRatio(10, 100),
    });
    let t = 10;
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
