var simPage = simPage || {};

simPage.runSimulation = function() {
    // ta, air temperature (�C)
    // tr, mean radiant temperature (�C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)
    // numSims: number of times we run the simulation
    // bins: number of bins to divide the pmv range into
    var ta = simPage.createDistOrNum('#ta-dist', '#ta-dist-arg-1','#ta-dist-arg-2');
    var tr = simPage.createDistOrNum('#tr-dist', '#tr-dist-arg-1','#tr-dist-arg-2');
    var vel = simPage.createDistOrNum('#vel-dist', '#vel-dist-arg-1','#vel-dist-arg-2');
    var rh = simPage.createDistOrNum('#rh-dist', '#rh-dist-arg-1','#rh-dist-arg-2');
    var met = simPage.createDistOrNum('#met-dist', '#met-dist-arg-1','#met-dist-arg-2');
    var clo = simPage.createDistOrNum('#clo-dist', '#clo-dist-arg-1','#clo-dist-arg-2');
    var wme = 0;
    var numSims = parseInt($('#num-sims').val());
    var bins = parseInt($('#num-bins').val());
    var result = mc.pmvMonteCarlo(ta, tr, vel, rh, met, clo, wme, numSims, bins);
    $("#sim-pmv-res").text(result.pmvAvg.toFixed(2));
    $("#sim-ppd-res").text(Math.round(result.ppdAvg));
    $("#sim-sensation").text(util.getSensation(result.pmvAvg));
    simPage.drawSimHistogram(result.pmvValues, bins);
    return result;
}

simPage.createDistOrNum = function(dist, arg1, arg2) {
    var arg1_val = parseFloat($(arg1).val(), 10);
    var arg2_val = parseFloat($(arg2).val(), 10);
    if ($(dist).val() == 'constant') {
        return arg1_val;
    } else if ($(dist).val() == 'uniform') {
        return jStat.uniform(arg1_val, arg2_val);
    } else if ($(dist).val() == 'normal') {
        return jStat.normal(arg1_val, arg2_val);
    } else {
        console.log("simPage.createDistOrNum got unkown 'dist' argument");
        return 0;
    }
}

simPage.setDistInputs = function(dist) {
    console.log('Setting defaults for: ' + dist);
    // Valid inputs are:
    // 'ta', 'tr', 'vel', 'rh', 'met', 'clo'
    dist_val = $('#' + dist + '-dist').val();
    arg1_type = '#' + dist + '-dist-arg-1-type';
    arg2 = '#' + dist + '-dist-arg-2';
    arg2_type = '#' + dist + '-dist-arg-2-type';
    arg2_unit= '#' + dist + '-dist-unit-2';
    if (dist_val == 'constant') {
        $(arg2).hide();
        $(arg2_type).hide();
        $(arg2_unit).hide();
        $(arg1_type).text('(Constant)')
    } else if (dist_val == 'uniform') {
        $(arg2).show();
        $(arg2_type).show();
        $(arg2_unit).show();
        $(arg1_type).text('(Left Bound)');
        $(arg2_type).text('(Right Bound)');
    } else if (dist_val == 'normal') {
        $(arg2).show();
        $(arg2_type).show();
        $(arg2_unit).show();
        $(arg1_type).text('(Mean)');
        $(arg2_type).text('(Std. Deviation)');
    }
}

$('#run-simulation').click(function() {
    simPage.runSimulation();
});

$("#ta-dist").change(function(){
    simPage.setDistInputs('ta');
});

$("#tr-dist").change(function(){
    simPage.setDistInputs('tr');
});

$("#vel-dist").change(function(){
    simPage.setDistInputs('vel');
});

$("#rh-dist").change(function(){
    simPage.setDistInputs('rh');
});

$("#met-dist").change(function(){
    simPage.setDistInputs('met');
});

$("#clo-dist").change(function(){
    simPage.setDistInputs('clo');
});

simPage.setSimDefaults = function() {
    var defaults = {
        'num-sims': 1000,
        'num-bins': 8,
        'ta-dist': 'constant',
        'tr-dist': 'constant',
        'vel-dist': 'constant',
        'rh-dist': 'constant',
        'met-dist': 'constant',
        'clo-dist': 'constant',
        'tr-dist': 'constant',
        'ta-dist-arg-1': 25,
        'tr-dist-arg-1': 25,
        'vel-dist-arg-1': 0.15,
        'rh-dist-arg-1': 50,
        'met-dist-arg-1': 1.2,
        'clo-dist-arg-1': 0.5,
        'ta-dist-arg-2': '0',
        'tr-dist-arg-2': '0',
        'vel-dist-arg-2': '0',
        'rh-dist-arg-2': '0',
        'met-dist-arg-2': '0',
        'clo-dist-arg-2': '0'
    };
    var pmv_args = ['ta', 'tr', 'vel', 'rh', 'met', 'clo'];
    for (var key in defaults) {
        document.getElementById(key).value = defaults[key];
    }
    for (var i = 0; i < pmv_args.length; i++) {
       simPage.setDistInputs(pmv_args[i]);
    }
    simPage.runSimulation();
}

simPage.drawSimHistogram = function(values, numBins) {
    d3.selectAll("#sim-chart-div").selectAll("svg").remove();

    var formatCount = d3.format(",.0f");

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 580 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([-4, 4])
        .range([0, width]);

    // Generate a histogram using numBins uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(numBins))
        (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sim-chart-div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (width / numBins) - 2)
        .attr("height", function(d) { return height - y(d.y); });

    svg.append("g")
        .attr("class", "sim x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "sim y axis")
        .attr("transform", "translate(" + width, + ",0)")
        .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("pmv");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("frequency");
}

$(function() {
    $('#num-sims').spinner({
        step: 1000,
        min: 0,
        max: 999999,
        numberFormat: "n"
    });

    $('#ta-dist-arg-1, #ta-dist-arg-2, #tr-dist-arg-1, #tr-dist-arg-2').spinner({
        step: 0.1,
        min: 0,
        max: 120,
        numberFormat: "n"
    });

    $('#vel-dist-arg-1, #vel-dist-arg-2').spinner({
        step: 0.01,
        min: 0,
        max: 4,
        numberFormat: "n"
    });

    $('#clo-dist-arg-1, #clo-dist-arg-2').spinner({
        step: 0.05,
        min: 0,
        max: 10,
        numberFormat: "n"
    });

    $('#met-dist-arg-1, #met-dist-arg-2').spinner({
        step: 0.05,
        min: 0,
        max: 2,
        numberFormat: "n"
    });

    $('#rh-dist-arg-1, #rh-dist-arg-2').spinner({
        step: 1,
        min: 0,
        max: 100,
        numberFormat: "n"
    });

    simPage.setSimDefaults()
});
