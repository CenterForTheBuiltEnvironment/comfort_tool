// ----- CODE to draw the comfort zone on a chart with Dry-Bulb Temp on the x-axis and Relative Humidity on the y-axis -----
var bc = new (function () {
  let pageWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  this.width = pageWidth;
  if (pageWidth > 580) {
    this.width = 580;
  }
  this.margin = 60;
  this.rbmargin = 40;
  this.height = 500;
  this.db_min = 10;
  this.db_max = 36;

  // --------------------------  set up scales  --------------------------------------------------

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

  this.rh_extent = [0, 100];
  this.rh_scale = d3.scale
    .linear()
    .range([this.height - this.margin, this.rbmargin])
    .domain(this.rh_extent);

  // defining a poliline
  this.pline = d3.svg
    .line()
    .x(function (d) {
      return this.db_scale(d.db);
    })
    .y(function (d) {
      return this.rh_scale(d.rh);
    });

  // ----------------------------------- Start DrawChart -----------------------------------

  this.drawChart = function () {
    // Setting up the axes

    const db_axis = d3.svg.axis().scale(bc.db_scale);
    const db_axis_F = d3.svg.axis().scale(bc.db_scale_F);
    const rh_axis = d3.svg.axis().scale(bc.rh_scale).orient("left");

    d3.svg
      .line()
      .x(function (d) {
        return bc.db_scale(d.db);
      })
      .y(function (d) {
        return bc.rh_scale(d.rh);
      })
      .interpolate("cardinal");

    // drawing chart svg (the whole thing)

    d3.select("#temphumchart-div")
      .append("svg")
      .attr("class", "svg-temphum")
      .attr("width", bc.width)
      .attr("height", bc.height);

    bc.svg = d3.select(".svg-temphum");

    // ClipPath hides everything that goes outside the chart area

    bc.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip_th")
      .append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", bc.width - bc.margin - bc.rbmargin)
      .attr("height", bc.height - bc.margin - bc.rbmargin)
      .attr("transform", "translate(" + bc.margin + "," + bc.rbmargin + ")");

    // Drawing the axes

    bc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-C-temphum")
      .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
      .call(
        db_axis
          .tickSubdivide(0)
          .tickSize(-(bc.height - bc.margin - bc.rbmargin), 0)
      );

    bc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-F-temphum")
      .attr("opacity", "0")
      .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
      .call(
        db_axis_F
          .tickSubdivide(0)
          .tickSize(-(bc.height - bc.margin - bc.rbmargin), 0)
      );

    bc.svg
      .append("g")
      .attr("class", "rh axis")
      .attr("transform", "translate(" + bc.margin + ",0)")
      .call(
        rh_axis
          .tickSubdivide(0)
          .tickSize(-(bc.width - bc.margin - bc.rbmargin), 0)
      );

    // giving labels to the axes

    d3.select("#db-axis-C-temphum")
      .append("text")
      .text("Dry-bulb Temperature [°C]")
      .attr("class", "db-unit")
      .attr("x", bc.width / 2 - 50)
      .attr("y", bc.margin / 1.6);

    d3.select("#db-axis-F-temphum")
      .append("text")
      .text("Dry-bulb Temperature [°F]")
      .attr("class", "db-unit")
      .attr("x", bc.width / 2 - 50)
      .attr("y", bc.margin / 1.6);

    d3.select(".rh.axis")
      .append("text")
      .attr("id", "rh-text")
      .text("Relative Humidity [%]")
      .attr("transform", "rotate (-90, -35, 0) translate(-350)");

    bc.drawThings("1");
  };

  this.drawThings = function (i) {
    var bound = bc.findComfortBoundary(d, 0.5);
    bc.drawComfortRegion(bound, i);
    bc.drawPoint(i);
  };

  // motofront construction
  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  // Comfort Zone

  this.drawComfortRegion = function (data, i) {
    bc.svg
      .append("path")
      .attr("clip-path", "url(#clip_th)")
      .attr("d", bc.pline(data) + "Z")
      .attr("class", "comfortzone" + i)
      .attr("id", "temphum-comfortzone" + i)
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfortzone" + i + "over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfortzone" + i);
      });
  };

  this.redrawComfortRegion = function (data, i) {
    d3.select("#temphum-comfortzone" + i)
      .transition()
      .attr("d", bc.pline(data) + "Z");
  };

  // draw the points

  this.drawPoint = function (i) {
    bc.svg
      .append("circle")
      .attr("class", "point" + i)
      .attr("id", "temphum-outer" + i)
      .attr("r", 12);

    bc.svg
      .append("circle")
      .attr("class", "point" + i)
      .attr("id", "temphum-inner" + i)
      .attr("r", 2);

    d3.select("#temphum-inner" + i)
      .moveToFront()
      .attr("cx", bc.db_scale(d.ta))
      .attr("cy", bc.rh_scale(d.rh));
    d3.select("#temphum-outer" + i)
      .moveToFront()
      .attr("cx", bc.db_scale(d.ta))
      .attr("cy", bc.rh_scale(d.rh));
  };

  this.redrawPoint = function (i) {
    d3.select("#temphum-inner" + i)
      .moveToFront()
      .transition()
      .attr("cx", bc.db_scale(d.ta))
      .attr("cy", bc.rh_scale(d.rh));
    d3.select("#temphum-outer" + i)
      .moveToFront()
      .transition()
      .attr("cx", bc.db_scale(d.ta))
      .attr("cy", bc.rh_scale(d.rh));
  };

  // function to calculate humidity ratio (hr) given DBT and RH
  this.getHumRatio = function (db, rh) {
    return psy.humratio(psy.PROP.Patm, (rh * psy.satpress(db)) / 100);
  };

  // Create comfort zone boundary, by adding points to an array

  this.findComfortBoundary = function (d, pmvlimit) {
    var boundary = [];

    function solve(rh, target) {
      var epsilon = 0.001;
      var a = -50;
      var b = 50;
      var fn = function (db) {
        return (
          comf.pmvElevatedAirspeed(db, d.tr, d.vel, rh, d.met, d.clo, d.wme)
            .pmv - target
        );
      };
      //t = util.bisect(a, b, fn, epsilon, target)
      t = util.secant(a, b, fn, epsilon);
      return {
        db: t,
        rh: rh,
      };
    }

    for (let rh = 0; rh <= 100; rh += 10) {
      boundary.push(solve(rh, -pmvlimit));
    }

    for (let rh = 100; rh >= 0; rh -= 10) {
      boundary.push(solve(rh, pmvlimit));
    }

    return boundary;
  };

  // Switch between Celsius and Farenheit changing opacity

  this.toggleUnits = function (isCelsius) {
    if (isCelsius) {
      d3.select("#db-axis-C-temphum").attr("opacity", "100");
      d3.select("#db-axis-F-temphum").attr("opacity", "0");
    } else {
      d3.select("#db-axis-C-temphum").attr("opacity", "0");
      d3.select("#db-axis-F-temphum").attr("opacity", "100");
    }
  };
})();
