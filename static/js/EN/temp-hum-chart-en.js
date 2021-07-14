// ----- CODE to draw the comfort zone on a chart with Dry-Bulb Temp on the x-axis and Relative Humidity on the y-axis -----

var enbc = new (function () {
  this.drawComfortRegions = function (d) {
    var boundI = enbc.findComfortBoundary(d, 0.2);
    var boundII = enbc.findComfortBoundary(d, 0.5);
    var boundIII = enbc.findComfortBoundary(d, 0.7);
    enbc.drawComfortRegion(boundIII, "III");
    enbc.drawComfortRegion(boundII, "II");
    enbc.drawComfortRegion(boundI, "I");
  };

  this.redrawComfortRegions = function (d) {
    var boundI = enbc.findComfortBoundary(d, 0.2);
    var boundII = enbc.findComfortBoundary(d, 0.5);
    var boundIII = enbc.findComfortBoundary(d, 0.7);
    enbc.redrawComfortRegion(boundIII, "III");
    enbc.redrawComfortRegion(boundII, "II");
    enbc.redrawComfortRegion(boundI, "I");
  };

  this.drawComfortRegion = function (data, regionclass) {
    d3.select(".svg-temphum")
      .append("path")
      .attr("clip-path", "url(#clip_th)")
      .attr("d", bc.pline(data) + "Z")
      .attr("class", "comfortzone-temphum" + regionclass)
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfortzoneover" + regionclass);
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfortzone-temphum" + regionclass);
      });
  };

  this.redrawComfortRegion = function (data, regionclass) {
    d3.select(".comfortzone-temphum" + regionclass)
      .transition()
      .attr("d", bc.pline(data) + "Z");
  };

  this.findComfortBoundary = function (d, pmvlimit) {
    var boundary = [];

    function solve(rh, target) {
      var epsilon = 0.001;
      var a = -50;
      var b = 50;
      var fn = function (db) {
        return (
          comf.pmvEN(db, d.tr, d.vel, rh, d.met, d.clo, d.wme).pmv - target
        );
      };
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
