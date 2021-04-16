// ----- CODE to draw the comfort zone on a chart with operative Temp on the x-axis and Air speed on the y-axis -----
// ----- time out section for testing the change from rh to speed

var vc = new (function () {
  let pageWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  this.width = pageWidth;
  if (pageWidth > 580) {
    this.width = 580;
  }

  // set up viewport
  this.margin = 60;
  this.rbmargin = 40;
  this.height = 500;
  this.db_min = 20;
  this.db_max = 34;

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

  this.vel_extent = [0, 1.2001];
  this.vel_scale = d3.scale
    .linear()
    .range([this.height - this.margin, this.rbmargin])
    .domain(this.vel_extent);

  this.vel_extent_fpm = [0, 241];
  this.vel_scale_fpm = d3.scale
    .linear()
    .range([this.height - this.margin, this.rbmargin])
    .domain(this.vel_extent_fpm);

  // defining a poliline
  this.pline = d3.svg
    .line()
    .x(function (d) {
      return this.db_scale(d.db);
    })
    .y(function (d) {
      return this.vel_scale(d.vel);
    });

  this.drawChart = function () {
    const db_axis = d3.svg.axis().scale(vc.db_scale);
    const db_axis_F = d3.svg.axis().scale(vc.db_scale_F);
    const vel_axis = d3.svg.axis().scale(vc.vel_scale).orient("left");
    const vel_axis_fpm = d3.svg.axis().scale(vc.vel_scale_fpm).orient("left");

    d3.svg
      .line()
      .x(function (d) {
        return vc.db_scale(d.db);
      })
      .y(function (d) {
        return vc.vel_scale(d.vel);
      })
      .interpolate("cardinal");

    // drawing svg
    d3.select("#veltopchart-div")
      .append("svg")
      .attr("class", "svg-veltop")
      .attr("id", "svg-veltop")
      .attr("width", vc.width)
      .attr("height", vc.height);

    vc.svg = d3.select(".svg-veltop");

    // ClipPath
    vc.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip_vt")
      .append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", vc.width - vc.margin - vc.rbmargin)
      .attr("height", vc.height - vc.margin - vc.rbmargin)
      .attr("transform", "translate(" + vc.margin + "," + vc.rbmargin + ")");

    // Drawing the axes
    vc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-C-veltop")
      .attr("transform", "translate(0," + (vc.height - vc.margin) + ")")
      .call(
        db_axis
          .tickSubdivide(0)
          .tickSize(-(vc.height - vc.margin - vc.rbmargin), 0)
          .tickPadding(5)
      );

    vc.svg
      .append("g")
      .attr("class", "db axis")
      .attr("id", "db-axis-F-veltop")
      .attr("opacity", "0")
      .attr("transform", "translate(0," + (vc.height - vc.margin) + ")")
      .call(
        db_axis_F
          .tickSubdivide(0)
          .tickSize(-(vc.height - vc.margin - vc.rbmargin), 0)
          .tickPadding(5)
      );

    vc.svg
      .append("g")
      .attr("class", "vel axis")
      .attr("id", "vel-text-vt")
      .attr("transform", "translate(" + vc.margin + ",0)")
      .call(
        vel_axis
          .tickSubdivide(0)
          .tickSize(-(vc.width - vc.margin - vc.rbmargin), 0)
          .tickPadding(5)
      );

    vc.svg
      .append("g")
      .attr("class", "vel axis")
      .attr("id", "vel-text-vt-fpm")
      .attr("opacity", "0")
      .attr("transform", "translate(" + vc.margin + ",0)")
      .call(
        vel_axis_fpm
          .tickSubdivide(0)
          .tickSize(-(vc.width - vc.margin - vc.rbmargin), 0)
          .tickPadding(5)
      );

    // giving labels to the axes
    d3.select("#db-axis-C-veltop")
      .append("text")
      .text("Operative Temperature [°C]")
      .attr("class", "db-unit")
      .attr("x", vc.width / 2 - 50)
      .attr("y", vc.margin / 1.6);

    d3.select("#db-axis-F-veltop")
      .append("text")
      .text("Operative Temperature [°F]")
      .attr("class", "db-unit")
      .attr("x", vc.width / 2 - 50)
      .attr("y", vc.margin / 1.6);

    d3.select("#vel-text-vt")
      .append("text")
      .text("Relative Air Speed [m/s]")
      .attr("transform", "rotate (-90, -45, -10) translate(-350)");

    d3.select("#vel-text-vt-fpm")
      .append("text")
      .text("Relative Air Speed [fpm]")
      .attr("transform", "rotate (-90, -45, -10) translate(-350)");
  };

  this.drawComfortRegion = function (data) {
    d3.select(".svg-veltop")
      .append("path")
      .attr("clip-path", "url(#clip_vt)")
      .attr("d", vc.pline(data) + "Z")
      .attr("class", "comfortzone-veltop")
      .attr("id", "veltop-comfortzone")
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfortzoneover");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfortzone-veltop");
      });
  };

  this.redrawComfortRegion = function (data) {
    d3.select(".comfortzone-veltop")
      .transition()
      .attr("d", vc.pline(data) + "Z");
  };

  this.drawPoint = function () {
    vc.svg
      .append("circle")
      .attr("class", "outer")
      .attr("clip-path", "url(#clip_vt)")
      .attr("r", 12);

    vc.svg
      .append("circle")
      .attr("clip-path", "url(#clip_vt)")
      .attr("class", "inner")
      .attr("r", 2);

    d3.selectAll("circle")
      .attr("cx", vc.db_scale(d.ta))
      .attr("cy", vc.vel_scale(d.vel));
  };

  this.redrawPoint = function () {
    d3.selectAll("circle")
      .transition()
      .attr("cx", vc.db_scale(d.ta))
      .attr("cy", vc.vel_scale(d.vel));
  };

  this.findComfortBoundary = function (d, pmvlimit) {
    const local_control = $("#local-control").val();
    let boundary = [];
    let vel;

    function solve(vel, target) {
      const epsilon = 0.001;
      const a = 0;
      const b = 5;
      var fn = function (db) {
        return (
          comf.pmvElevatedAirspeed(db, db, vel, d.rh, d.met, d.clo, d.wme).pmv -
          target
        );
      };

      const t = util.secant(a, b, fn, epsilon);

      return {
        db: t,
        vel: vel,
      };
    }

    // find the first point in the bottom left corner
    boundary.push(solve(0.1, -pmvlimit));

    let temp_var;
    let temp_vel;
    // if the occupant has control on the air speed then there are no limits
    if (local_control === "withairspeedcontrol") {
      // add description saying that there is no upper limit for the air speed
      try {
        d3.selectAll("#note").remove();
      } catch (e) {}
      vc.svg
        .append("text")
        .text("There is no upper limit to air speed")
        .attr("class", "box-texts")
        .attr("id", "note")
        .attr(
          "transform",
          "translate(" + (vc.margin + 32) + "," + (vc.rbmargin + 30) + ")"
        );
      vc.svg
        .append("text")
        .text("when occupants have local control")
        .attr("class", "box-texts")
        .attr("id", "note")
        .attr(
          "transform",
          "translate(" + (vc.margin + 32) + "," + (vc.rbmargin + 42) + ")"
        );

      // add left side comfort region
      for (vel = 0.2; vel <= 1.4; vel += 0.1) {
        boundary.push(solve(vel, -pmvlimit));
      }

      // add right side comfort region
      for (vel = 1.4; vel >= 0.2; vel -= 0.1) {
        boundary.push(solve(vel, pmvlimit));
      }

      // add bottom right point
      boundary.push(solve(0.1, pmvlimit));
      // with no occupants' air speed control
    } else {
      d3.selectAll("#note").remove();

      // add left side comfort region
      for (vel = 0.2; vel <= 10; vel += 0.05) {
        temp_var = solve(vel, -pmvlimit);

        // ASHRAE constraints
        if (temp_var.db < 23) {
          boundary.push({
            db: temp_var.db,
            vel: 0.2,
          });
        } else if (temp_var.db >= 23 && temp_var.db <= 25.5) {
          temp_vel =
            50.49 - 4.4047 * temp_var.db + 0.096425 * temp_var.db * temp_var.db;
          if (temp_vel > 0.8 && temp_var.vel > temp_vel) {
            boundary.push({
              db: temp_var.db,
              vel: 0.8,
            });
          } else if (temp_var.vel > temp_vel) {
            boundary.push({
              db: temp_var.db,
              vel: temp_vel,
            });
          } else {
            boundary.push({
              db: temp_var.db,
              vel: temp_var.vel,
            });
          }
        } else if (temp_var.db > 25.5) {
          if (temp_var.vel > 0.8) {
            boundary.push({
              db: temp_var.db,
              vel: 0.8,
            });
          } else {
            boundary.push(temp_var);
          }
        }
      }

      // add right side comfort region
      for (vel = 0.8; vel >= 0.2; vel -= 0.05) {
        temp_var = solve(vel, pmvlimit);

        // ASHRAE constraints
        if (temp_var.db < 23) {
          boundary.push({
            db: temp_var.db,
            vel: 0.2,
          });
        } else if (temp_var.db >= 23 && temp_var.db <= 25.5) {
          temp_vel =
            50.49 - 4.4047 * temp_var.db + 0.096425 * temp_var.db * temp_var.db;
          if (temp_vel > 0.8) {
            boundary.push({
              db: temp_var.db,
              vel: 0.8,
            });
          } else {
            boundary.push(temp_var);
          }
        } else if (temp_var.db > 25.5) {
          boundary.push(temp_var);
        }
      }

      // add bottom right point
      boundary.push(solve(0.1, pmvlimit));
      // with no occupants' air speed control
    }
    return boundary;
  };

  this.toggleUnits = function (isCelsius) {
    if (isCelsius) {
      d3.select("#db-axis-C-veltop").attr("opacity", "100");
      d3.select("#db-axis-F-veltop").attr("opacity", "0");
      d3.select("#vel-text-vt").attr("opacity", "100");
      d3.select("#vel-text-vt-fpm").attr("opacity", "0");
    } else {
      d3.select("#db-axis-C-veltop").attr("opacity", "0");
      d3.select("#db-axis-F-veltop").attr("opacity", "100");
      d3.select("#vel-text-vt").attr("opacity", "0");
      d3.select("#vel-text-vt-fpm").attr("opacity", "100");
    }
  };
})();
