//bc.svg = d3.select("#svg-temphum");
bc.line = d3.svg.line()
    .x(function(d) {
        return bc.db_scale(d.db)
    })
    .y(function(d) {
        return bc.rh_scale(d.rh)
    })
    .interpolate('cardinal')

bc.drawNewZone = function(d, bound, factor, x) {
    bc.drawComfortRegion(bound)
    d3.select("path.comfortzone-temphum")
        .attr("class", "comfortzone-temphum-range")
        .on("mouseover", function() {
            d3.select(this).attr("class", "comfortzone-temphum-rangeover");
            pc.writeFactor(x);
        })
        .on("mouseout", function() {
            d3.select(this).attr("class", "comfortzone-temphum-range");
            pc.hideFactor();
        })
}

bc.convertBoundary = function(bound) {

    function convert(point) {

        var pointRH = psy.convert(point.hr, point.db, 'w', 'rh')

        if (pointRH <= 100) {
            return {
                "db": point.db,
                "rh": pointRH
            }
        } else {
            return {
                "db": point.db,
                "rh": 100
            }
        }
    }

    var newBound = [];

    bound.forEach(function(point) {
        newBound.push(convert(point));
    });

    return newBound;
}

bc.drawRHcurve = function(data) {
    d3.select("#svg-temphum").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("d", bc.pline(data)).attr("id", "rh-curve-temphum")
        .attr("class", "rh-curve-temphum-off")
        .on("mouseover", function() {
            bc.drawTempLines();
        })
        .on("mouseout", function() {
            bc.removeTempLines();
        })
}

bc.redrawRHcurve = function() {
    bc.removeRHcurve();
    setFactors(rangefactor);
    var curve = bc.findRHcurve(d, 0.5, rangefactor);
    bc.drawRHcurve(curve);
}

bc.findRHcurve = function(d, pmvlimit, factor) {
    var RHcurve = []

    function rhclos(rhx, target) {
        return function(db) {
            return comf.pmvElevatedAirspeed(db, d.tr, d.vel, rhx, d.met, d.clo, 0).pmv - target
        }
    }

    function solve(rhx, target) {
        var epsilon = 0.001 // ta precision
        var a = -50
        var b = 50
        var fn = rhclos(rhx, target)
        t = util.secant(a, b, fn, epsilon)
        return {
            "db": t,
            "rh": rh
        }
    }

    d[factor] = factor_1;
    var left_1 = solve(d.rh, -pmvlimit);
    var right_1 = solve(d.rh, pmvlimit);
    d[factor] = last_value;
    var left_2 = solve(d.rh, -pmvlimit);
    var right_2 = solve(d.rh, pmvlimit);

    var left_db = Math.min(left_1.db, left_2.db);
    var right_db = Math.max(right_1.db, right_2.db);
    var inner_left_db = Math.max(left_1.db, left_2.db);
    var inner_right_db = Math.min(right_1.db, right_2.db);

    temphum_left = {
        "db": left_db,
        "rh": d.rh
    }
    temphum_right = {
        "db": right_db,
        "rh": d.rh
    }

    temphum_inner_left = {
        "db": inner_left_db,
        "rh": d.rh
    }
    temphum_inner_right = {
        "db": inner_right_db,
        "rh": d.rh
    }
    temphum_inner_range = inner_right_db - inner_left_db

    RHcurve.push(temphum_left)

    RHcurve.push(temphum_right)

    return RHcurve;
}


bc.removeTempLines = function() {
    d3.select(".rh-curve-temphum").attr("class", "rh-curve-temphum-off")
    d3.selectAll(".temp-line-temphum").remove()
    d3.selectAll(".temp-label-temphum").remove()
}

bc.drawTempLines = function() {
    var left_line = [temphum_left].concat([{
        "db": temphum_left.db,
        "rh": 0
    }])
    var right_line = [temphum_right].concat([{
        "db": temphum_right.db,
        "rh": 0
    }])

    var inner_left_line = [temphum_inner_left].concat([{
        "db": temphum_inner_left.db,
        "rh": 0
    }])
    var inner_right_line = [temphum_inner_right].concat([{
        "db": temphum_inner_right.db,
        "rh": 0
    }])

    d3.select(".rh-curve-temphum-off").attr("class", "rh-curve-temphum")

    // for the outer range:
    d3.select("#svg-temphum").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("d", bc.line(left_line))
        .attr("class", "temp-line-temphum").attr("id", "left-line-temphum")
    d3.select("#svg-temphum").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("d", bc.line(right_line))
        .attr("class", "temp-line-temphum").attr("id", "right-line-temphum")
    if (isCelsius) {
        d3.select("#svg-temphum")
            .append("text").text(temphum_left.db.toFixed(1))
            .attr("class", "temp-label-temphum")
            .attr("id", "left-temp-label-temphum")
            .attr("x", bc.db_scale(temphum_left.db) - 31)
            .attr("y", bc.rh_scale(0) - 2)
            .attr("clip-path", "url(#clip)")
        d3.select("#svg-temphum")
            .append("text").text(temphum_right.db.toFixed(1))
            .attr("class", "temp-label-temphum")
            .attr("id", "right-temp-label-temphum")
            .attr("x", bc.db_scale(temphum_right.db) + 4)
            .attr("y", bc.rh_scale(0) - 2)
            .attr("clip-path", "url(#clip)")
    } else {
        d3.select("#svg-temphum")
            .append("text").text(util.CtoF(temphum_left.db).toFixed(1))
            .attr("class", "temp-label-temphum")
            .attr("id", "left-temp-label-temphum")
            .attr("x", bc.db_scale(temphum_left.db) - 31)
            .attr("y", bc.rh_scale(0) - 2)
            .attr("clip-path", "url(#clip)")
        d3.select("#svg-temphum")
            .append("text").text(util.CtoF(temphum_right.db).toFixed(1))
            .attr("class", "temp-label-temphum")
            .attr("id", "right-temp-label-temphum")
            .attr("x", bc.db_scale(temphum_right.db) + 4)
            .attr("y", bc.rh_scale(0) - 2)
            .attr("clip-path", "url(#clip)")
    }

    // for the inner range:
    if (temphum_inner_range > 0) {
        d3.select("#svg-temphum").append("path")
            .attr("clip-path", "url(#clip)")
            .attr("d", bc.line(inner_left_line))
            .attr("class", "temp-line-temphum").attr("id", "inner_left-line-temphum")
        d3.select("#svg-temphum").append("path")
            .attr("d", bc.line(inner_right_line))
            .attr("class", "temp-line-temphum").attr("id", "inner_right-line-temphum")
        if (isCelsius) {
            d3.select("#svg-temphum")
                .append("text").text(temphum_inner_left.db.toFixed(1))
                .attr("class", "temp-label-temphum")
                .attr("id", "temphum_left-temp-label")
                .attr("x", bc.db_scale(temphum_inner_left.db) - 31)
                .attr("y", bc.rh_scale(0) - 2)
            d3.select("#svg-temphum")
                .append("text").text(temphum_inner_right.db.toFixed(1))
                .attr("class", "temp-label-temphum")
                .attr("id", "temphum_inner_right-temp-label")
                .attr("x", bc.db_scale(temphum_inner_right.db) + 4)
                .attr("y", bc.rh_scale(0) - 2)
        } else {
            d3.select("#svg-temphum")
                .append("text").text(util.CtoF(temphum_inner_left.db).toFixed(1))
                .attr("class", "temp-label-temphum")
                .attr("id", "temphum_left-temp-label")
                .attr("x", bc.db_scale(temphum_inner_left.db) - 31)
                .attr("y", bc.rh_scale(0) - 2)
            d3.select("#svg-temphum")
                .append("text").text(util.CtoF(temphum_inner_right.db).toFixed(1))
                .attr("class", "temp-label-temphum")
                .attr("id", "temphum_inner_right-temp-label")
                .attr("x", bc.db_scale(temphum_inner_right.db) + 4)
                .attr("y", bc.rh_scale(0) - 2)
        }
    }
}

bc.removeRHcurve = function() {
    d3.select("#rh-curve-temphum").remove()
    d3.selectAll(".temp-line-temphum").remove()
    d3.selectAll(".temp-label-temphum").remove()
}
