var d = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: ''
};

var d_cache = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: ''
};
var keys = ["ta", "tr", "vel", "rh", "met", "clo"];

factor_names = {
    ta: 'air temperature',
    tr: 'mean radiant temperature',
    vel: 'air speed',
    rh: 'relative humidity',
    met: 'metabolic rate',
    clo: 'clothing level'
}


factor_units = {
    ta: '<span class="tempunit">&deg;C</span>',
    tr: '<span class="tempunit">&deg;C</span>',
    vel: '<span class="vel-unit">m/s</span>',
    rh: '%',
    met: 'met',
    clo: 'clo'
}

$(document).ready(function() {

    $(function() {
        $(".multiselect").multiselect({
            sortable: false,
            searchable: false,
            dividerLocation: 0.5
        });
    });

    $('#temphumchart-div, #output-ranges').hide();

    window.isCelsius = true;
    window.humUnit = 'rh';
    rangeYes = false;

    setDefaults();
    update();
    //pc.width = 620;
    //pc.height = 500;
    pc.drawChart(d);
    bc.drawChart(d);
});

$(function() {

    $('#link').button({}).click(function() {
        if ($('#tr-input').is(':hidden')) {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#tr-input, #tr-lab').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#tr-input, #tr-lab').hide();
        }
    });

    $('#toggle-chart').button({
        icons: {
            primary: "ui-icon-transferthick-e-w"
        },
        text: false
    });
    $('#toggle-chart').click(function() {
        $('#temphumchart-div, #temphumchart-title').toggle();
        $('#chart-div, #chart-title-pmv').toggle();
        update();
    });

    $('button').button();
    $('.buttons').buttonset();

    $('#ta, #tr').spinner({
        step: 0.1,
        min: 0,
        max: 120,
        numberFormat: "n"
    });

    $('#vel').spinner({
        step: 0.01,
        min: 0,
        max: 4,
        numberFormat: "n"
    });

    $('#clo').spinner({
        step: 0.05,
        min: 0.1,
        max: 10,
        numberFormat: "n"
    });

    $('#met').spinner({
        step: 0.05,
        min: 1,
        max: 2,
        numberFormat: "n"
    });

    $('#rh').spinner({
        step: 1,
        min: 0,
        max: 100,
        numberFormat: "n"
    });

    $('select#humidity-spec').selectmenu({
        width: 150
    });

    $('select#step-select-tr, select#step-select-vel, select#step-select-met, select#step-select-clo').selectmenu({
        width: 90
    });

    $('#slider-range-tr').click(function() {
        drawTRrange();
    })
    $("#slider-range-vel").click(function() {
        drawVELrange();
    })
    $("#slider-range-met").click(function() {
        drawMETrange();
    })
    $("#slider-range-clo").click(function() {
        drawCLOrange();
    })
    $('#slider-range-tr').focusout(function() {
        drawTRrange();
    })
    $("#slider-range-vel").focusout(function() {
        drawVELrange();
    })
    $("#slider-range-met").focusout(function() {
        drawMETrange();
    })
    $("#slider-range-clo").focusout(function() {
        drawCLOrange();
    })

    $('select#step-select-tr').change(function() {
        drawTRrange();
    })
    $('select#step-select-vel').change(function() {
        drawVELrange();
    })
    $('select#step-select-met').change(function() {
        drawMETrange();
    })
    $('select#step-select-clo').change(function() {
        drawCLOrange();
    })

    $('#tr1, #tr2').focusout(function() {
        drawTRrange();
    })
    $('#vel1, #vel2').focusout(function() {
        drawVELrange();
    })
    $('#met1, #met2').focusout(function() {
        drawMETrange();
    })
    $('#clo1, #clo2').focusout(function() {
        drawCLOrange();
    })

    $("#slider-range-tr").slider({
        range: true,
        min: 15,
        max: 35,
        values: [22, 28],
        step: 0.5,
        slide: function(event, ui) {
            $("#tr1").val(ui.values[0]).css("color", "grey");
            $("#tr2").val(ui.values[1]).css("color", "grey");
        }
    });
    $("#tr1").val($("#slider-range-tr").slider("values", 0)).css("color", "grey");
    $("#tr2").val($("#slider-range-tr").slider("values", 1)).css("color", "grey");

    $("#slider-range-vel").slider({
        range: true,
        min: 0.0,
        max: 1.2,
        values: [0.2, 0.7],
        step: 0.05,
        slide: function(event, ui) {
            $("#vel1").val(ui.values[0]).css("color", "grey");
            $("#vel2").val(ui.values[1]).css("color", "grey");
        }
    });
    $("#vel1").val($("#slider-range-vel").slider("values", 0)).css("color", "grey");
    $("#vel2").val($("#slider-range-vel").slider("values", 1)).css("color", "grey");

    $("#slider-range-met").slider({
        range: true,
        min: 1.0,
        max: 2.0,
        values: [1.0, 1.3],
        step: 0.05,
        slide: function(event, ui) {
            $("#met1").val(ui.values[0]).css("color", "grey");
            $("#met2").val(ui.values[1]).css("color", "grey");
        }
    });
    $("#met1").val($("#slider-range-met").slider("values", 0)).css("color", "grey");
    $("#met2").val($("#slider-range-met").slider("values", 1)).css("color", "grey");

    $("#slider-range-clo").slider({
        range: true,
        min: 0,
        max: 1.5,
        values: [0.5, 1.0],
        step: 0.05,
        slide: function(event, ui) {
            $("#clo1").val(ui.values[0]).css("color", "grey");
            $("#clo2").val(ui.values[1]).css("color", "grey");
        }
    });
    $("#clo1").val($("#slider-range-clo").slider("values", 0)).css("color", "grey");
    $("#clo2").val($("#slider-range-clo").slider("values", 1)).css("color", "grey");

});


$('#humidity-spec').change(function() {
    var v = $('#humidity-spec').val();
    var ta = parseFloat($('#ta').val());
    if (!isCelsius) ta = util.FtoC(ta);
    var maxVapPress = parseFloat(psy.satpress(ta));
    var maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
    var rh = parseFloat($('#rh').val());
    if (!isCelsius & (window.humUnit == 'wetbulb' | window.humUnit == 'dewpoint')) rh = util.FtoC(rh);
    if (window.humUnit == 'vappress')
        if (!isCelsius) rh *= 2953;
        else rh *= 1000;

    if (v == 'rh') {
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'rh'));
        $('#rh-unit').html(' %');
        $('#rh').spinner({
            step: 1,
            min: 0,
            max: 100,
            numberFormat: "n"
        });
    } else if (v == 'dewpoint') {
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'dewpoint'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'dewpoint')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: 0.1,
            min: 0,
            max: 100,
            numberFormat: "n"
        });
    } else if (v == 'wetbulb') {
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'wetbulb'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'wetbulb')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: 0.1,
            min: 0,
            max: 100,
            numberFormat: "n"
        });
    } else if (v == 'w') {
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'w'));
        $('#rh-unit').html('');
        $('#rh').spinner({
            step: 0.001,
            min: 0,
            max: maxHumRatio
        });
    } else if (v == 'vappress') {
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'vappress') / 1000);
            $('#rh-unit').html(' KPa');
        } else {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'vappress') / 2953);
            $('#rh-unit').html(' in HG');
        }
        $('#rh').spinner({
            step: 0.01,
            min: 0,
            max: maxVapPress / 1000.0
        });
    }
    window.humUnit = v;
});

$('.inputbox').keydown(function(event) {
    if (event.keyCode == 13) {
        var inputs = $('.inputbox:visible:enabled');
        var nextBox = inputs.index(this) + 1;
        if (nextBox == inputs.length) nextBox = 0;
        inputs[nextBox].focus();
    }
});

$('.in').click(function() {
    if (!rangeYes) {
        update();
    }
});

$('.inputbox').focusout(function() {
    if (!rangeYes) {
        update();
    }
});

$('.rangesbox').focusout(function() {
    toggleSliders();
});

$('#rh-inputcell').click(function() {
    if (rangeYes) {
        pc.redrawRHcurve();
        bc.redrawRHcurve();
    }
});
$('#rh-inputcell').focusout(function() {
    if (rangeYes) {
        pc.redrawRHcurve();
        bc.redrawRHcurve();
    }
});

$('#tr').focusout(function() {
    if (rangeYes) {
        if (rangefactor == "vel") {
            drawVELrange();
        } else if (rangefactor == "met") {
            drawMETrange();
        } else if (rangefactor == "clo") {
            drawCLOrange();
        }
    }
});
$('#vel').focusout(function() {
    if (rangeYes) {
        if (rangefactor == "tr") {
            drawTRrange();
        } else if (rangefactor == "met") {
            drawMETrange();
        } else if (rangefactor == "clo") {
            drawCLOrange();
        }
    }
});
$('#met').focusout(function() {
    if (rangeYes) {
        if (rangefactor == "vel") {
            drawVELrange();
        } else if (rangefactor == "tr") {
            drawTRrange();
        } else if (rangefactor == "clo") {
            drawCLOrange();
        }
    }
});
$('#clo').focusout(function() {
    if (rangeYes) {
        if (rangefactor == "vel") {
            drawVELrange();
        } else if (rangefactor == "met") {
            drawMETrange();
        } else if (rangefactor == "tr") {
            drawTRrange();
        }
    }
});

$('#unitsToggle').click(function() {
    toggleUnits();
    update();
});

$('#restart').click(function() {
    rangeYes = false;
    d3.selectAll("path.comfortzone-range").remove();
    d3.selectAll("path.comfortzone").remove();
    d3.selectAll("path.comfortzone-temphum-range").remove();
    d3.selectAll("path.comfortzone-temphum").remove();
    d3.selectAll("circle").remove();
    $('#output-ranges').hide();
    $('.inputfield').css('background-color', '#DCE7F7');
    $('#ta-lab, #inputfield-ta').css('visibility', 'visible');
    pc.removeRHcurve();
    bc.removeRHcurve();

    setDefaults();

    var json1 = [{
        "db": d.ta,
        "hr": pc.getHumRatio(d.ta, d.rh)
    }]
    var b1 = pc.findComfortBoundary(d, 0.5);
    pc.drawComfortRegion(b1);
    pc.drawPoint(json1);

    var json2 = [{
        "db": d.ta,
        "rh": d.rh
    }]
    var b2 = bc.findComfortBoundary(d, 0.5);
    bc.drawComfortRegion(b2);
    bc.drawPoint(json2);

    update();
});

$('#specPressure').click(function() {
    var customPressure = prompt('Enter atmospheric pressure in '.concat(isCelsius ? 'Pascals (Pa)':'inches of mercury (inHg)'));
    if (customPressure != '' && customPressure != null) {
        customPressure = parseFloat(customPressure)
        if (!isCelsius) {
            customPressure *= 3386.39;
        }
        if (!isNaN(customPressure) && customPressure >= 30000 && customPressure <= 110000) {
            psy.PROP.Patm = customPressure
            pc.redraw_rh_lines()
            update()
        } else {
            window.alert('The entered atmospheric pressure is invalid.')
        }
    }
});

function toggleUnits() {
    var v, el;
    var hs = $('#humidity-spec').val();
    isCelsius = !isCelsius;
    if (isCelsius) {
        $('.tempunit').each(function() {
            $(this).html(' &deg;C');
        });
        $('#ta, #tr, #tr1, #tr2').each(function() {
            v = util.FtoC($(this).val());
            $(this).val(v.toFixed(1));
        });
        $('#inner-range-width, #outer-range-width').each(function() {
            v = (parseFloat($(this).html())) / 1.8;
            $(this).html(v.toFixed(1));
        });

        $('#range-output1, #range-output2').each(function() {
            v = util.FtoC(parseFloat($(this).html()));
            $(this).html(v.toFixed(1));
        });

        if (rangeYes) {
            if (rangefactor == "tr") {
                $("#factor-output1, #factor-output2").each(function() {
                    v = util.FtoC(parseFloat($(this).html()));
                    $(this).html(v.toFixed(1));
                });
            }
            if (rangefactor == "vel") {
                v1 = $('#factor-output1').html();
                $('#factor-output1').html((v1 / 196.9).toFixed(2));
                v2 = $('#factor-output2').html();
                $('#factor-output2').html((v2 / 196.9).toFixed(2));
            }
        };

        $('.vel-unit').html(' m/s');
        v = $('#vel').val();
        $('#vel').val(v / 196.9).spinner({
            step: 0.01,
            min: 0,
            max: 3,
            numberFormat: 'n'
        });
        v1 = $('#vel1').val();
        $('#vel1').val((v1 / 196.9).toFixed(2));
        v2 = $('#vel2').val();
        $('#vel2').val((v2 / 196.9).toFixed(2));

        $('#step-select-vel').html("\
            <option value='0.05'>0.05 m/s</option>\
            <option value='0.1'>0.1 m/s</option>\
            <option value='0.2'>0.2 m/s</option>\
        ").selectmenu({
            width: 90
        });
        $('#step-select-tr').html("\
            <option value='0.5'>0.5 &deg;C</option>\
            <option value='1'>1.0 &deg;C</option>\
            <option value='1.5'>1.5 &deg;C</option>\
        ").selectmenu({
            width: 90
        });

        if (hs == 'dewpoint' || hs == 'wetbulb') {
            $('#rh-unit').html(' &deg;C');
            v = (util.FtoC($('#rh').val()));
            $('#rh').val(v.toFixed(1));
        } else if (hs == 'vappress') {
            $('#rh-unit').html(' KPa');
            v = $('#rh').val() * 2.953;
            $('#rh').val(v.toFixed(2));
        }
    } else {
        $('.tempunit').each(function() {
            $(this).html(' &deg;F');
        });
        $('#ta, #tr, #tr1, #tr2').each(function() {
            v = util.CtoF($(this).val());
            $(this).val(v.toFixed(0));
        });
        $('#inner-range-width, #outer-range-width').each(function() {
            v = (parseFloat($(this).html())) * 1.8;
            $(this).html(v.toFixed(1));
        });
        $('#range-output1, #range-output2').each(function() {
            v = util.CtoF(parseFloat($(this).html()));
            $(this).html(v.toFixed(1));
        });

        if (rangeYes) {
            if (rangefactor == "tr") {
                $("#factor-output1, #factor-output2").each(function() {
                    v = util.CtoF(parseFloat($(this).html()));
                    $(this).html(v.toFixed(1));
                });
            }
            if (rangefactor == "vel") {
                v1 = $('#factor-output1').html();
                $('#factor-output1').html((v1 * 196.9).toFixed(0));
                v2 = $('#factor-output2').html();
                $('#factor-output2').html((v2 * 196.9).toFixed(0));
            }
        };

        $('.vel-unit').html(' fpm');
        v = $('#vel').val();
        $('#vel').val(v * 196.9).spinner({
            step: 1,
            min: 0,
            max: 300,
            numberFormat: 'n'
        });
        v1 = $('#vel1').val();
        $('#vel1').val((v1 * 196.9).toFixed(0));
        v2 = $('#vel2').val();
        $('#vel2').val((v2 * 196.9).toFixed(0));
        $('#step-select-vel').html("\
            <option value='10'>10 fpm</option>\
            <option value='20'>20 fpm</option>\
            <option value='40'>40 fpm</option>\
        ").selectmenu({
            width: 90
        });
        $('#step-select-tr').html("\
            <option value='1.0'>1.0 &deg;F</option>\
            <option value='2.0'>2.0 &deg;F</option>\
            <option value='3.0'>3.0 &deg;F</option>\
        ").selectmenu({
            width: 90
        });

        if (hs == 'dewpoint' || hs == 'wetbulb') {
            $('#rh-unit').html(' &deg;F');
            v = (util.CtoF($('#rh').val()));
            $('#rh').val(v.toFixed(1));
        } else if (hs == 'vappress') {
            $('#rh-unit').html(' in HG');
            v = $('#rh').val() / 2.953;
            $('#rh').val(v.toFixed(2));
        }
    }
    pc.toggleUnits(isCelsius);
    bc.toggleUnits(isCelsius);
    toggleSliders();
}

function toggleSliders() {
    if (isCelsius) {
        $(function() {
            $("#slider-range-tr").slider({
                range: true,
                min: 15,
                max: 35,
                values: [(parseFloat(document.getElementById("tr1").value)), (parseFloat(document.getElementById("tr2").value))],
                step: 0.5,
                slide: function(event, ui) {
                    $("#tr1").val(ui.values[0]).css("color", "grey");
                    $("#tr2").val(ui.values[1]).css("color", "grey");
                }
            });
            $("#tr1").val($("#slider-range-tr").slider("values", 0)).css("color", "grey");
            $("#tr2").val($("#slider-range-tr").slider("values", 1)).css("color", "grey");

            $("#slider-range-vel").slider({
                range: true,
                min: 0.0,
                max: 1.2,
                values: [(parseFloat(document.getElementById("vel1").value)), (parseFloat(document.getElementById("vel2").value))],
                step: 0.05,
                slide: function(event, ui) {
                    $("#vel1").val(ui.values[0]).css("color", "grey");
                    $("#vel2").val(ui.values[1]).css("color", "grey");
                }
            });
            $("#vel1").val($("#slider-range-vel").slider("values", 0)).css("color", "grey");
            $("#vel2").val($("#slider-range-vel").slider("values", 1)).css("color", "grey");
        });
    } else {
        $(function() {
            $("#slider-range-tr").slider({
                range: true,
                min: 59,
                max: 95,
                values: [(parseFloat(document.getElementById("tr1").value)), (parseFloat(document.getElementById("tr2").value))],
                step: 1.0,
                slide: function(event, ui) {
                    $("#tr1").val(ui.values[0]).css("color", "grey");
                    $("#tr2").val(ui.values[1]).css("color", "grey");
                }
            });
            $("#tr1").val($("#slider-range-tr").slider("values", 0)).css("color", "grey");
            $("#tr2").val($("#slider-range-tr").slider("values", 1)).css("color", "grey");

            $("#slider-range-vel").slider({
                range: true,
                min: 0,
                max: 240,
                values: [(parseFloat(document.getElementById("vel1").value)), (parseFloat(document.getElementById("vel2").value))],
                step: 10,
                slide: function(event, ui) {
                    $("#vel1").val(ui.values[0]).css("color", "grey");
                    $("#vel2").val(ui.values[1]).css("color", "grey");
                }
            });
            $("#vel1").val($("#slider-range-vel").slider("values", 0)).css("color", "grey");
            $("#vel2").val($("#slider-range-vel").slider("values", 1)).css("color", "grey");
        });
    }
}

function drawRange(factor, incr) {

    rangeYes = true;
    rangefactor = factor;
    d3.selectAll("path.comfortzone").remove();
    d3.selectAll(".comfortzone-temphum").remove();
    d3.selectAll("circle").remove();
    removeRanges();
    $('.inputfield').css('background-color', '#DCE7F7');
    $('#ta-lab, #inputfield-ta').css('visibility', 'hidden');

    setFactors(factor);

    var fakeFactor_1 = factor_1 * 1000;
    var fakeFactor_2 = factor_2 * 1000;

    if (fakeFactor_1 < fakeFactor_2) {
        for (var x = fakeFactor_1; x <= fakeFactor_2; x += incr) {
            d[factor] = x / 1000;
            //console.log(x);
            var bound = pc.findComfortBoundary(d, 0.5);
            var bcBound = bc.convertBoundary(bound);
            pc.drawNewZone(d, bound, factor, x);
            bc.drawNewZone(d, bcBound, factor, x);
        }
        last_value = (x - incr) / 1000;

        var curve = pc.findRHcurve(d, 0.5, factor);
        var line = bc.findRHcurve(d, 0.5, factor);
        pc.drawRHcurve(curve);
        bc.drawRHcurve(line);

        $('#output-ranges').show();
        $('.factor-name').html(factor_names[rangefactor]);
        $('#factor-name').html(factor_names[rangefactor]);
        $("#inputfield-" + factor).css('background-color', '#CECEE3');

    } else {
        alert("insert the min and max values of the range");
    }
}

function drawTRrange() {
    if (!isCelsius) {
        var tr_incr = (parseFloat(document.getElementById("step-select-tr").value) / 1.8) * 1000;
    } else {
        var tr_incr = parseFloat(document.getElementById("step-select-tr").value) * 1000;
    }
    drawRange('tr', tr_incr);
}

function drawVELrange() {
    if (!isCelsius) {
        var vel_incr = (parseFloat(document.getElementById("step-select-vel").value) / 196.9) * 1000;
    } else {
        var vel_incr = parseFloat(document.getElementById("step-select-vel").value) * 1000;
    }
    drawRange('vel', vel_incr);
}

function drawMETrange() {
    var met_incr = parseFloat(document.getElementById("step-select-met").value) * 1000;
    drawRange('met', met_incr);
}

function drawCLOrange() {
    var clo_incr = parseFloat(document.getElementById("step-select-clo").value) * 1000;
    drawRange('clo', clo_incr);
}

function setInputs() {
    keys.forEach(function(element) {
        d_cache[element] = d[element];
        var e = document.getElementById(element).value
        e = e.replace(/,/g, '.')
        d[element] = parseFloat(e);
    });
    d.wme = 0;
}

function setFactors(factor) {
    if (!isCelsius) {
        setInputs();
        d.ta = util.FtoC(d.ta);
        d.tr = util.FtoC(d.tr);
        d.vel /= 196.9;
        if (factor == "tr") {
            factor_1 = util.FtoC(parseFloat(document.getElementById(factor + "1").value));
            factor_2 = util.FtoC(parseFloat(document.getElementById(factor + "2").value));
        } else if (factor == "vel") {
            factor_1 = (parseFloat(document.getElementById(factor + "1").value) / 196.9);
            factor_2 = (parseFloat(document.getElementById(factor + "2").value) / 196.9);
        } else if (factor == "met" || factor == "clo") {
            factor_1 = parseFloat(document.getElementById(factor + "1").value);
            factor_2 = parseFloat(document.getElementById(factor + "2").value);
        }
        if (window.humUnit == 'wetbulb' || window.humUnit == 'dewpoint') d.rh = util.FtoC(d.rh);
        else if (window.humUnit == 'vappress') d.rh *= 2953;
    } else {
        if (window.humUnit == 'vappress') d.rh *= 1000;
        factor_1 = parseFloat(document.getElementById(factor + "1").value);
        factor_2 = parseFloat(document.getElementById(factor + "2").value);
        setInputs();
    }
    d.rh = psy.convert(d.rh, d.ta, window.humUnit, 'rh');
}

function removeRanges() {
    d3.selectAll("path.comfortzone-range").remove();
    pc.removeRHcurve();
    d3.selectAll("path.comfortzone-temphum-range").remove();
    bc.removeRHcurve();
}

function update() {

    if ($('#link').is(':checked')) {
        $('#tr').val($('#ta').val());
    }

    setInputs();

    if (!isCelsius) {
        d.ta = util.FtoC(d.ta);
        d.tr = util.FtoC(d.tr);
        d.trm = util.FtoC(d.trm);
        d.vel /= 196.9;
        if (window.humUnit == 'wetbulb' || window.humUnit == 'dewpoint') d.rh = util.FtoC(d.rh);
        else if (window.humUnit == 'vappress') d.rh *= 2953;
    } else {
        if (window.humUnit == 'vappress') d.rh *= 1000;
    }
    d.rh = psy.convert(d.rh, d.ta, window.humUnit, 'rh');

    if ($('#chart-div').is(':visible')) {
        var b = pc.findComfortBoundary(d, 0.5)
        pc.redrawComfortRegion(b);
        var pointdata = [{
            "db": d.ta,
            "hr": pc.getHumRatio(d.ta, d.rh)
        }]
        pc.redrawPoint(pointdata);
    } else if ($('#temphumchart-div').is(':visible')) {
        var b = bc.findComfortBoundary(d, 0.5)
        bc.redrawComfortRegion(b);
        bc.redrawPoint();
    };
}

function setDefaults() {
    if (!isCelsius) toggleUnits();
    var hs = $('#humidity-spec').val();
    var rh = psy.convert(50, 25, 'rh', hs)
    if (hs == 'vappress') {
        rh /= 1000;
    }
    var defaults = {
        ta: 25,
        tr: 25,
        vel: 0.15,
        rh: rh.toFixed(psy.PREC[hs]),
        met: 1.2,
        clo: 0.5
    };

    keys.forEach(function(element) {
        document.getElementById(element).value = defaults[element];
    });
}
