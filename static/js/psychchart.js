var pc = new function() {

    var CtoF = function(x) {
        return x * 9 / 5 + 32
    }

    this.margin = 40
    this.rbmargin = 60
    this.width = 580
    this.height = 500
    this.db_min = 10
    this.db_max = 36

    this.init = function(){
      
      this.db_extent = [this.db_min, this.db_max]
      this.db_scale = d3.scale.linear()
          .range([this.margin, this.width - this.rbmargin])
          .domain(this.db_extent)


      this.db_extent_F = [CtoF(this.db_min), CtoF(this.db_max)]
      this.db_scale_F = d3.scale.linear()
          .range([this.margin, this.width - this.rbmargin])
          .domain(this.db_extent_F)

      this.hr_extent = [0, 30]
      this.hr_scale = d3.scale.linear()
          .range([this.height - this.rbmargin, this.rbmargin])
          .domain(this.hr_extent)
      
      this.bColorRange = d3.scale.linear().domain([-3,0]).range([d3.rgb('#4A40FF'), d3.rgb('#C2C2C2')]);
      this.rColorRange = d3.scale.linear().domain([0,3]).range([d3.rgb('#C2C2C2'), d3.rgb('#FF4040')]);

      this.pline = d3.svg.line()
          .x(function(d) {
          return this.db_scale(d.db)
      })
          .y(function(d) {
          return this.hr_scale(1000 * d.hr)
      })
    }
    this.init()

    this.drawChart = function() {
        var db_axis = d3.svg.axis().scale(pc.db_scale)
        var db_axis_F = d3.svg.axis().scale(pc.db_scale_F)
        var hr_axis = d3.svg.axis().scale(pc.hr_scale).orient("right")

        var line = d3.svg.line()
            .x(function(d) {
            return pc.db_scale(d.db)
        })
            .y(function(d) {
            return pc.hr_scale(1000 * d.hr)
        })
            .interpolate('cardinal')

        d3.select("#chart-div")
            .append("svg")
            .attr("class", "svg-psych").attr("id", "svg-psych")
            .attr("width", pc.width)
            .attr("height", pc.height)

        pc.svg = d3.select(".svg-psych")

        pc.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", pc.width - pc.margin - pc.rbmargin)
            .attr("height", pc.height - pc.margin - pc.rbmargin - 20)
            .attr("transform", "translate(" + pc.margin + "," + pc.rbmargin + ")")

        // dynamic way of drawing rh lines
        for (var i=100; i>=10; i-=10){
            RHline = []
            for (var t = pc.db_min; t <= pc.db_max; t += 0.5){
                RHline.push({"db": t, "hr": pc.getHumRatio(t, i)})
            }
            if (i==100){
                d3.select("svg").append("path")
                    .attr("d", pc.pline(RHline))
                    .attr("class", "rh100")
                    .attr("clip-path", "url(#clip)")
            } else {
                d3.select("svg").append("path")
                    .attr("d", pc.pline(RHline))
                    .attr("class", "rhline")
                    .attr("clip-path", "url(#clip)")
            } 
        }

        // basic frame of the box
        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
            .append("text")
            .text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 10) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
            .append("text").text("db")
            .attr("class", "box-texts")
            .attr("id", "box-db")
            .attr("transform", "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 10) + ")")
        document.getElementById("box-db").style.fontSize = "9px"

        pc.svg.append("text")
            .text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-dbt")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 10) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Relative_humidity")
            .append("text")
            .text("rh")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 30) + ")")

        pc.svg.append("text")
            .text("%")
            .attr("class", "box-texts")
            .attr("id", "unit-rh")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 30) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Humidity#Absolute_humidity")
            .append("text")
            .text("W")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 50) + ")")

        pc.svg.append("text")
            .text("a")
            .attr("class", "box-texts")
            .attr("id", "box-a")
            .attr("transform", "translate(" + (pc.margin + 12) + "," + (pc.rbmargin + 50) + ")")

        document.getElementById("box-a").style.fontSize = "9px"

        pc.svg.append("text")
            .text("g")
            .attr("class", "box-texts")
            .attr("id", "unit-hr1")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 50) + ")")

        pc.svg.append("text")
            .text("w")
            .attr("class", "box-texts")
            .attr("id", "unit-hr2")
            .attr("transform", "translate(" + (pc.margin + 76) + "," + (pc.rbmargin + 50) + ")")

        document.getElementById("unit-hr2").style.fontSize = "9px"

        pc.svg.append("text")
            .text("/kg")
            .attr("class", "box-texts")
            .attr("id", "unit-hr3")
            .attr("transform", "translate(" + (pc.margin + 83) + "," + (pc.rbmargin + 50) + ")")

        pc.svg.append("text")
            .text("da")
            .attr("class", "box-texts")
            .attr("id", "unit-hr4")
            .attr("transform", "translate(" + (pc.margin + 105) + "," + (pc.rbmargin + 50) + ")")

        document.getElementById("unit-hr4").style.fontSize = "9px"

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
            .append("text")
            .text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 70) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
            .append("text")
            .text("wb")
            .attr("class", "box-texts")
            .attr("id", "wb")
            .attr("transform", "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 70) + ")")

        document.getElementById("wb").style.fontSize = "9px"

        pc.svg.append("text")
            .text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-wbt")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 70) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
            .append("text")
            .text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 90) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
            .append("text")
            .text("dp")
            .attr("class", "box-texts")
            .attr("id", "box-dp")
            .attr("transform", "translate(" + (pc.margin + 5) + "," + (pc.rbmargin + 90) + ")")

        document.getElementById("box-dp").style.fontSize = "9px"

        pc.svg.append("text")
            .text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-dew")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 90) + ")")

        pc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Enthalpy")
            .append("text")
            .text("h")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 110) + ")")

        pc.svg.append("text")
            .text("kJ/kg")
            .attr("class", "box-texts")
            .attr("id", "unit-ent")
            .attr("transform", "translate(" + (pc.margin + 65) + "," + (pc.rbmargin + 110) + ")")

        // this is for the initial values, set to 0.0
        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-dbt")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 10) + ")")

        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-rh")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 30) + ")")

        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-hr")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 50) + ")")

        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-wbt")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 70) + ")")

        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-dew")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 90) + ")")

        pc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-ent")
            .attr("transform", "translate(" + (pc.margin + 32) + "," + (pc.rbmargin + 110) + ")")

        pc.svg.append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-C")
            .attr("transform", "translate(0," + (pc.height - pc.rbmargin) + ")")
            .call(db_axis)

        pc.svg.append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-F")
            .attr("opacity", "0")
            .attr("transform", "translate(0," + (pc.height - pc.rbmargin) + ")")
            .call(db_axis_F)

        pc.svg.append("g")
            .attr("class", "hr axis")
            .attr("transform", "translate(" + (pc.width - pc.rbmargin) + ",0)")
            .call(hr_axis)

        d3.select("#db-axis-C")
            .append("text")
            .text("Drybulb Temperature [°C]")
            .attr("class", "db-unit").attr("id", "db-axis-C-label")
            .attr("x", (pc.width / 2) - 1.9 * pc.margin)
            .attr("y", pc.rbmargin / 1.3)

        d3.select("#db-axis-F")
            .append("text")
            .text("Drybulb Temperature [°F]")
            .attr("class", "db-unit").attr("id", "db-axis-F-label")
            .attr("x", (pc.width / 2) - 1.9 * pc.margin)
            .attr("y", pc.rbmargin / 1.3)

        d3.select(".hr.axis")
            .append("text")
            .attr("id", "hr-text")
            .attr("transform", "rotate (-90, -43, 0) translate(-360,90)")
            .append("tspan")
            .text("Humidity Ratio [g")
            .attr("id", "hr-unit0")

        d3.select("#hr-text")
            .append("tspan")
            .text("w")
            .style("baseline-shift", "sub")

        d3.select("#hr-text")
            .append("tspan")
            .text(" / kg")
            .attr("id", "hr-unit1")

        d3.select("#hr-text")
            .append("tspan")
            .text("da")
            .style("baseline-shift", "sub")

        d3.select("#hr-text")
            .append("tspan")
            .text("]")

        // drawing the background
        var psybound = pc.findPsyBoundary();
        pc.drawPsyRegion(psybound);

    }

    // calculate the values and draws the numbers in the box 
    this.mousemove = function() {
        var mouseDBT = pc.db_scale.invert(d3.mouse(this)[0])
        var mouseHR = pc.hr_scale.invert(d3.mouse(this)[1])
        var mouseVP = (psy.PROP.Patm * mouseHR / 1000) / (0.62198 + mouseHR / 1000)
        var mouseEnt = (1.006 * mouseDBT + mouseHR * (2501 + 1.86 * mouseDBT)) / 1000
        var mouseRH = mouseVP / psy.satpress(mouseDBT) * 100
        var mouseWBT = psy.wetbulb(mouseDBT, mouseHR / 1000)
        var mouseDew = -35.957 - 1.8726 * Math.log(mouseVP) + 1.1689 * Math.pow(Math.log(mouseVP), 2)
        if (mouseVP <= 0.01) {
            mouseDew = -35.0
        }
        if (mouseRH >= 100) {
            mouseRH = 100
        }
        if (!isCelsius) {
            mouseDBT = CtoF(mouseDBT)
            mouseDew = CtoF(mouseDew)
            mouseWBT = CtoF(mouseWBT)
            mouseEnt *= 0.43
        }
        d3.select("#box-dbt").text(mouseDBT.toFixed(1))
        d3.select("#box-rh").text(mouseRH.toFixed(1))
        d3.select("#box-hr").text(mouseHR.toFixed(1))
        d3.select("#box-wbt").text(mouseWBT.toFixed(1))
        d3.select("#box-dew").text(mouseDew.toFixed(1))
        d3.select("#box-ent").text(mouseEnt.toFixed(1))
    }

    this.convertBox = function() {
        var dbt = parseFloat($('#box-dbt').text())
        var wbt = parseFloat($('#box-wbt').text())
        var dew = parseFloat($('#box-dew').text())
        var ent = parseFloat($('#box-ent').text())
        if (isCelsius) {
            dbt = FtoC(dbt)
            wbt = FtoC(wbt)
            dew = FtoC(dew)
            ent /= 0.43
            $('#unit-dbt').text('°C')
            $('#unit-wbt').text('°C')
            $('#unit-dew').text('°C')
            $('#unit-ent').text('kJ/kg')
            $('#unit-hr1').text('g')
            $('#unit-hr3').text('/kg')
        } else {
            dbt = CtoF(dbt)
            wbt = CtoF(wbt)
            dew = CtoF(dew)
            ent *= 0.43
            $('#unit-dbt').text('°F')
            $('#unit-wbt').text('°F')
            $('#unit-dew').text('°F')
            $('#unit-ent').text('btu/lb')
            $('#unit-hr1').text('lb')
            $('#unit-hr3').text('/klb')
        }
        $('#box-dbt').text(dbt.toFixed(1))
        $('#box-wbt').text(wbt.toFixed(1))
        $('#box-dew').text(dew.toFixed(1))
        $('#box-ent').text(ent.toFixed(1))
    }

    this.drawComfortRegion = function(data) {
        var el = d3.select("path.comfortzone")[0][0]

        if (el){
          d3.select("path.comfortzone")
              .attr("d", pc.pline(data) + "Z")
        } else {
          pc.svg.insert("path", "circle")
              .attr("clip-path", "url(#clip)")
              .attr("d", pc.pline(data) + "Z")
              .attr("class", "comfortzone")
              .on("mouseover", function() {
                  d3.select(this).attr("class", "comfortzoneover");
              })
              .on("mouseout", function() {
                  d3.select(this).attr("class", "comfortzone");
              })
              .on("mousemove", pc.mousemove)
        }
    }
   
    this.redrawComfortRegion = function(data) {
          d3.select("path.comfortzone")
              .transition()
              .attr("d", pc.pline(data) + "Z")
    }

    // Background 
    this.drawPsyRegion = function(data) {
        d3.select("svg").append("path")
            .attr("clip-path", "url(#clip)")
            .attr("d", pc.pline(data) + "Z")
            .attr("class", "psyregion")
            .on("mousemove", pc.mousemove)
    }

    this.drawPoint = function(data) {

        pc.svg.append("circle")
            .attr("class", "outer")
			    .attr("clip-path", "url(#clip)")
            .attr("r", 12)

        pc.svg.append("circle")
            .attr("class", "inner")
			    .attr("clip-path", "url(#clip)")
            .attr("r", 2)

        d3.selectAll("circle")
            .attr("cx", pc.db_scale(data[0].db))
            .attr("cy", pc.hr_scale(1000 * data[0].hr))

    }

    this.getColor = function(pmv) {
      if (pmv > 0){
        return pc.rColorRange(pmv)
      }else{
        return pc.bColorRange(pmv)
      }
    }

    this.clearChart = function(){
      d3.selectAll('circle')
        .remove()

      d3.selectAll('.comfortzone')
        .remove()
    }

    this.initDisplay = function(){
        pc.svg.append("text")
            .text("drybulb")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 140) + ")")

        pc.svg.append("text")
            .text("MRT")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 160) + ")")

        pc.svg.append("text")
            .text("vel")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 200) + ")")

        pc.svg.append("text")
            .text("rh")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 180) + ")")

        pc.svg.append("text")
            .text("met")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 220) + ")")

        pc.svg.append("text")
            .text("clo")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 240) + ")")

        pc.svg.append("text")
            .text("pmv")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + pc.margin + "," + (pc.rbmargin + 260) + ")")

        pc.svg.append("text")
            .attr("id", "db-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 140) + ")")

        pc.svg.append("text")
            .attr("id", "mrt-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 160) + ")")

        pc.svg.append("text")
            .attr("id", "vel-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 180) + ")")

        pc.svg.append("text")
            .attr("id", "rh-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 200) + ")")

        pc.svg.append("text")
            .attr("id", "met-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 220) + ")")

        pc.svg.append("text")
            .attr("id", "clo-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 240) + ")")

        pc.svg.append("text")
            .attr("id", "pmv-value")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (pc.margin + 80) + "," + (pc.rbmargin + 260) + ")")

    }

    this.drawPoints = function(data) {
      data.forEach(function(d){ 
        pc.svg.append("circle")
          .attr("clip-path", "url(#clip)")
          .attr("r", 3)
          .attr("fill", pc.getColor(d.pmv.pmv))
          .attr("stroke", "gray")
          .attr("stroke-width", "1")
          .attr("cx", pc.db_scale(d.ta))
          .attr("cy", pc.hr_scale(1000 * d.hr))
          .on("mouseover", function() {
            
            d3.select('#db-value').text(d.ta.toFixed(1))
            d3.select('#mrt-value').text(d.tr.toFixed(1))
            d3.select('#vel-value').text(d.vel.toFixed(2))
            d3.select('#rh-value').text(d.rh.toFixed(0))
            d3.select('#met-value').text(d.met.toFixed(1))
            d3.select('#clo-value').text(d.clo.toFixed(1))
            d3.select('#pmv-value').text(d.pmv.pmv.toFixed(1))

            d3.select(this)
              .attr("r", "6");

            var boundary = pc.findComfortBoundary(d, 0.5)
            pc.drawComfortRegion(boundary)
            d3.select('.comfortzone')
              .on('mouseover', function(){
                d3.select(this)
                  .attr('class','comfortzone')
              })
              .attr('opacity','0.4')
          })
          .on("mouseout", function() {
            d3.select(this)
              .attr("r", "3");
          })
      });
    }

    this.redrawPoint = function(data) {

        d3.selectAll("circle")
            .attr("cx", pc.db_scale(data[0].db))
            .attr("cy", pc.hr_scale(1000 * data[0].hr))

    }

    this.getHumRatio = function(db, rh) {
        return psy.humratio(psy.PROP.Patm, rh * psy.satpress(db) / 100)
    }

    this.findComfortBoundary = function(d, pmvlimit) {
        var boundary = []

        function rhclos(rhx, target) {
            return function(db) {
                if($("#chartSelect").val() == "psychtop"){
                    return comf.pmvElevatedAirspeed(db, db, d.vel, rhx, d.met, d.clo, 0).pmv - target
                } else {
                    return comf.pmvElevatedAirspeed(db, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv - target
                }
            }
        }
        function solve(rhx, target) {
            var epsilon = 0.001 // ta precision
            var a = -50
            var b = 50
            var fn = rhclos(rhx, target)
            t = util.secant(a, b, fn, epsilon)
            if (isNaN(t)) {
                t = util.bisect(a, b, fn, epsilon, 0)
            }
            return {
                "db": t,
                "hr": pc.getHumRatio(t, rhx)
            }
        }

        var incr = 10;
        for (var rhx = 0; rhx <= 100; rhx += incr) {
            boundary.push(solve(rhx, -pmvlimit))
        }
        while (true) {
            t += 0.5
            boundary.push({
                "db": t,
                "hr": pc.getHumRatio(t, 100)
            })
            if (comf.pmvElevatedAirspeed(t, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv > pmvlimit) break
        }
        for (var rhx = 100; rhx >= 0; rhx -= incr) {
            boundary.push(solve(rhx, pmvlimit))
        }
        return boundary
    }

    this.findPsyBoundary = function() {
        var psyboundary = []

        psyboundary.push({
            "db": 10,
            "hr": 0
        })
        psyboundary.push({
            "db": 10,
            "hr": pc.getHumRatio(10, 100)
        })
        t = 10
        while (true) {
            t += 0.5
            psyboundary.push({
                "db": t,
                "hr": pc.getHumRatio(t, 100)
            })
            if (pc.getHumRatio(t, 100) > 30) break
        }
        psyboundary.push({
            "db": 36,
            "hr": 30
        })
        psyboundary.push({
            "db": 36,
            "hr": 0
        })

        return psyboundary
    }


    this.toggleUnits = function(isCelsius) {

        if (isCelsius) {
            d3.select("#db-axis-C").attr("opacity", "100")
            d3.select("#db-axis-F").attr("opacity", "0")
            document.getElementById('hr-unit0').textContent = "Humidity Ratio [g"
            document.getElementById('hr-unit1').textContent = "/ kg"
        } else {
            d3.select("#db-axis-C").attr("opacity", "0")
            d3.select("#db-axis-F").attr("opacity", "100")
            document.getElementById('hr-unit0').textContent = "Humidity Ratio [lb"
            document.getElementById('hr-unit1').textContent = "/ klb"
        }
        this.convertBox()
    }

}
