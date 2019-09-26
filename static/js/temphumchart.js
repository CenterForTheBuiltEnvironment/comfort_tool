// ----- CODE to draw the comfort zone on a chart with Dry-Bulb Temp on the x-axis and Relative Humidity on the y-axis -----

var bc = new function () {

    // todo issue with calculations dbt = 27.5, mrt = 10, air speed 0.5 - 2

    // set up viewport
    this.margin = 60;
    this.rbmargin = 40;
    this.width = 580;
    this.height = 500;
    this.db_min = 10;
    this.db_max = 36;

    this.db_extent = [this.db_min, this.db_max];
    this.db_scale = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent);

    this.db_extent_F = [util.CtoF(this.db_min), util.CtoF(this.db_max)];
    this.db_scale_F = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent_F);

    this.rh_extent = [0, 100];
    this.rh_scale = d3.scale.linear()
        .range([this.height - this.margin, this.rbmargin])
        .domain(this.rh_extent);

    // defining a poliline
    this.pline = d3.svg.line()
        .x(function (d) {
            return this.db_scale(d.db)
        })
        .y(function (d) {
            return this.rh_scale(d.rh)
        });

    this.drawChart = function () {

        var db_axis = d3.svg.axis().scale(bc.db_scale);
        var db_axis_F = d3.svg.axis().scale(bc.db_scale_F);
        var rh_axis = d3.svg.axis().scale(bc.rh_scale).orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return bc.db_scale(d.db)
            })
            .y(function (d) {
                return bc.rh_scale(d.rh)
            })
            .interpolate('cardinal');

        // drawing svg
        d3.select("#temphumchart-div")
            .append("svg")
            .attr("class", "svg-temphum").attr("id", "svg-temphum")
            .attr("width", bc.width)
            .attr("height", bc.height);

        bc.svg = d3.select(".svg-temphum");

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
            .attr("transform", "translate(" + bc.margin + "," + bc.rbmargin + ")");

        // draw SI x-axis and gridline
        bc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-C-temphum")
            .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
            .call(db_axis.tickSubdivide(0).tickSize(-(bc.height - bc.margin - bc.rbmargin), 0).tickPadding(5));

        // draw IP x-axis and gridline
        bc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-F-temphum")
            .attr("opacity", "0")
            .attr("transform", "translate(0," + (bc.height - bc.margin) + ")")
            .call(db_axis_F.tickSubdivide(0).tickSize(-(bc.height - bc.margin - bc.rbmargin), 0).tickPadding(5));

        // draw x-axis and gridline
        bc.svg
            .append("g")
            .attr("class", "rh axis")
            .attr("transform", "translate(" + (bc.margin) + ",0)")
            .call(rh_axis.tickSubdivide(0).tickSize(-(bc.width - bc.margin - bc.rbmargin), 0));

        // define SI x-axis label
        d3.select("#db-axis-C-temphum")
            .append("text")
            .text("Dry-bulb Temperature [°C]")
            .attr("class", "db-unit-th")
            .attr("x", (bc.width / 2) - 50)
            .attr("y", bc.margin / 1.6);

        // define IP x-axis label
        d3.select("#db-axis-F-temphum")
            .append("text")
            .text("Dry-bulb Temperature [°F]")
            .attr("class", "db-unit-th")
            .attr("x", (bc.width / 2) - 50)
            .attr("y", bc.margin / 1.6);

        // define y-axis label
        d3.select(".rh.axis")
            .append("text")
            .attr("id", "rh-text")
            .text("Relative Humidity [%]")
            .attr("transform", "rotate (-90, -35, 0) translate(-350)");

        // add all the text needed to show psychrometric information
        const y_shift = 5;
        const x_shift = 345;

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
            .append("text")
            .text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 10) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dry-bulb_temperature")
            .append("text").text("db")
            .attr("class", "box-texts")
            .attr("id", "box-db")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 5) + "," + ((bc.rbmargin + y_shift) + 10) + ")");
        document.getElementById("box-db").style.fontSize = "9px";

        bc.svg.append("text")
            .text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-th-dbt")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 10) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Relative_humidity")
            .append("text")
            .text("rh")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 30) + ")");

        bc.svg.append("text")
            .text("%")
            .attr("class", "box-texts")
            .attr("id", "unit-th-rh")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 30) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Humidity#Absolute_humidity")
            .append("text")
            .text("W")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        bc.svg.append("text")
            .text("a")
            .attr("class", "box-texts")
            .attr("id", "box-a")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 12) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        document.getElementById("box-a").style.fontSize = "9px";

        bc.svg.append("text")
            .text("g")
            .attr("class", "box-texts")
            .attr("id", "unit-th-hr1")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        bc.svg.append("text")
            .text("w")
            .attr("class", "box-texts")
            .attr("id", "unit-th-hr2")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 76) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        document.getElementById("unit-th-hr2").style.fontSize = "9px";

        bc.svg.append("text")
            .text("/kg")
            .attr("class", "box-texts")
            .attr("id", "unit-th-hr3")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 83) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        bc.svg.append("text")
            .text("da")
            .attr("class", "box-texts")
            .attr("id", "unit-th-hr4")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 105) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        document.getElementById("unit-th-hr4").style.fontSize = "9px";

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
            .append("text").text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 70) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Wet-bulb_temperature")
            .append("text").text("wb")
            .attr("class", "box-texts")
            .attr("id", "wb")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 5) + "," + ((bc.rbmargin + y_shift) + 70) + ")");

        document.getElementById("wb").style.fontSize = "9px";

        bc.svg.append("text").text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-th-wbt")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 70) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
            .append("text").text("t")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 90) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Dew_point")
            .append("text")
            .text("dp")
            .attr("class", "box-texts")
            .attr("id", "box-dp")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 5) + "," + ((bc.rbmargin + y_shift) + 90) + ")");

        document.getElementById("box-dp").style.fontSize = "9px";

        bc.svg.append("text")
            .text("°C")
            .attr("class", "box-texts")
            .attr("id", "unit-th-dew")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 90) + ")");

        bc.svg.append("svg:a")
            .attr("xlink:href", "http://en.wikipedia.org/wiki/Enthalpy")
            .append("text")
            .text("h")
            .attr("class", "box-texts")
            .attr("transform", "translate(" + (bc.margin + x_shift) + "," + ((bc.rbmargin + y_shift) + 110) + ")");

        bc.svg.append("text")
            .text("kJ/kg")
            .attr("class", "box-texts")
            .attr("id", "unit-th-ent")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 65) + "," + ((bc.rbmargin + y_shift) + 110) + ")");

        // this is for the initial values, set to 0.0
        bc.svg.append("text").text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-th-dbt")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 10) + ")");

        bc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-rh")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 30) + ")");

        bc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-hr")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 50) + ")");

        bc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-th-wbt")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 70) + ")");

        bc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-th-dew")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 90) + ")");

        bc.svg.append("text")
            .text("0.0")
            .attr("class", "box-texts")
            .attr("id", "box-th-ent")
            .attr("transform", "translate(" + ((bc.margin + x_shift) + 32) + "," + ((bc.rbmargin + y_shift) + 110) + ")");

        bc.svg.on("mousemove", bc.mousemove);
    };

    // calculate the values and draws the numbers in the box
    this.mousemove = function () {
        let mouseDBT = bc.db_scale.invert(d3.mouse(this)[0]);
        let mouseRH = bc.rh_scale.invert(d3.mouse(this)[1]);
        let mouseHR = psy.tdb_rh(mouseDBT, mouseRH).w * 1000;
        let mouseVP = (psy.PROP.Patm * mouseHR / 1000) / (0.62198 + mouseHR / 1000);
        let mouseEnt = 1.006 * mouseDBT + (mouseHR / 1000) * (2501 + 1.86 * mouseDBT);
        let mouseWBT = psy.tdb_rh(mouseDBT, mouseRH).wetbulb;
        let mouseDew = psy.tdb_rh(mouseDBT, mouseRH).dewpoint;

        if (mouseDew <= 0.01) {
            d3.selectAll("#box-th-dew").text("N/A");
        } else {
            d3.selectAll("#box-th-dew").text(mouseDew.toFixed(1));
        }
        if (mouseRH >= 100) {
            mouseRH = 100
        }
        if (!isCelsius) {
            mouseDBT = util.CtoF(mouseDBT);
            mouseDew = util.CtoF(mouseDew);
            mouseWBT = util.CtoF(mouseWBT);
            mouseEnt *= 0.43
        }
        d3.selectAll("#box-th-dbt").text(mouseDBT.toFixed(1));
        d3.selectAll("#box-rh").text(mouseRH.toFixed(1));
        d3.selectAll("#box-hr").text(mouseHR.toFixed(1));
        d3.selectAll("#box-th-wbt").text(mouseWBT.toFixed(1));

        d3.selectAll("#box-th-ent").text(mouseEnt.toFixed(1))
    };

    this.convertBox = function () {
        let dbt = parseFloat($('#box-th-dbt').text());
        let wbt = parseFloat($('#box-th-wbt').text());
        let dew = parseFloat($('#box-th-dew').text());
        let ent = parseFloat($('#box-th-ent').text());
        if (isCelsius) {
            dbt = util.FtoC(dbt);
            wbt = util.FtoC(wbt);
            dew = util.FtoC(dew);
            ent /= 0.43;
            $('#unit-th-dbt').text('°C');
            $('#unit-th-wbt').text('°C');
            $('#unit-th-dew').text('°C');
            $('#unit-th-ent').text('kJ/kg');
            $('#unit-th-hr1').text('g');
            $('#unit-th-hr3').text('/kg');

            $('#box-db-unit-th').text('°C');
            $('#box-mrt-unit-th').text('°C');
            $('#box-vel-unit-th').text('m/s')

        } else {
            dbt = util.CtoF(dbt);
            wbt = util.CtoF(wbt);
            dew = util.CtoF(dew);
            ent *= 0.43;
            $('#unit-th-dbt').text('°F');
            $('#unit-th-wbt').text('°F');
            $('#unit-th-dew').text('°F');
            $('#unit-th-ent').text('btu/lb');
            $('#unit-th-hr1').text('lb');
            $('#unit-th-hr3').text('/klb');

            $('#box-db-unit-th').text('°F');
            $('#box-mrt-unit-th').text('°F');
            $('#box-vel-unit-th').text('fpm')
        }
        $('#box-th-dbt').text(dbt.toFixed(1));
        $('#box-th-wbt').text(wbt.toFixed(1));
        $('#box-th-dew').text(dew.toFixed(1));
        $('#box-th-ent').text(ent.toFixed(1))
    };

    this.drawComfortRegion = function (data) {

        d3.select(".svg-temphum")
            .append("path")
            .attr("clip-path", "url(#clip_th)")
            .attr("d", bc.pline(data) + "Z")
            .attr("class", "comfortzone-temphum").attr("id", "temphum-comfortzone")
            .on("mouseover", function () {
                d3.select(this).attr("class", "comfortzoneover");
            })
            .on("mouseout", function () {
                d3.select(this).attr("class", "comfortzone-temphum");
            });

    };

    this.redrawComfortRegion = function (data) {

        d3.select(".comfortzone-temphum")
            .transition()
            .attr("d", bc.pline(data) + "Z")
    };

    this.drawPoint = function () {

        bc.svg
            .append("circle")
            .attr("class", "outer")
            .attr("clip-path", "url(#clip_th)")
            .attr("r", 12);

        bc.svg
            .append("circle")
            .attr("clip-path", "url(#clip_th)")
            .attr("class", "inner")
            .attr("r", 2);

        d3.selectAll("circle")
            .attr("cx", bc.db_scale(d.ta))
            .attr("cy", bc.rh_scale(d.rh))

    };

    this.redrawPoint = function () {

        d3.selectAll("circle")
            .transition()
            .attr("cx", bc.db_scale(d.ta))
            .attr("cy", bc.rh_scale(d.rh))

    };

    this.findComfortBoundary = function (d, pmvlimit) {
        var boundary = [];

        function solve(rh, target) {
            const epsilon = 0.001;
            const a = -50;
            const b = 50;
            var fn = function (db) {
                return (comf.pmvElevatedAirspeed(db, d.tr, d.vel, rh, d.met, d.clo, d.wme).pmv - target)
            };
            //t = util.bisect(a, b, fn, epsilon, target)
            t = util.secant(a, b, fn, epsilon);
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
    };

    // toggle the axis to display based on measurement system selected
    this.toggleUnits = function (isCelsius) {

        if (isCelsius) {
            d3.select("#db-axis-C-temphum").attr("opacity", "100");
            d3.select("#db-axis-F-temphum").attr("opacity", "0")
        } else {
            d3.select("#db-axis-C-temphum").attr("opacity", "0");
            d3.select("#db-axis-F-temphum").attr("opacity", "100")
        }
        this.convertBox()
    }
};
