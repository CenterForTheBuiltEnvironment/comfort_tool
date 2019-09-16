$(document).ready(function () {

    // highlight navigation bar button
    $('a.active').removeClass('active');
    $('#nav_a_ashrae').addClass('active');

    var cloSelect = document.getElementById('cloSelect');
    cloSelect.onchange = function () {
        document.getElementById('clo').value = cloSelect.value;
        update();
    };

    cloInsulationTypicalEnsambles.forEach(function (element) {
        cloSelect.options.add(new Option(element.clothing, element.clo));
    });

    var cloMultiSelect = document.getElementById('cloMultiSelect');
    cloInsulationGarments.forEach(function (element) {
        cloMultiSelect.options.add(new Option(element.article, element.clo));
    });

    var actSelect = document.getElementById('actSelect');
    actSelect.onchange = function () {
        document.getElementById('met').value = actSelect.value;
        update();
    };

    metRatesTypicalTasksASHRAE.forEach(function (element) {
        actSelect.options.add(new Option(element.activity, element.met));
    });

    var velaSelect = document.getElementById('vel_a');

    velaSelect.onchange = function () {
        update();
        var coolingEffect;
        if (d.vel_a === 0.3) {
            coolingEffect = 0
        } else if (d.vel_a === 0.6) {
            coolingEffect = 1.2
        } else if (d.vel_a === 0.9) {
            coolingEffect = 1.8
        } else if (d.vel_a === 1.2) {
            coolingEffect = 2.2
        }
        ac.redrawBounds(coolingEffect)
    };

    $(function () {
        $(".multiselect").multiselect({
            sortable: false,
            searchable: false,
            dividerLocation: 0.5
        });
    });
    $('#adaptive-inputs, #adaptive-note, #psychtop-note, #temphum-note, #chart-div-adaptive, #temphumchart-div, #veltop-note, #veltopchart-div').hide();
    window.isCelsius = true;
    window.humUnit = 'rh';
    setDefaults();
    update();
    bc.drawChart();
    let bound;
    bound = bc.findComfortBoundary(d, 0.5);
    bc.drawComfortRegion(bound);
    bc.drawPoint();
    vc.drawChart();
    bound = vc.findComfortBoundary(d, 0.5);
    vc.drawComfortRegion(bound);
    vc.drawPoint();
    pc.drawChart();
    var json = [{
        "db": d.ta,
        "hr": pc.getHumRatio(d.ta, d.rh)
    }];
    var b = pc.findComfortBoundary(d, 0.5);
    pc.drawComfortRegion(b);
    pc.drawPoint(json);
    ac.drawChart();
    ac.drawPoint([d]);

    $('#link').button({}).click(function () {
        if ($('#tr-input').is(':hidden')) {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#globeTemp').removeAttr('disabled');
            $('#globeTmpLabel').removeClass('text-muted');
            $('#tr-input, #tr-lab').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
        $('#globeTmpLabel').addClass('text-muted');
        $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab').hide();
        }
    });

    $('#chartSelect').val('psychtop');
    $('#chartSelect').change();
});

$(function () {

    $('#globedialog').dialog({
        autoOpen: false,
        height: 350,
        width: 400,
        modal: true,
        resizable: false,
        buttons: {
            "Set mean radiant temperature": function () {
                var tr = parseFloat($('#mrt-result').val());
                $('#tr').val(tr);
                $(this).dialog("close");
                update();
            }
        }
    });

    $('#ERFdialog').dialog({
        autoOpen: false,
        height: 480,
        width: 600,
        modal: true,
        resizable: true,
        buttons: {
            "Calculate": function () {
                var alt = parseFloat($('#alt').val());
                var az = parseFloat($('#az').val());
                var posture = $('#posture').val();
                var Idir = parseFloat($('#Idir').val());
                var tsol = parseFloat($('#tsol').val());
                var fsvv = parseFloat($('#fsvv').val());
                var fbes = parseFloat($('#fbes').val());
                var asa = parseFloat($('#asa').val());

                var r = ERF(alt, az, posture, Idir, tsol, fsvv, fbes, asa);
                $('#erf-result').val(r.ERF.toFixed(1));
                if (!isCelsius) r.dMRT = util.CtoF(r.dMRT) - 32;
                $('#dmrt-result').val(r.dMRT.toFixed(1))
            },
            "Adjust MRT": function () {
                var dmrt = parseFloat($('#dmrt-result').val());
                if (!isNaN(dmrt)) {
                    var mrt = parseFloat($('#tr').val());
                    $('#tr').val((mrt + dmrt).toFixed(1));
                    $(this).dialog("close");
                    update();
                }
            },
            "Help": function () {
                window.location.href = "http://escholarship.org/uc/item/89m1h2dg";
            },
            "Close": function () {
                $(this).dialog("close");
            }
        }
    });

    $('#localdialog').dialog({
        autoOpen: false,
        height: 900,
        width: 500,
        modal: true,
        resizable: false,
    });

    // $('#LEEDdialog').dialog({
    //     autoOpen: false,
    //     height: 700,
    //     width: 500,
    //     modal: true,
    //     resizable: true,
    // });

    $('#radio').buttonset();
    // $('.leed-buttons').buttonset();

    $('#customClo').button({
    }).click(function () {
        $('#customCloToggle').toggle('fast');
        // if ($('#leedInterface').is(':checked')) {
        //     $('#leedInterfaceToggle').toggle('fast');
        //     $('#leedInterface').removeAttr('checked');
        //     $('#leedInterface').button('refresh');
        //     $('#unitsToggle').removeAttr('disabled');
        // }
    });

    $('#dynamicClo').button({
    }).click(function () {
        $('#dynamicCloToggle').toggle('fast');
    });

    // $('#leedInterface').button({
    //     icons: {
    //         primary: 'ui-icon-document'
    //     }
    // }).click(function () {
    //     $('#leedInterfaceToggle').toggle('fast');
    //     if (isCelsius) {
    //         toggleUnits();
    //         update();
    //     }
    //     if ($('#leedInterface').is(':checked')) {
    //         $('#unitsToggle').attr('disabled', 'disabled');
    //     } else {
    //         $('#unitsToggle').removeAttr('disabled');
    //     }
    //     if ($('#customClo').is(':checked')) {
    //         $('#customCloToggle').toggle('fast');
    //         $('#customClo').removeAttr('checked');
    //         $('#customClo').button('refresh');
    //     }
    // });

    // $('#leed-winter').click(function () {
    //     var spaceType = $('#leed-spacetype').val();
    //     var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating";
    //     setDataSeason(spaceType, ctype, "winter")
    // });
    // $('#leed-spring').click(function () {
    //     var spaceType = $('#leed-spacetype').val();
    //     var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating";
    //     setDataSeason(spaceType, ctype, "spring")
    // });
    // $('#leed-summer').click(function () {
    //     var spaceType = $('#leed-spacetype').val();
    //     var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating";
    //     setDataSeason(spaceType, ctype, "summer")
    // });
    // $('#leed-fall').click(function () {
    //     var spaceType = $('#leed-spacetype').val();
    //     var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating";
    //     setDataSeason(spaceType, ctype, "fall")
    // });
    //
    // $('#leed-submit').button().click(function () {
    //     var xmlhttp = new XMLHttpRequest();
    //     var url = util.STATIC_URL + "/html/leed.html";
    //     xmlhttp.open("GET", url);
    //     xmlhttp.send();
    //     xmlhttp.onload = function () {
    //         leed_html = xmlhttp.responseText;
    //         doc = createDocument(leed_html);
    //         openwindow = openDocument(doc);
    //         generateTables(openwindow);
    //         $(openwindow.document.getElementsByClassName("box-texts")).remove();
    //     }
    // });

    $('button').button();
    $('.buttons').buttonset();

    // create spinners and impose limits based on value defined in envValLimits
    $('#ta').spinner({
        step: envVarLimits.ta.si.step,
        min: envVarLimits.ta.si.min,
        max: envVarLimits.ta.si.max,
        numberFormat: "n"
    });

    $('#tr').spinner({
        step: envVarLimits.tr.si.step,
        min: envVarLimits.tr.si.min,
        max: envVarLimits.tr.si.max,
        numberFormat: "n"
    });

    $('#trm').spinner({
        step: envVarLimits.trm.si.step,
        min: envVarLimits.trm.si.min,
        max: envVarLimits.trm.si.max,
        numberFormat: "n"
    });

    $('#vel').spinner({
        step: envVarLimits.vel.si.step,
        min: envVarLimits.vel.si.min,
        max: envVarLimits.vel.si.max,
        numberFormat: "n"
    });

    $('#clo').spinner({
        step: envVarLimits.clo.step,
        min: envVarLimits.clo.min,
        max: envVarLimits.clo.max,
        numberFormat: "n"
    });

    $('#met').spinner({
        step: envVarLimits.met.step,
        min: envVarLimits.met.min,
        max: envVarLimits.met.max,
        numberFormat: "n"
    });

    $('#rh').spinner({
        step: envVarLimits.rh.step,
        min: envVarLimits.rh.min,
        max: envVarLimits.rh.max,
        numberFormat: "n"
    });

});

$('#humidity-spec').change(function () {
    var v = $('#humidity-spec').val();
    var ta = parseFloat($('#ta').val());
    if (!isCelsius) ta = util.FtoC(ta);
    const maxVapPress = parseFloat(psy.satpress(ta));
    const maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
    var rh = parseFloat($('#rh').val());
    if (!isCelsius && (window.humUnit === 'wetbulb' || window.humUnit === 'dewpoint')) rh = util.FtoC(rh);
    if (window.humUnit === 'vappress') if (!isCelsius) rh *= 2953;
    else rh *= 1000;

    if (v === 'rh') {
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'rh'));
        $('#rh-unit').html(' %');
        $('#rh-description').html('Relative humidity');
        $('#rh').spinner({
            step: envVarLimits.rh.step,
            min: envVarLimits.rh.min,
            max: envVarLimits.rh.max,
            numberFormat: "n"
        });
    } else if (v === 'dewpoint') {
        $('#rh-description').html('Dew point temperature');
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'dewpoint'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'dewpoint')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: envVarLimits.tdp.si.step,
            min: envVarLimits.tdp.si.min,
            max: envVarLimits.tdp.si.max,
            numberFormat: "n"
        });
    } else if (v === 'wetbulb') {
        $('#rh-description').html('Wet bulb temperature');
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'wetbulb'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'wetbulb')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: envVarLimits.twb.si.step,
            min: envVarLimits.twb.si.min,
            max: envVarLimits.twb.si.max,
            numberFormat: "n"
        });
    } else if (v === 'w') {
        $('#rh-description').html('Humidity ratio');
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'w'));
        $('#rh-unit').html('');
        $('#rh').spinner({
            step: 0.001,
            min: 0,
            max: maxHumRatio
        });
    } else if (v === 'vappress') {
        $('#rh-description').html('Vapor pressure');
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

$('#link').click(function () {
    $('#tr').val($('#ta').val());
});

$('.inputbox').keydown(function (event) {
    if (event.keyCode === 13) {
        var inputs = $('.inputbox:visible:enabled');
        var nextBox = inputs.index(this) + 1;
        if (nextBox === inputs.length) nextBox = 0;
        inputs[nextBox].focus();
    }
});

$('.in').click(function () {
    update();
});

$('.inputbox').focusout(function () {
    update();
});

$('#unitsToggle').click(function () {
    toggleUnits();
    update();
});

$('#setDefaults').click(function () {
    setDefaults();
    update();
});

$('#specPressure').click(function () {
    var customPressure = prompt('Enter atmospheric pressure in '.concat(isCelsius ? 'Pascals (Pa)' : 'inches of mercury (inHg)'));
    if (customPressure !== '' && customPressure != null) {
        customPressure = parseFloat(customPressure);
        if (!isCelsius) {
            customPressure *= 3386.39;
        }
        if (!isNaN(customPressure) && customPressure >= 60000 && customPressure <= 108000) {
            psy.PROP.Patm = customPressure;
            pc.redraw_rh_lines();
            update();
        } else {
            window.alert('The entered atmospheric pressure is invalid. It must be in the range of 60,000 to 108,000 pascals.')
        }
    }
});

$('#globeTemp').click(function () {
    var container = $('#globedialog');
    $.ajax({
        url: util.STATIC_URL + '/html/globetemp.html',
        success: function (data) {
            $('#globedialog').html(data);
            if (!isCelsius) {
                $('#ta-g').val('77');
                $('#vel-g').val('20');
                $('#tglobe').val('77');
                $('#diameter').val('6');
                $('#g-ta-unit').html(' &deg;F');
                $('#g-vel-unit').html(' fpm');
                $('#g-tglobe-unit').html(' &deg;F');
                $('#g-globediam-unit').html(' in');
                $('#g-mrt-unit').html(' &deg;F')
            }
        },
        async: false
    });
    container.dialog("open");
    updateGlobe();
    $('.input-dialog').focusout(function () {
        updateGlobe();
    });
});

$('#ERF').click(function () {
    var container = $('#ERFdialog');
    $.ajax({
        url: util.STATIC_URL + '/html/erf.html',
        success: function (data) {
            $('#ERFdialog').html(data);
            $('#posture').selectmenu({
                width: 90
            });
        },
        async: false
    });
    if (!isCelsius) {
        $('#dmrt-unit').html('&deg;F')
    }
    container.dialog("open");
});

$('#localDisc').click(function () {
    var container = $('#localdialog');
    $.ajax({
        url: util.STATIC_URL + '/html/localdiscASH55.html',
        success: function (data) {
            $('#localdialog').html(data);
            if (!isCelsius) {
                $('.tempunit').html(' &deg;F');
                $('.velunit').html(' fpm');
                $('#T_head').val('77');
                $('#T_ankle').val('77');
                $('#T_floor').val('77');
                $('#T_op').val('77');
                $('#local_Ta').val('77');
                $('#local_Tr').val('77');
                $('#local_ank_vel').val('20');
                $('#local_vel_1').val('20');
                $('#local_vel').val('20')
            }
        },
        async: false
    });
    container.dialog("open");
    $('.input-dialog-local').focusout(function () {
        updateLocalDisc();
    });
});

// $('#LEED-help').click(function () {
//     var container = $('#LEEDdialog');
//     $.ajax({
//         url: util.STATIC_URL + 'html/leed-help.html',
//         success: function (data) {
//             $('#LEEDdialog').html(data);
//         },
//         async: false
//     });
//     container.dialog("open");
// });

$('#setClo').click(function () {
    setClo();
    update();
});
$('#addToEnsembles').click(function () {
    addToEnsembles();
});
$('#setDynamicClo').click(function () {
    var ta6 = $('#taOut6').val();
    var clo_r = comf.schiavonClo(ta6);
    $('#clo').val(clo_r.toFixed(2));
    update();
});

$('#model-type').change(function () {
    $('#pmv-out-label').html('PMV');
    $('#localDisc').removeAttr('disabled');
    const model = $('#model-type').val();
    if (model === 'pmvElevatedAirspeed') {
        $('#pmv-inputs, #pmv-outputs, #cloInput, #actInput, #humidity-spec-cont, #chart-div, #chartSelect-cont, #pmv-notes, #veltopchart-div, #pmv-elev-outputs, #local-control, #local-control-div').show();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive, #temphumchart-div, #temphumchart-title, #veltopchart-div').hide();
        $('#pmv-out-label').html('PMV Adjusted');
    }
    else if (model === 'adaptiveComfort') {
        $("#chartWrapper, #chart_heatLoss_div").hide();
        $('#pmv-inputs, #pmv-elev-inputs, #local-control, #local-control-div, #pmv-outputs, #pmv-elev-outputs, #cloInput').hide();
        $('#actInput, #humidity-spec-cont, #chart-div, #temphumchart-div, #pmv-notes, #chartSelect-cont, #veltopchart-div').hide();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive').show();
        $('#localDisc').attr('disabled', 'disabled');
    }
    update();
});

$("#chartSelect").change(function () {
    chart = $("#chartSelect").val();
    $('#output-b, #output-a, #ta-input, #ta-lab').show();
    $('#pmv-notes').show();
    if (chart === "psychta" || chart === "psychtop") {
        $("#chart-div").show();
        $("#temphumchart-div, veltopchart-div").hide();
        if (chart === "psychta") {
            $("#psychta-note").show();
            $("#chartWrapper, #psychtop-note, #temphum-note, #veltop-note, #veltopchart-div, #chart_heatLoss_div").hide();

            $("#db-axis-C-label").text("Drybulb Temperature [°C]");
            $("#db-axis-F-label").text("Drybulb Temperature [°F]");

            if ($('#link').is(':checked')) {
                $('#labelforlink').show();
            } else {
                $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
                $('#globeTemp').removeAttr('disabled');
                $('#globeTmpLabel').removeClass('text-muted');
                $('#tr-input, #tr-lab, #labelforlink').show();
            }

        } else if (chart === "psychtop") {
            $("#psychtop-note").show();
            $("#chartWrapper, #psychta-note, #temphum-note, #veltop-note, #veltopchart-div, #chart_heatLoss_div").hide();

            $("#db-axis-C-label").text("Operative Temperature [°C]");
            $("#db-axis-F-label").text("Operative Temperature [°F]");

            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#globeTmpLabel').addClass('text-muted');
            $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab, #labelforlink').hide();
        }
    } else if (chart === "temphum") {
        $("#temphumchart-div, #temphum-note").show();
        $("#chartWrapper, #chart-div, #psychta-note, #psychtop-note, #veltop-note, #veltopchart-div, #chart_heatLoss_div").hide();
        if ($('#link').is(':checked')) {
            $('#labelforlink').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#globeTemp').removeAttr('disabled');
            $('#globeTmpLabel').removeClass('text-muted');
            $('#tr-input, #tr-lab, #labelforlink').show();
        }
    } else if (chart === "veltop") {
        $("#veltopchart-div, #veltop-note").show();
        $("#chartWrapper, #chart-div, #psychta-note, #psychtop-note, #temphum-note, #temphumchart-div, #chart_heatLoss_div").hide();
        $('#link').is(':checked');
        $('#labelforlink').show();
        $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
        $('#globeTmpLabel').addClass('text-muted');
        $('#globeTemp').attr('disabled', 'disabled');
        $('#tr-input, #tr-lab, #labelforlink').hide();
    } else if (chart === "heatloss") {
        heatLoss_chart.draw(d);
        $("#chartWrapper, #chart_heatLoss_div").show();
        $("#chart-div, #temphumchart-div, #veltopchart-div, #pmv-notes, #adaptive-note").hide();
        $('#link').is(':checked');
        $('#tr-input, #tr-lab').show();
        $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
        $('#globeTemp').removeAttr('disabled')
        $('#globeTmpLabel').removeClass('text-muted');
        $('#labelforlink, #ta-input, #ta-lab, #output-b, #output-a').hide();
    }
    update();
});

function update() {

    let r;

    if ($('#link').is(':checked') || $("#chartSelect").val() == "psychtop" || $("#chartSelect").val() == "veltop") {
        $('#tr').val($('#ta').val());
    }

    // get user input and validate that complies with standard applicability limits
    validateUserEntry('');

    d.wme = 0;
    if (!isCelsius) {
        d.ta = util.FtoC(d.ta);
        d.tr = util.FtoC(d.tr);
        d.trm = util.FtoC(d.trm);
        d.vel /= 196.9;
        if (window.humUnit === 'wetbulb' || window.humUnit === 'dewpoint') d.rh = util.FtoC(d.rh);
        else if (window.humUnit === 'vappress') d.rh *= 2953;
    } else {
        if (window.humUnit === 'vappress') d.rh *= 1000;
    }
    d.rh = psy.convert(d.rh, d.ta, window.humUnit, 'rh');
    model = document.getElementById('model-type').value;
    if (model === 'pmvElevatedAirspeed') {
        r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
        if (!isCelsius) {
            r.set = util.CtoF(r.set)
        }
        if (isNaN(r.pmv)){
            window.alert('The combination of input parameters you selected lead to an incorrect calculation of the PMV index\n' +
                'Please check that the value you entered are correct.\n' +
                'The input parameters has been set back to their default values.');
            setDefaults();
        }
        renderPmvElevResults(r);
        calcPmvElevCompliance(d, r);
        let b;
        if ($('#chart-div').is(':visible')) {
            b = pc.findComfortBoundary(d, 0.5);
            pc.redrawComfortRegion(b);
            var pointdata = [{
                "db": d.ta,
                "hr": pc.getHumRatio(d.ta, d.rh)
            }];
            pc.redrawPoint(pointdata);
        } else if ($('#temphumchart-div').is(':visible')) {
            b = bc.findComfortBoundary(d, 0.5);
            bc.redrawComfortRegion(b);
            bc.redrawPoint();
        } else if ($('#veltopchart-div').is(':visible')) {
            b = vc.findComfortBoundary(d, 0.5);
            vc.redrawComfortRegion(b);
            vc.redrawPoint();
        } else if ($('#chart_heatLoss_div').is(':visible')) {
            heatLoss_chart.update();
        }
    } else if (model === 'adaptiveComfort') {
        r = comf.adaptiveComfortASH55(d.ta, d.tr, d.trm, d.vel_a);
        renderAdaptiveResults(r);
        calcAdaptiveCompliance(d, r);
        ac.redrawPoint([d])
    }
}

function renderPmvResults(r) {
    $('#pmv-res').html(r.pmv.toFixed(2));
    $('#ppd-res').html(r.ppd.toFixed(0));
    var sensation = util.getSensation(r.pmv);
    $('#sensation').html(sensation);
    $('#SET').html(r.set.toFixed(1));
}

function renderPmvElevResults(r) {
    renderPmvResults(r);
    if (!isCelsius) {
        r.ta_adj = util.CtoF(r.ta_adj);
        r.cooling_effect = util.CtoF(r.cooling_effect) - 32;
    }
    $('#ta-still').html(r.ta_adj.toFixed(1));
    $('#cooling-effect').html(r.cooling_effect.toFixed(1));
}

function renderAdaptiveResults(r) {
    var to = (parseFloat($('#ta').val()) + parseFloat($('#tr').val())) / 2;
    if (!isCelsius) {
        r.tComf90Upper = util.CtoF(r.tComf90Upper);
        r.tComf90Lower = util.CtoF(r.tComf90Lower);
        r.tComf80Upper = util.CtoF(r.tComf80Upper);
        r.tComf80Lower = util.CtoF(r.tComf80Lower);
    }
    $('#limits80').html('Operative temperature: ' + r.tComf80Lower.toFixed(1) + ' to ' + r.tComf80Upper.toFixed(1));
    $('#limits90').html('Operative temperature: ' + r.tComf90Lower.toFixed(1) + ' to ' + r.tComf90Upper.toFixed(1));
    if (r.acceptability90) {
        $('#sensation80, #sensation90').html('Comfortable');
    } else if (r.acceptability80) {
        $('#sensation80').html('Comfortable');
        if (to < r.tComf90Lower) {
            $('#sensation90').html('<span style="color:blue;">Too cool</span>');
            ;
        } else {
            $('#sensation90').html('<span style="color:red;">Too warm</span>');
        }
    } else if (to < r.tComf80Lower) {
        $('#sensation80, #sensation90').html('<span style="color:blue;">Too cool</span>');
        ;
    } else {
        $('#sensation80, #sensation90').html('<span style="color:red;">Too warm</span>');
    }
}

function calcPmvElevCompliance(d, r) {
    const pmv_comply = (Math.abs(r.pmv) <= 0.5);
    const met_comply = d.met <= 2 && d.met >= 1;
    const clo_comply = d.clo <= 1.5;
    const local_control = $('#local-control').val();
    let special_msg = '';
    let comply = true;

    if (!met_comply) {
        comply = false;
        special_msg += 'Metabolic rates below 1.0 or above 2.0 are not covered by this Standard<br>';
    }
    if (!clo_comply) {
        comply = false;
        special_msg += 'Clo values above 1.5 are not covered by this Standard<br>';
    }
    if (!pmv_comply) {
        comply = false;
    }

    if (d.vel > envVarLimits.vel.si.elevated_air_speed) {
        $("#pmv-out-label").html('PMV with elevated air speed');
        $("#ppd-out-label").html('PPD with elevated air speed');
        $("#pmv-elev-outputs").show();
    } else {
        $("#pmv-out-label").html('PMV');
        $("#ppd-out-label").html('PPD');
        $("#pmv-elev-outputs").hide();
    }

    if (local_control === 'noairspeedcontrol') {
        var max_airspeed;
        var to = (d.ta + d.tr) / 2;
        if (to > 25.5) {
            max_airspeed = 0.8;
        } else if (to < 23.0) {
            max_airspeed = 0.2
        } else {
            max_airspeed = 50.49 - 4.4047 * to + 0.096425 * to * to;
            if (max_airspeed < 0.2) max_airspeed = 0.2;
            if (max_airspeed > 0.8) max_airspeed = 0.8;
        }
        if (d.vel > max_airspeed) {
            comply = false;
            // language=HTML
            special_msg += '<hr> <p class="mb-0">Maximum air speed has been limited due to no occupant control</p>';
        }
    }
    renderCompliance(comply, special_msg);
}

function calcAdaptiveCompliance(d, r) {
    var comply = true;
    var special_msg = '';
    var to = (d.ta + d.tr) / 2;

    if (d.trm > 33.5 || d.trm < 10) {
        comply = false;
        special_msg += '&#8627; Prevailing mean outdoor temperatures above '
            + (isCelsius ? '33.5&deg;C ' : '92.3&deg;F ')
            + 'or below ' + (isCelsius ? '10&deg;C ' : '50&deg;F ')
            + 'are not covered by Standard-55<br>';
    }
    if (to < 25 && d.vel_a > 0.3) {
        special_msg += 'The cooling effect of air speed '
            + 'is used only when the operative temperature is above '
            + (isCelsius ? '25&deg;C' : '77&deg;F');
    }
    if (!r.acceptability80) comply = false;

    renderCompliance(comply, special_msg);
}

function renderCompliance(comply, special_msg) {
    const comply_msg = '&#10004; &nbsp;Complies with ASHRAE Standard 55-2017';
    const no_comply_msg = '&#10008 &nbsp; Does not comply with ASHRAE Standard 55-2017';

    $('#vel-range').html('');
    if (comply) {
        $('#comply-msg').html(comply_msg);
        $('#output-b').removeClass("alert alert-danger").addClass("alert alert-success").css({'color': 'green'});
        ;
        $('#special-msg').html(special_msg);
    } else {
        $('#comply-msg').html(no_comply_msg);
        $('#output-b').removeClass("alert alert-success").addClass("alert alert-danger").css({'color': 'red'});
        ;
        $('#special-msg').html(special_msg);
    }
}

function setDefaults() {
    if (!isCelsius) toggleUnits();
    const hs = $('#humidity-spec').val();
    let rh = psy.convert(50, 25, 'rh', hs);
    if (hs === 'vappress') {
        rh /= 1000;
    }
    const defaults = {
        ta: envVarLimits.ta.si.default,
        tr: envVarLimits.tr.si.default,
        vel: envVarLimits.vel.si.default,
        rh: rh.toFixed(psy.PREC[hs]),
        met: envVarLimits.met.default,
        clo: envVarLimits.clo.default,
        trm: envVarLimits.trm.si.default,
        vel_a: 0.3
    };

    keys.forEach(function (element) {
        document.getElementById(element).value = defaults[element];
    });
}

function createDocument(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = html;
    return doc
}

function openDocument(doc) {
    var openwindow = window.open();
    openwindow.document.write(doc.documentElement.innerHTML);
    return openwindow
}

// Set clo value created by the custom ensemble dialog
function setClo() {
    let clo = 0;
    var opt = document.getElementById('cloMultiSelect').options;
    for (var i = 0; i < opt.length; i++) {
        if (opt[i].selected) clo += parseFloat(opt[i].value);
    }
    document.getElementById('clo').value = clo.toFixed(2);
}

// Add selected clothing items to create a custom ensemble
function addToEnsembles() {
    var items = [];
    var ensembleClo = 0;
    var opt = document.getElementById('cloMultiSelect').options;
    for (var i = 0; i < opt.length; i++) {
        if (opt[i].selected) {
            items.push(opt[i].text);
            ensembleClo += parseFloat(opt[i].value);
        }
    }
    cloSelect.options.add(new Option(items.join(', '), ensembleClo.toFixed(2)));
}

function updateGlobe() {
    let ta = parseFloat($('#ta-g').val());
    let vel = parseFloat($('#vel-g').val());
    let tglobe = parseFloat($('#tglobe').val());
    let diameter = parseFloat($('#diameter').val());
    let emissivity = parseFloat($('#emissivity').val());
    if (!isCelsius) {
        ta = util.FtoC(ta);
        vel /= 196.9;
        tglobe = util.FtoC(tglobe);
        diameter *= 0.0254
    }
    let tr = psy.globetemp(ta, vel, tglobe, diameter, emissivity);
    if (!isCelsius) tr = util.CtoF(tr);
    $('#mrt-result').val(tr.toFixed(1));
}
