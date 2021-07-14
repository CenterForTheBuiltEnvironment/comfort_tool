var enpc = new (function () {
  this.drawComfortRegions = function (d) {
    var boundI = enpc.findComfortBoundary(d, 0.2);
    var boundII = enpc.findComfortBoundary(d, 0.5);
    var boundIII = enpc.findComfortBoundary(d, 0.7);
    enpc.drawComfortRegion(boundIII, "III");
    enpc.drawComfortRegion(boundII, "II");
    enpc.drawComfortRegion(boundI, "I");
  };

  this.redrawComfortRegions = function (d) {
    var boundI = enpc.findComfortBoundary(d, 0.2);
    var boundII = enpc.findComfortBoundary(d, 0.5);
    var boundIII = enpc.findComfortBoundary(d, 0.7);
    enpc.redrawComfortRegion(boundIII, "III");
    enpc.redrawComfortRegion(boundII, "II");
    enpc.redrawComfortRegion(boundI, "I");
  };

  this.drawComfortRegion = function (data, regionclass) {
    pc.svg
      .append("path")
      .attr("clip-path", "url(#clip)")
      .attr("d", pc.pline(data) + "Z")
      .attr("class", "comfortzone" + regionclass)
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfortzoneover" + regionclass);
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfortzone" + regionclass);
      })
      .on("mousemove", pc.mousemove);
  };

  this.redrawComfortRegion = function (data, regionclass) {
    d3.select("path.comfortzone" + regionclass)
      .transition()
      .attr("d", pc.pline(data) + "Z");
  };

  this.findComfortBoundary = function (d, pmvlimit) {
    var boundary = [];

    function rhclos(rhx, target) {
      return function (db) {
        if ($("#chartSelect").val() == "psychtop") {
          return comf.pmvEN(db, db, d.vel, rhx, d.met, d.clo, 0).pmv - target;
        } else {
          return comf.pmvEN(db, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv - target;
        }
      };
    }

    function solve(rhx, target) {
      var epsilon = 0.001; // ta precision
      var a = -50;
      var b = 50;
      var fn = rhclos(rhx, target);
      t = util.secant(a, b, fn, epsilon);
      return {
        db: t,
        hr: pc.getHumRatio(t, rhx),
      };
    }

    var incr = 10;
    for (var rhx = 0; rhx <= 100; rhx += incr) {
      boundary.push(solve(rhx, -pmvlimit));
    }
    while (true) {
      t += 0.5;
      boundary.push({
        db: t,
        hr: pc.getHumRatio(t, 100),
      });
      if (comf.pmvEN(t, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv > pmvlimit)
        break;
    }
    for (var rhx = 100; rhx >= 0; rhx -= incr) {
      boundary.push(solve(rhx, pmvlimit));
    }
    return boundary;
  };

  this.clearChart = function () {
    $(".comfortzoneI").remove();
    $(".comfortzoneII").remove();
    $(".comfortzoneIII").remove();
    $("circle").remove();
  };

  this.redraw_rh_lines = function () {
    enpc.clearChart();
    pc.remove_rh_lines();
    pc.draw_rh_lines();
    enbc.drawComfortRegions(d);
    var json = [
      {
        db: d.ta,
        hr: pc.getHumRatio(d.ta, d.rh),
      },
    ];
    enpc.drawComfortRegions(d);
    pc.drawPoint(json);
  };
})();
