var ac = new function() {

    var CtoF = function(x) {
        return x * 9 / 5 + 32
    }

    this.margin = 40
    this.rbmargin = 40
    this.width = 550
    this.height = 470
    this.top_min = 14
    this.top_max = 37
    this.trm_min = 10
    this.trm_max = 30

    this.top_extent = [this.top_min, this.top_max]
    this.top_scale = d3.scale.linear()
        .range([this.height - this.rbmargin, this.rbmargin])
        .domain(this.top_extent)

    this.top_extent_F = [CtoF(this.top_min), CtoF(this.top_max)]
    this.top_scale_F = d3.scale.linear()
        .range([this.height - this.rbmargin, this.rbmargin])
        .domain(this.top_extent_F)

    this.trm_extent = [this.trm_min, this.trm_max]
    this.trm_scale = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.trm_extent)

    this.trm_extent_F = [CtoF(this.trm_min), CtoF(this.trm_max)]
    this.trm_scale_F = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.trm_extent_F)

    var line = d3.svg.line()
        .x(function(d) {
        return ac.trm_scale(d.trm)
    })
        .y(function(d) {
        return ac.top_scale((d.ta + d.tr) / 2)
    })

    this.drawChart = function() {
        var top_axis = d3.svg.axis().scale(ac.top_scale).orient("left")
        var top_axis_F = d3.svg.axis().scale(ac.top_scale_F).orient("left")
        var trm_axis = d3.svg.axis().scale(ac.trm_scale)
        var trm_axis_F = d3.svg.axis().scale(ac.trm_scale_F)

		var upperIII = [{"trm": 10, "ta": 26.1, "tr": 26.1 }, {"trm": 30, "ta": 32.7, "tr": 32.7}]
        var upperII = [{"trm": 10, "ta": 25.1, "tr": 25.1 }, {"trm": 30, "ta": 31.7, "tr": 31.7}]
	    var upperI = [{"trm": 10, "ta": 24.1, "tr": 24.1 }, {"trm": 30, "ta": 30.7, "tr": 30.7}]

	    var lowerIII = [{"trm": 30, "ta": 24.7, "tr": 24.7 }, {"trm": 15, "ta": 19.75, "tr": 19.75 }, {"trm": 10, "ta": 19.75, "tr": 19.75 }]
	    var lowerII = [{"trm": 30, "ta": 25.7, "tr": 25.7 }, {"trm": 15, "ta": 20.75, "tr": 20.75 }, {"trm": 10, "ta": 20.75, "tr": 20.75 }]
        var lowerI = [{"trm": 30, "ta": 26.7, "tr": 26.7 }, {"trm": 15, "ta": 21.75, "tr": 21.75 }, {"trm": 10, "ta": 21.75, "tr": 21.75 }]

        d3.select("#chart-div-adaptive")
            .append("svg")
            .attr("class", "svg-adaptive")
            .attr("width", ac.width)
            .attr("height", ac.height)

        ac.svg = d3.select(".svg-adaptive")

        ac.svg.append("defs")
            .append("clipPath")
            .attr("id", "clipad-adaptive")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", ac.width - ac.margin - ac.rbmargin)
            .attr("height", ac.height - ac.margin - ac.rbmargin)
            .attr("transform", "translate(" + ac.margin + "," + ac.rbmargin + ")")

        ac.svg.append("path")
             .attr("d", line(upperIII)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIIIupper")

        ac.svg.append("path")
             .attr("d", line(upperII)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIIupper")

        ac.svg.append("path")
             .attr("d", line(upperI)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIupper")

        ac.svg.append("path")
             .attr("d", line(lowerIII)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIIIlower")

        ac.svg.append("path")
             .attr("d", line(lowerII)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIIlower")

        ac.svg.append("path")
             .attr("d", line(lowerI)).attr("clip-path", "url(#clipad-adaptive)")
             .attr("class", "comfbound").attr("id", "comfboundIlower")

        ac.svg.append("g")
            .attr("class", "top axis")
            .attr("id", "top-axis-C")
            .attr("transform", "translate(" + ac.margin + ",0)")
            .call(top_axis.tickSubdivide(0).tickSize(-(ac.width - 2 * ac.margin), 0).tickPadding(5))

        ac.svg.append("g")
            .attr("class", "top axis")
            .attr("id", "top-axis-F")
            .attr("opacity", "0")
            .attr("transform", "translate(" + ac.margin + ",0)")
            .call(top_axis_F.tickSubdivide(0).tickSize(-(ac.width - 2 * ac.margin), 0).tickPadding(5))

        ac.svg.append("g")
            .attr("class", "trm axis")
            .attr("id", "trm-axis-C")
            .attr("transform", "translate(0," + (ac.height - ac.rbmargin) + ")")
            .call(trm_axis.tickSubdivide(0).tickSize(-(ac.height - 2 * ac.rbmargin), 0).tickPadding(5))

        ac.svg.append("g")
            .attr("class", "trm axis")
            .attr("id", "trm-axis-F")
            .attr("opacity", "0")
            .attr("transform", "translate(0," + (ac.height - ac.rbmargin) + ")")
            .call(trm_axis_F.tickSubdivide(0).tickSize(-(ac.height - 2 * ac.rbmargin), 0).tickPadding(5))

        d3.select("#trm-axis-C")
            .append("text")
            .text("Outdoor Running Mean Temperature [°C]")
            .attr("x", (ac.width / 2) - 3 * ac.margin)
            .attr("y", ac.rbmargin / 1.3)

        d3.select("#trm-axis-F")
            .append("text")
            .text("Outdoor Running Mean Temperature [°F]")
            .attr("x", (ac.width / 2) - 3 * ac.margin)
            .attr("y", ac.rbmargin / 1.3)

        d3.select("#top-axis-C")
            .append("text")
            .text("Operative Temperature [°C]")
            .attr("transform", "translate(-73,290), rotate(-90, 43, 0)")

        d3.select("#top-axis-F")
            .append("text")
            .text("Operative Temperature [°F]")
            .attr("transform", "translate(-73,290), rotate(-90, 43, 0)")

        ac.svg.append("path")
             .attr("d", line(upperIII.concat(lowerIII)) + "Z")
             .attr("clip-path", "url(#clipad-adaptive)") 
             .attr("class", "comfortzoneIII")
             .attr("id", "comfortzoneIII")
	         .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
	         .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneIII");})

        ac.svg.append("path")
                 .attr("d", line(upperII.concat(lowerII)) + "Z")
                 .attr("clip-path", "url(#clipad-adaptive)") 
                 .attr("class", "comfortzoneII")
                 .attr("id", "comfortzoneII")
		         .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
		         .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneII");})

        ac.svg.append("path")
                 .attr("d", line(upperI.concat(lowerI)) + "Z")
                 .attr("clip-path", "url(#clipad-adaptive)") 
                 .attr("class", "comfortzoneI")
                 .attr("id", "comfortzoneI")
		         .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
		         .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneI");})

    }

    this.drawPoint = function(data) {

        ac.svg.append("circle")
            .attr("class", "outer adaptive")
            .attr("clip-path", "url(#clipad-adaptive)")
            .attr("r", 12)

        ac.svg.append("circle")
            .attr("class", "inner adaptive")
            .attr("clip-path", "url(#clipad-adaptive)")
            .attr("r", 2)

        d3.selectAll("circle.adaptive")
            .attr("cx", ac.trm_scale(data[0].trm))
            .attr("cy", ac.top_scale((data[0].ta + data[0].tr) / 2))

    }

    this.redrawPoint = function(data) {

        d3.selectAll("circle.adaptive")
            .transition()
            .attr("cx", ac.trm_scale(data[0].trm))
            .attr("cy", ac.top_scale((data[0].ta + data[0].tr) / 2))
            .attr("clip-path", "url(#clipad-adaptive)")

    }


    this.redrawBounds = function(coolingEffect) {
    
        var upperIII = [{"trm": 10, "ta": 26.1 + coolingEffect, "tr": 26.1 + coolingEffect},
                        {"trm": 30, "ta": 32.7 + coolingEffect, "tr": 32.7 + coolingEffect}]
    
        var upperII = [{"trm": 10, "ta": 25.1 + coolingEffect, "tr": 25.1 + coolingEffect },
                       {"trm": 30, "ta": 31.7 + coolingEffect, "tr": 31.7 + coolingEffect}]
    
        // var upperI = [{"trm": 10, "ta": 24.1 + coolingEffect, "tr": 24.1 + coolingEffect },
        //               {"trm": 30, "ta": 30.7 + coolingEffect, "tr": 30.7 + coolingEffect}]

        var upperI = [{"trm": 10, "ta": 24.1, "tr": 24.1},
                      {"trm": 12.73, "ta": 25, "tr": 25},
                      {"trm": 12.73, "ta": 25 + coolingEffect, "tr": 25 + coolingEffect },
			          {"trm": 30, "ta": 30.7 + coolingEffect, "tr": 30.7 + coolingEffect}]
    
		var lowerIII = [{"trm": 30, "ta": 24.7, "tr": 24.7 }, {"trm": 15, "ta": 19.75, "tr": 19.75 }, {"trm": 10, "ta": 19.75, "tr": 19.75 }]
		var lowerII = [{"trm": 30, "ta": 25.7, "tr": 25.7 }, {"trm": 15, "ta": 20.75, "tr": 20.75 }, {"trm": 10, "ta": 20.75, "tr": 20.75 }]
		var lowerI = [{"trm": 30, "ta": 26.7, "tr": 26.7 }, {"trm": 15, "ta": 21.75, "tr": 21.75 }, {"trm": 10, "ta": 21.75, "tr": 21.75 }]

        d3.select("#comfortzoneIII")
             .attr("d", line(upperIII.concat(lowerIII)) + "Z")
             .attr("clip-path", "url(#clipad-adaptive)")
	         .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
	         .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneIII");})
	
		d3.select("#comfortzoneII")
	         .attr("d", line(upperII.concat(lowerII)) + "Z")
	         .attr("clip-path", "url(#clipad-adaptive)")
		     .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
		     .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneII");})
		
		d3.select("#comfortzoneI")
	         .attr("d", line(upperI.concat(lowerI)) + "Z")
	         .attr("clip-path", "url(#clipad-adaptive)")
		     .on("mouseover", function() {d3.select(this).attr("class", "comfortzoneover");})
		     .on("mouseout", function() {d3.select(this).attr("class", "comfortzoneI");})
		
        d3.select("#comfboundIIIupper").attr("d", line(upperIII))

        d3.select("#comfboundIIupper").attr("d", line(upperII))

        d3.select("#comfboundIupper").attr("d", line(upperI))

        // d3.select("#comfboundIIIlower").attr("d", line(lowerIII))
        // 
        // d3.select("#comfboundIIlower").attr("d", line(lowerII))
        // 
        // d3.select("#comfboundIlower").attr("d", line(lowerI))

    }

    this.toggleUnits = function(isCelsius) {

        if (isCelsius) {
            d3.select("#top-axis-C").attr("opacity", "100")
            d3.select("#top-axis-F").attr("opacity", "0")
            d3.select("#trm-axis-C").attr("opacity", "100")
            d3.select("#trm-axis-F").attr("opacity", "0")
        } else {
            d3.select("#top-axis-C").attr("opacity", "0")
            d3.select("#top-axis-F").attr("opacity", "100")
            d3.select("#trm-axis-C").attr("opacity", "0")
            d3.select("#trm-axis-F").attr("opacity", "100")
        }

    }

 }
