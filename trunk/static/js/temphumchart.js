// ----- CODE to draw the comfort zone on a chart with Dry-Bulb Temp on the x-axis and Relative Humidity on the y-axis -----

var bc = new function() {

    // set up viewport
    this.margin = 60
    this.rbmargin = 40
    this.width = 580
    this.height = 500
    this.db_min = 10
    this.db_max = 36


    this.db_extent = [this.db_min, this.db_max]
    this.db_scale = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent)


    this.db_extent_F = [util.CtoF(this.db_min), util.CtoF(this.db_max)]
    this.db_scale_F = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent_F)

    this.rh_extent = [0, 100]
    this.rh_scale = d3.scale.linear()
        .range([this.height - this.margin, this.rbmargin])
        .domain(this.rh_extent)

    // defining a poliline
    this.pline = d3.svg.line()
        .x(function(d) {
        return this.db_scale(d.db)
    })
        .y(function(d) {
        return this.rh_scale(d.rh)
    })

    this.drawChart = function() {

        var db_axis = d3.svg.axis().scale(bc.db_scale)
        var db_axis_F = d3.svg.axis().scale(bc.db_scale_F)
        var rh_axis = d3.svg.axis().scale(bc.rh_scale).orient("left")

        var line = d3.svg.line()
            .x(function(d) {
            return bc.db_scale(d.db)
        })
            .y(function(d) {
            return bc.rh_scale(d.rh)
        })
            .interpolate('cardinal')

        // drawing svg
        d3.select("#temphumchart-div")
            .append("svg")
            .attr("class", "svg-temphum").attr("id", "svg-temphum")
            .attr("width", bc.width)
            .attr("height", bc.height)

		bc.svg = d3.select(".svg-temphum")

        // ClipPath
          bc.svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip_th")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", bc.width - bc.margin - bc.rbmargin)
            .attr("height", bc.height - bc.margin - bc.rbmargin)
            .attr("transform", "translate(" + bc.margin + "," + bc.rbmargin + ")")

        // Drawing the axes
          bc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-C-temphum")
            .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
            .call(db_axis.tickSubdivide(0).tickSize(-(bc.height - bc.margin - bc.rbmargin), 0).tickPadding(5))

          bc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-F-temphum")
            .attr("opacity", "0")
            .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
            .call(db_axis_F.tickSubdivide(0).tickSize(-(bc.height - bc.margin - bc.rbmargin), 0).tickPadding(5))

          bc.svg
            .append("g")
            .attr("class", "rh axis")
            .attr("transform", "translate(" + (bc.margin) + ",0)")
            .call(rh_axis.tickSubdivide(0).tickSize(-(bc.width - bc.margin - bc.rbmargin), 0).tickPadding(5))


        // giving labels to the axes 

        d3.select("#db-axis-C-temphum")
            .append("text")
            .text("Dry-bulb Temperature [°C]")
            .attr("class", "db-unit")
            .attr("x", (bc.width / 2) - 50)
            .attr("y", bc.margin / 1.6)


        d3.select("#db-axis-F-temphum")
            .append("text")
            .text("Dry-bulb Temperature [°F]")
            .attr("class", "db-unit")
            .attr("x", (bc.width / 2) - 50)
            .attr("y", bc.margin / 1.6)


        d3.select(".rh.axis")
            .append("text")
            .attr("id", "rh-text")
            .text("Relative Humidity [%]")
            .attr("transform", "rotate (-90, -35, 0) translate(-350)");

    }


    this.drawComfortRegion = function(data) {

        d3.select(".svg-temphum")
            .append("path")
            .attr("clip-path", "url(#clip_th)")
            .attr("d", bc.pline(data) + "Z")
            .attr("class", "comfortzone-temphum").attr("id", "temphum-comfortzone")
            .on("mouseover", function() {
            d3.select(this).attr("class", "comfortzoneover");
        })
            .on("mouseout", function() {
            d3.select(this).attr("class", "comfortzone-temphum");
        });

    }

    this.redrawComfortRegion = function(data) {

        d3.select(".comfortzone-temphum")
            .transition()
            .attr("d", bc.pline(data) + "Z")
    }

    this.drawPoint = function() {

          bc.svg
            .append("circle")
            .attr("class", "outer")
			.attr("clip-path", "url(#clip_th)")
            .attr("r", 12)

          bc.svg
            .append("circle")
			.attr("clip-path", "url(#clip_th)")
            .attr("class", "inner")
            .attr("r", 2)

        d3.selectAll("circle")
            .attr("cx", bc.db_scale(d.ta))
            .attr("cy", bc.rh_scale(d.rh))

    }

    this.redrawPoint = function() {

        d3.selectAll("circle")
            .transition()
            .attr("cx", bc.db_scale(d.ta))
            .attr("cy", bc.rh_scale(d.rh))

    }

    this.getHumRatio = function(db, rh) {
        return psy.humratio(psy.PROP.Patm, rh * psy.satpress(db) / 100)
    }

    this.findComfortBoundary = function(d, pmvlimit) {
        var boundary = []

        function solve(rh, target) {
            var epsilon = 0.001
            var a = -50
            var b = 50
            var fn = function(db) {
                return (comf.pmvElevatedAirspeed(db, d.tr, d.vel, rh, d.met, d.clo, d.wme).pmv - target)
            }
            //t = util.bisect(a, b, fn, epsilon, target)
            t = util.secant(a, b, fn, epsilon)
            return {
                "db": t,
                "rh": rh
            }
        }

        for (rh = 0; rh <= 100; rh += 10) {
            boundary.push(solve(rh, -pmvlimit))
        }

        for (rh = 100; rh >= 0; rh -= 10) {
            boundary.push(solve(rh, pmvlimit))
        }

        return boundary
    }

    this.toggleUnits = function(isCelsius) {

        if (isCelsius) {
            d3.select("#db-axis-C-temphum").attr("opacity", "100")
            d3.select("#db-axis-F-temphum").attr("opacity", "0")
        } else {
            d3.select("#db-axis-C-temphum").attr("opacity", "0")
            d3.select("#db-axis-F-temphum").attr("opacity", "100")
        }

    }

}
