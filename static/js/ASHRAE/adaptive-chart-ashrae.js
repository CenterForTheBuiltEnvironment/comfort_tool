//goog.require('d3')

const ac = new (function () {
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
  this.height = 470;
  this.top_min = 14;
  this.top_max = 35;
  this.trm_min = 10;
  this.trm_max = 33.5;

  this.top_extent = [this.top_min, this.top_max];
  this.top_scale = d3.scale
    .linear()
    .range([this.height - this.rbmargin, this.rbmargin])
    .domain(this.top_extent);

  this.top_extent_F = [util.CtoF(this.top_min), util.CtoF(this.top_max)];
  this.top_scale_F = d3.scale
    .linear()
    .range([this.height - this.rbmargin, this.rbmargin])
    .domain(this.top_extent_F);

  this.trm_extent = [this.trm_min, this.trm_max];
  this.trm_scale = d3.scale
    .linear()
    .range([this.margin, this.width - this.rbmargin])
    .domain(this.trm_extent);

  this.trm_extent_F = [util.CtoF(this.trm_min), util.CtoF(this.trm_max)];
  this.trm_scale_F = d3.scale
    .linear()
    .range([this.margin, this.width - this.rbmargin])
    .domain(this.trm_extent_F);

  const line = d3.svg
    .line()
    .x(function (d) {
      return ac.trm_scale(d.trm);
    })
    .y(function (d) {
      return ac.top_scale((d.ta + d.tr) / 2);
    });

  this.drawChart = function () {
    const top_axis = d3.svg.axis().scale(ac.top_scale).orient("left");
    const top_axis_F = d3.svg.axis().scale(ac.top_scale_F).orient("left");
    const trm_axis = d3.svg.axis().scale(ac.trm_scale);
    const trm_axis_F = d3.svg.axis().scale(ac.trm_scale_F);

    const upper80d = [
      {
        trm: 10,
        ta: 24.4,
        tr: 24.4,
      },
      {
        trm: 12,
        ta: 25,
        tr: 25,
      },
      {
        trm: 12,
        ta: 25,
        tr: 25,
      },
      {
        trm: 36,
        ta: 32.46,
        tr: 32.46,
      },
    ];

    const upper90d = [
      {
        trm: 10,
        ta: 23.4,
        tr: 23.4,
      },
      {
        trm: 12,
        ta: 24,
        tr: 24,
      },
      {
        trm: 12,
        ta: 24,
        tr: 24,
      },
      {
        trm: 36,
        ta: 31.46,
        tr: 31.46,
      },
    ];

    const lower80d = [
      {
        trm: 36,
        ta: 25.46,
        tr: 25.46,
      },
      {
        trm: 10,
        ta: 17.4,
        tr: 17.4,
      },
    ];
    const lower90d = [
      {
        trm: 36,
        ta: 26.46,
        tr: 26.46,
      },
      {
        trm: 10,
        ta: 18.4,
        tr: 18.4,
      },
    ];

    d3.select("#chart-div-adaptive")
      .append("svg")
      .attr("class", "svg-adaptive")
      .attr("width", ac.width)
      .attr("height", ac.height);

    ac.svg = d3.select(".svg-adaptive");

    ac.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clipad")
      .append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", ac.width - ac.margin - ac.rbmargin)
      .attr("height", ac.height - ac.margin - ac.rbmargin - 20)
      .attr("transform", "translate(" + ac.margin + "," + ac.rbmargin + ")");

    ac.svg
      .append("path")
      .attr("d", line(upper80d))
      .attr("class", "comfbound80")
      .attr("id", "comfbound80upper")
      .attr("clip-path", "url(#clipad)");

    ac.svg
      .append("path")
      .attr("d", line(upper90d))
      .attr("class", "comfbound90")
      .attr("id", "comfbound90upper")
      .attr("clip-path", "url(#clipad)");

    ac.svg
      .append("path")
      .attr("d", line(lower80d))
      .attr("class", "comfbound80")
      .attr("id", "comfbound80lower")
      .attr("clip-path", "url(#clipad)");

    ac.svg
      .append("path")
      .attr("d", line(lower90d))
      .attr("class", "comfbound90")
      .attr("id", "comfbound90lower")
      .attr("clip-path", "url(#clipad)");

    ac.svg
      .append("g")
      .attr("class", "top axis")
      .attr("id", "top-axis-C")
      .attr("transform", "translate(" + ac.margin + ",0)")
      .call(
        top_axis
          .tickSubdivide(0)
          .tickSize(-(ac.width - 2 * ac.margin), 0)
          .tickPadding(5)
      );

    ac.svg
      .append("g")
      .attr("class", "top axis")
      .attr("id", "top-axis-F")
      .attr("opacity", "0")
      .attr("transform", "translate(" + ac.margin + ",0)")
      .call(
        top_axis_F
          .tickSubdivide(0)
          .tickSize(-(ac.width - 2 * ac.margin), 0)
          .tickPadding(5)
      );

    ac.svg
      .append("g")
      .attr("class", "trm axis")
      .attr("id", "trm-axis-C")
      .attr("transform", "translate(0," + (ac.height - ac.rbmargin) + ")")
      .call(
        trm_axis
          .tickSubdivide(0)
          .tickSize(-(ac.height - 2 * ac.rbmargin), 0)
          .tickPadding(5)
      );

    ac.svg
      .append("g")
      .attr("class", "trm axis")
      .attr("id", "trm-axis-F")
      .attr("opacity", "0")
      .attr("transform", "translate(0," + (ac.height - ac.rbmargin) + ")")
      .call(
        trm_axis_F
          .tickSubdivide(0)
          .tickSize(-(ac.height - 2 * ac.rbmargin), 0)
          .tickPadding(5)
      );

    d3.select("#trm-axis-C")
      .append("text")
      .text("Prevailing Mean Outdoor Temperature [°C]")
      .attr("x", ac.width / 2 - 2 * ac.margin)
      .attr("y", ac.rbmargin / 1.3);

    d3.select("#trm-axis-F")
      .append("text")
      .text("Prevailing Mean Outdoor Temperature [°F]")
      .attr("x", ac.width / 2 - 2 * ac.margin)
      .attr("y", ac.rbmargin / 1.3);

    d3.select("#top-axis-C")
      .append("text")
      .text("Operative Temperature [°C]")
      .attr("transform", "translate(-73,290), rotate(-90, 43, 0)");

    d3.select("#top-axis-F")
      .append("text")
      .text("Operative Temperature [°F]")
      .attr("transform", "translate(-73,290), rotate(-90, 43, 0)");

    ac.svg
      .append("path")
      .attr("d", line(upper80d.concat(lower80d)) + "Z")
      .attr("clip-path", "url(#clipad)")
      .attr("class", "comfort80")
      .attr("id", "comfort80")
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfort80over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfort80");
      });

    ac.svg
      .append("path")
      .attr("d", line(upper90d.concat(lower90d)) + "Z")
      .attr("clip-path", "url(#clipad)")
      .attr("class", "comfort90")
      .attr("id", "comfort90")
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfort90over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfort90");
      });
  };

  this.drawPoint = function (data) {
    ac.svg.append("circle").attr("class", "outer adaptive").attr("r", 12);

    ac.svg.append("circle").attr("class", "inner adaptive").attr("r", 2);

    d3.selectAll("circle.adaptive")
      .attr("cx", ac.trm_scale(data[0].trm))
      .attr("cy", ac.top_scale((data[0].ta + data[0].tr) / 2));
  };

  this.redrawPoint = function (data) {
    d3.selectAll("circle.adaptive")
      .transition()
      .attr("cx", ac.trm_scale(data[0].trm))
      .attr("cy", ac.top_scale((data[0].ta + data[0].tr) / 2));
  };

  this.redrawBounds = function (coolingEffect) {
    const upper80d = [
      {
        trm: 10,
        ta: 24.4,
        tr: 24.4,
      },
      {
        trm: 12,
        ta: 25,
        tr: 25,
      },
      {
        trm: 12,
        ta: 25 + coolingEffect,
        tr: 25 + coolingEffect,
      },
      {
        trm: 36,
        ta: 32.46 + coolingEffect,
        tr: 32.46 + coolingEffect,
      },
    ];

    const upper90d = [
      {
        trm: 10,
        ta: 23.4,
        tr: 23.4,
      },
      {
        trm: 12,
        ta: 24,
        tr: 24,
      },
      {
        trm: 12,
        ta: 24 + coolingEffect,
        tr: 24 + coolingEffect,
      },
      {
        trm: 36,
        ta: 31.46 + coolingEffect,
        tr: 31.46 + coolingEffect,
      },
    ];

    const lower80d = [
      {
        trm: 36,
        ta: 25.46,
        tr: 25.46,
      },
      {
        trm: 10,
        ta: 17.4,
        tr: 17.4,
      },
    ];
    const lower90d = [
      {
        trm: 36,
        ta: 26.46,
        tr: 26.46,
      },
      {
        trm: 10,
        ta: 18.4,
        tr: 18.4,
      },
    ];

    d3.select(".comfort90")
      .attr("d", line(upper90d.concat(lower90d)) + "Z")
      .attr("clip-path", "url(#clipad)")
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfort90over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfort90");
      });

    d3.select(".comfort80")
      .attr("d", line(upper80d.concat(lower80d)) + "Z")
      .attr("clip-path", "url(#clipad)")
      .on("mouseover", function () {
        d3.select(this).attr("class", "comfort80over");
      })
      .on("mouseout", function () {
        d3.select(this).attr("class", "comfort80");
      });

    d3.select("#comfbound90upper").attr("d", line(upper90d));

    d3.select("#comfbound80upper").attr("d", line(upper80d));
  };

  this.toggleUnits = function (isCelsius) {
    if (isCelsius) {
      d3.select("#top-axis-C").attr("opacity", "100");
      d3.select("#top-axis-F").attr("opacity", "0");
      d3.select("#trm-axis-C").attr("opacity", "100");
      d3.select("#trm-axis-F").attr("opacity", "0");
    } else {
      d3.select("#top-axis-C").attr("opacity", "0");
      d3.select("#top-axis-F").attr("opacity", "100");
      d3.select("#trm-axis-C").attr("opacity", "0");
      d3.select("#trm-axis-F").attr("opacity", "100");
    }
  };
})();
