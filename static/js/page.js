var d = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};
var d_cache = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};
var keys = ["ta", "tr", "vel", "rh", "met", "clo", "trm", "vel_a"];

$(document).ready(function() {

    var cloArticles = [{
        article: 'Men\'s underwear',
        clo: 0.04
    }, {
        article: 'Women\'s underwear',
        clo: 0.03
    }, {
        article: 'Bra',
        clo: 0.01
    }, {
        article: 'T-shirt',
        clo: 0.08
    }, {
        article: 'Full slip',
        clo: 0.16
    }, {
        article: 'Half slip',
        clo: 0.14
    }, {
        article: 'Long underwear top',
        clo: 0.2
    }, {
        article: 'Long underwear bottoms',
        clo: 0.15
    }, {
        article: 'Shoes or sandals',
        clo: 0.02
    }, {
        article: 'Slippers',
        clo: 0.03
    }, {
        article: 'Knee socks (thick)',
        clo: 0.06
    }, {
        article: 'Ankle socks',
        clo: 0.02
    }, {
        article: 'Calf length socks',
        clo: 0.03
    }, {
        article: 'Panty hose',
        clo: 0.02
    }, {
        article: 'Boots',
        clo: 0.1
    }, {
        article: 'Sleeveless scoop-neck blouse',
        clo: 0.12
    }, {
        article: 'Short-sleeve dress shirt',
        clo: 0.19
    }, {
        article: 'Long-sleeve dress shirt',
        clo: 0.25
    }, {
        article: 'Long-sleeve flannel shirt',
        clo: 0.34
    }, {
        article: 'Short-sleeve knit shirt',
        clo: 0.17
    }, {
        article: 'Long-sleeve sweat shirt',
        clo: 0.34
    }, {
        article: 'Short shorts',
        clo: 0.06
    }, {
        article: 'Walking shorts',
        clo: 0.08
    }, {
        article: 'Thin trousers',
        clo: 0.15
    }, {
        article: 'Thick trousers',
        clo: 0.24
    }, {
        article: 'Sweatpants',
        clo: 0.28
    }, {
        article: 'Overalls',
        clo: 0.30
    }, {
        article: 'Coveralls',
        clo: 0.49
    }, {
        article: 'Thin skirt',
        clo: 0.14
    }, {
        article: 'Thick skirt',
        clo: 0.23
    }, {
        article: 'Long-sleeve shirtdress (thin)',
        clo: 0.33
    }, {
        article: 'Long-sleeve shirtdress (thick)',
        clo: 0.47
    }, {
        article: 'Short-sleeve shirtdress',
        clo: 0.29
    }, {
        article: 'Sleeveless, scoop-neck shirt (thin)',
        clo: 0.23
    }, {
        article: 'Sleeveless, scoop-neck shirt (thick)',
        clo: 0.27
    }, {
        article: 'Sleeveless vest (thin)',
        clo: 0.13
    }, {
        article: 'Sleeveless vest (thick)',
        clo: 0.22
    }, {
        article: 'Longsleeve shirt (thin)',
        clo: 0.25
    }, {
        article: 'Longsleeve shirt (thick)',
        clo: 0.36
    }, {
        article: 'Single-breasted coat (thin)',
        clo: 0.36
    }, {
        article: 'Single-breasted coat (thick)',
        clo: 0.44
    }, {
        article: 'Double-breasted coat (thin)',
        clo: 0.42
    }, {
        article: 'Double-breasted coat (thick)',
        clo: 0.48
    }, {
        article: 'Sleeveless vest (thin)',
        clo: 0.1
    }, {
        article: 'Sleeveless vest (thick)',
        clo: 0.17
    }, {
        article: 'Sleeveless short gown (thin)',
        clo: 0.18
    }, {
        article: 'Sleeveless long gown (thin)',
        clo: 0.2
    }, {
        article: 'Short-sleeve hospital gown',
        clo: 0.31
    }, {
        article: 'Short-sleeve short robe (thin)',
        clo: 0.34
    }, {
        article: 'Long-sleeve long gown',
        clo: 0.46
    }, {
        article: 'Long-sleeve short wrap robe (thick)',
        clo: 0.48
    }, {
        article: 'Short-sleeve pajamas',
        clo: 0.42
    }, {
        article: 'Long-sleeve pajamas (thick)',
        clo: 0.57
    }, {
        article: 'Long-sleeve long wrap robe (thick)',
        clo: 0.69
    }, {
        article: 'Metal chair',
        clo: 0.00
    }, {
        article: 'Wooden stool',
        clo: 0.01
    }, {
        article: 'Standard office chair',
        clo: 0.10
    }, {
        article: 'Executive chair',
        clo: 0.15
    }];
    var cloEnsembles = [{
        clothing: 'Typical summer indoor clothing: 0.5',
        clo: 0.5
    }, {
        clothing: 'Typical winter indoor clothing: 1.0',
        clo: 1.0
    }, {
        clothing: 'Trousers, short-sleeve shirt, socks, shoes, underwear (SSU): 0.57',
        clo: 0.57
    }, {
        clothing: 'Trousers, long-sleeve shirt, SSU: 0.61',
        clo: 0.61
    }, {
        clothing: 'Jacket, Trousers, long-sleeve shirt, SSU: 0.96',
        clo: 0.96
    }, {
        clothing: 'Knee-length skirt, short-sleeve shirt, sandals, underwear: 0.54',
        clo: 0.54
    }, {
        clothing: 'Knee-length skirt, long-sleeve shirt, full slip, SSU: 0.67',
        clo: 0.67
    }, {
        clothing: 'Walking shorts, short-sleeve shirt, SSU: 0.36',
        clo: 0.36
    }, {
        clothing: 'Sweat pants, long-sleeve sweatshirt, SSU: 0.74',
        clo: 0.74
    }];
    var actData = [{
        activity: 'Typing: 1.1',
        met: 1.1
    }, {
        activity: 'Standing, relaxed: 1.2',
        met: 1.2
    }, {
        activity: 'Seated, quiet: 1.0',
        met: 1.0
    }, {
        activity: 'Sleeping: 0.7',
        met: 0.7
    }, {
        activity: 'Reclining: 0.8',
        met: 0.8
    }, {
        activity: 'Walking 2mph (3.2kmh): 2.0',
        met: 2.0
    }, {
        activity: 'Walking 3mph (4.8kmh): 2.6',
        met: 2.6
    }, {
        activity: 'Walking 4mph (6.4kmh): 3.8',
        met: 3.8
    }, {
        activity: 'Reading, seated: 1.0',
        met: 1.0
    }, {
        activity: 'Writing: 1.0',
        met: 1.0
    }, {
        activity: 'Filing, seated: 1.2',
        met: 1.2
    }, {
        activity: 'Filing, standing: 1.4',
        met: 1.4
    }, {
        activity: 'Walking about: 1.7',
        met: 1.7
    }, {
        activity: 'Lifting/packing: 2.1',
        met: 2.1
    }, {
        activity: 'Driving a car: 1.5',
        met: 1.5
    }, {
        activity: 'Flying aircraft, routine: 1.2',
        met: 1.2
    }, {
        activity: 'Flying aircraft, combat: 2.4',
        met: 2.4
    }, {
        activity: 'Driving, heavy vehicle: 3.2',
        met: 3.2
    }, {
        activity: 'Cooking: 1.8',
        met: 1.8
    }, {
        activity: 'House cleaning: 2.7',
        met: 2.7
    }, {
        activity: 'Seated, heavy limb movement: 2.2',
        met: 2.2
    }, {
        activity: 'Table sawing: 1.8',
        met: 1.8
    }, {
        activity: 'Light machine work: 2.2',
        met: 2.2
    }, {
        activity: 'Heavy machine work: 4.0',
        met: 4.0
    }, {
        activity: 'Handling 100lb (45 kg) bags: 4.0',
        met: 4.0
    }, {
        activity: 'Pick and shovel work: 4.4',
        met: 4.4
    }, {
        activity: 'Dancing: 3.4',
        met: 3.4
    }, {
        activity: 'Calisthenics: 3.5',
        met: 3.5
    }, {
        activity: 'Tennis: 3.8',
        met: 3.8
    }, {
        activity: 'Basketball: 6.3',
        met: 6.3
    }, {
        activity: 'Wrestling: 7.8',
        met: 7.8
    }];
    var cloSelect = document.getElementById('cloSelect');
    cloSelect.onchange = function() {
        document.getElementById('clo').value = cloSelect.value;
        update();
    }
    cloEnsembles.forEach(function(element) {
        cloSelect.options.add(new Option(element.clothing, element.clo));
    });
    var cloMultiSelect = document.getElementById('cloMultiSelect');
    cloArticles.forEach(function(element) {
        cloMultiSelect.options.add(new Option(element.article, element.clo));
    });
    var actSelect = document.getElementById('actSelect');
    actSelect.onchange = function() {
        document.getElementById('met').value = actSelect.value;
        update();
    };
    actData.forEach(function(element) {
        actSelect.options.add(new Option(element.activity, element.met));
    });
    var velaSelect = document.getElementById('vel_a')
    velaSelect.onchange = function() {
        update();
        var coolingEffect;
        if (d.vel_a == 0.3) {
            coolingEffect = 0
        } else if (d.vel_a == 0.6) {
            coolingEffect = 1.2
        } else if (d.vel_a == 0.9) {
            coolingEffect = 1.8
        } else if (d.vel_a == 1.2) {
            coolingEffect = 2.2
        }
        ac.redrawBounds(coolingEffect)
    }
    $(function() {
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
    var bound = bc.findComfortBoundary(d, 0.5)
    bc.drawComfortRegion(bound);
    bc.drawPoint();
    vc.drawChart();
    var bound = vc.findComfortBoundary(d, 0.5)
    vc.drawComfortRegion(bound);
    var whitebound = vc.findWhiteBoundary()
    vc.drawWhiteRegion(whitebound);
    vc.drawPoint();
    pc.drawChart();
    var json = [{ "db": d.ta,
                  "hr": pc.getHumRatio(d.ta, d.rh) }];
    var b = pc.findComfortBoundary(d, 0.5);
    pc.drawComfortRegion(b);
    pc.drawPoint(json);
    ac.drawChart();
    ac.drawPoint([d]);
});

$(function() {

    $('#globedialog').dialog({
        autoOpen: false,
        height: 300,
        width: 422,
        modal: true,
        resizable: false,
        buttons: {
            "Set mean radiant temperature": function() {
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
            "Calculate": function(){
                var alt = parseFloat($('#alt').val());
                var az = parseFloat($('#az').val());
                var posture = $('#posture').val();
                var Idir = parseFloat($('#Idir').val());
                var tsol = parseFloat($('#tsol').val());
                var fsvv = parseFloat($('#fsvv').val());
                var fbes = parseFloat($('#fbes').val());
                var asa = parseFloat($('#asa').val());

                var r = ERF(alt, az, posture, Idir, tsol, fsvv, fbes, asa)
                $('#erf-result').val(r.ERF.toFixed(1))
                if (!isCelsius) r.dMRT = util.CtoF(r.dMRT) - 32
                $('#dmrt-result').val(r.dMRT.toFixed(1))
            },
            "Adjust MRT": function(){
                var dmrt = parseFloat($('#dmrt-result').val());
                if (!isNaN(dmrt)){
                    var mrt = parseFloat($('#tr').val());
                    $('#tr').val((mrt + dmrt).toFixed(1));
                    $(this).dialog("close");
                    update();
                }
            },
            "Help": function(){
                
            },
            "Close": function() {
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

    $('#LEEDdialog').dialog({
        autoOpen: false,
        height: 700,
        width: 500,
        modal: true,
        resizable: true,
    });

    $('#link').button({}).click(function() {
        if ($('#tr-input').is(':hidden')) {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#globeTemp').removeAttr('disabled');
            $('#tr-input, #tr-lab').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab').hide();
        }
    });

/*    $('#local-control').button();*/
    $('#radio').buttonset();
    $('.leed-buttons').buttonset();

    $('#customClo').button({
        icons: {
            primary: 'ui-icon-person'
        }
    }).click(function() {
        $('#customCloToggle').toggle('fast');
        if ($('#leedInterface').is(':checked')) {
            $('#leedInterfaceToggle').toggle('fast');
            $('#leedInterface').removeAttr('checked');
            $('#leedInterface').button('refresh');
            $('#unitsToggle').removeAttr('disabled');
        }
    });

    $('#dynamicClo').button({
        icons: {
            primary: 'ui-icon-person'
        }
    }).click(function() {
        $('#dynamicCloToggle').toggle('fast');
    });

    $('#leedInterface').button({
        icons: {
            primary: 'ui-icon-document'
        }
    }).click(function() {
        $('#leedInterfaceToggle').toggle('fast');
        if (isCelsius) {
            toggleUnits();
            update();
        }
        if ($('#leedInterface').is(':checked')) {
            $('#unitsToggle').attr('disabled', 'disabled');
        } else {
            $('#unitsToggle').removeAttr('disabled');
        }
        if ($('#customClo').is(':checked')) {
            $('#customCloToggle').toggle('fast');
            $('#customClo').removeAttr('checked');
            $('#customClo').button('refresh');
        }
    });

    $('#leed-winter').click(function() {
        var spaceType = $('#leed-spacetype').val()
        var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating"
        setDataSeason(spaceType, ctype, "winter")
    });
    $('#leed-spring').click(function() {
        var spaceType = $('#leed-spacetype').val()
        var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating"
        setDataSeason(spaceType, ctype, "spring")
    });
    $('#leed-summer').click(function() {
        var spaceType = $('#leed-spacetype').val()
        var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating"
        setDataSeason(spaceType, ctype, "summer")
    });
    $('#leed-fall').click(function() {
        var spaceType = $('#leed-spacetype').val()
        var ctype = $('#leed-cooling').is(':checked') ? "cooling" : "heating"
        setDataSeason(spaceType, ctype, "fall")
    });

    $('#leed-submit').button().click(function() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", util.STATIC_URL + "/html/leed.html");
        xmlhttp.send();
        xmlhttp.onload = function(e) {
            leed_html = xmlhttp.responseText;
            doc = createDocument(leed_html);
            openwindow = openDocument(doc);
            generateTables(openwindow);
            $(openwindow.document.getElementsByClassName("box-texts")).remove();
        }
    });

    $('button').button();
    $('.buttons').buttonset();

    $('#ta, #tr, #trm').spinner({
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
        min: 0.0,
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

    $('#vel_a').selectmenu({
        width: 165
    });

    $('select#humidity-spec').selectmenu({
        width: 200
    });

    $('select#model-type').selectmenu({
        width: 200
    });

    $('select#local-control').selectmenu({
        width: 200
    });


    $('select#cloSelect').selectmenu({
        width: 200
    });

    $('select#actSelect').selectmenu({
        width: 200
    });
	
    $('select#chartSelect').selectmenu({
        width: 350
    });

});

$('#humidity-spec').change(function() {
    var v = $('#humidity-spec').val();
    var ta = parseFloat($('#ta').val());
    if (!isCelsius) ta = util.FtoC(ta);
    var maxVapPress = parseFloat(psy.satpress(ta));
    var maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
    var rh = parseFloat($('#rh').val());
    if (!isCelsius & (window.humUnit == 'wetbulb' | window.humUnit == 'dewpoint')) rh = util.FtoC(rh);
    if (window.humUnit == 'vappress') if (!isCelsius) rh *= 2953;
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

$('#link').click(function() {
    $('#tr').val($('#ta').val());
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
    update();
});

$('.inputbox').focusout(function() {
    update();
});

$('#unitsToggle').click(function() {
    toggleUnits();
    update();
});

$('#setDefaults').click(function() {
    setDefaults();
    update();
});

$('#specPressure').click(function() {
    var customPressure = prompt('Enter atmospheric pressure in Pascals');
    if (customPressure != '' && customPressure != null) {
        customPressure = parseFloat(customPressure)
        if (!isNaN(customPressure) && customPressure >= 60000 && customPressure <= 108000) {
            psy.PROP.Patm = customPressure
            pc.redraw_rh_lines();
            update();
        } else {
            window.alert('The entered atmospheric pressure is invalid. It must be in the range of 60,000 to 108,000 pascals.')
        }
    }
});

$('#globeTemp').click(function() {
    var container = $('#globedialog');
    $.ajax({
        url: util.STATIC_URL + 'html/globetemp.html',
        success: function(data) {
            $('#globedialog').html(data);
            if (!isCelsius) {
                $('#ta-g').val('77')
                $('#vel-g').val('20')
                $('#tglobe').val('77')
                $('#diameter').val('6')
                $('#g-ta-unit').html(' &deg;F')
                $('#g-vel-unit').html(' fpm')
                $('#g-tglobe-unit').html(' &deg;F')
                $('#g-globediam-unit').html(' in')
                $('#g-mrt-unit').html(' &deg;F')
            }
        },
        async: false
    });
    container.dialog("open");
    updateGlobe();
    $('.input-dialog').focusout(function() {
        updateGlobe();
    });
});

$('#ERF').click(function() {
  var container = $('#ERFdialog');
  $.ajax({
    url: util.STATIC_URL + '/html/erf.html',
    success: function(data) {
      $('#ERFdialog').html(data);
      $('#posture').selectmenu({
          width: 90
      });
    },
    async: false
  });
  if (!isCelsius){
    $('#dmrt-unit').html('&deg;F')
  }
  container.dialog("open");
});

$('#localDisc').click(function() {
    var container = $('#localdialog');
    $.ajax({
        url: util.STATIC_URL + '/html/localdiscASH55.html',
        success: function(data) {
            $('#localdialog').html(data);
            if (!isCelsius) {
                $('.tempunit').html(' &deg;F')
                $('.velunit').html(' fpm')
                $('#T_head').val('77')
                $('#T_ankle').val('77')
                $('#T_floor').val('77')
                $('#T_op').val('77')
                $('#local_Ta').val('77')
                $('#local_Tr').val('77')
                $('#local_ank_vel').val('20')
                $('#local_vel_1').val('20')
                $('#local_vel').val('20')
            }
        },
        async: false
    });
    container.dialog("open");
    $('.input-dialog-local').focusout(function() {
        updateLocalDisc();
    });
});

$('#LEED-help').click(function() {
    var container = $('#LEEDdialog');
    $.ajax({
        url: util.STATIC_URL + 'html/leed-help.html',
        success: function(data) {
            $('#LEEDdialog').html(data);
        },
        async: false
    });
    container.dialog("open");
});

$('#setClo').click(function() {
    setClo();
    update();
});
$('#addToEnsembles').click(function() {
    addToEnsembles();
});
$('#setDynamicClo').click(function() {
    var ta6 = $('#taOut6').val();
    var clo_r = comf.schiavonClo(ta6);
	$('#clo').val(clo_r.toFixed(2));
    update();
});

$('#model-type').change(function() {
    $('#pmv-out-label').html('PMV');
//    $('#local-control-div').hide();
//    $('#local-control').hide();
    $('#localDisc').removeAttr('disabled');
    model = $('#model-type').val();
    if (model == 'pmvElevatedAirspeed') {
        $('#pmv-inputs, #pmv-outputs, #cloInput, #actInput, #humidity-spec-cont, #chart-div, #chartSelect-cont, #pmv-notes, #veltopchart-div').show();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive, #temphumchart-div, #temphumchart-title, #veltopchart-div').hide();
        if (model == 'pmvElevatedAirspeed') {
//            $('#pmv-elev-outputs, #local-control-div').show();
            $('#pmv-elev-outputs, #local-control-div').show();
            $('#pmv-out-label').html('PMV Adjusted');
        } else {
            $('#pmv-elev-outputs').hide();
        }
    } else if (model == 'adaptiveComfort') {
//        $('#pmv-inputs, #pmv-elev-inputs, #local-control-div, #pmv-outputs, #pmv-elev-outputs, #cloInput').hide()
        $('#pmv-inputs, #pmv-elev-inputs, #local-control, #local-control-div, #pmv-outputs, #pmv-elev-outputs, #cloInput').hide()
        $('#actInput, #humidity-spec-cont, #chart-div, #temphumchart-div, #pmv-notes, #chartSelect-cont, #veltopchart-div').hide();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive').show();
        $('#localDisc').attr('disabled', 'disabled');
    }
    update();
});

$("#chartSelect").change(function(){
	chart = $("#chartSelect").val();
	if (chart == "psychta" || chart == "psychtop"){
		$("#chart-div").show();
		$("#temphumchart-div, veltopchart-div").hide();
		if (chart == "psychta") {
			$("#psychta-note").show();
			$("#psychtop-note, #temphum-note, #veltop-note, #veltopchart-div").hide();
			
			$("#db-axis-C-label").text("Drybulb Temperature [°C]");
			$("#db-axis-F-label").text("Drybulb Temperature [°F]");
			
			if ($('#link').is(':checked')) {
            	$('#labelforlink').show();
			} else {
				$('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            	$('#globeTemp').removeAttr('disabled');
            	$('#tr-input, #tr-lab, #labelforlink').show();
			}
			
			//$(".comfortzone").css("fill", "rgb(0,0,100)")
			
		} else if (chart == "psychtop") {
			$("#psychtop-note").show();
			$("#psychta-note, #temphum-note, #veltop-note, #veltopchart-div").hide();
			
			$("#db-axis-C-label").text("Operative Temperature [°C]");
			$("#db-axis-F-label").text("Operative Temperature [°F]");
			
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab, #labelforlink').hide();

			//$(".comfortzone").css("fill", "rgb(0,0,0)")
		}
	} else if (chart == "temphum") {
		$("#temphumchart-div, #temphum-note").show();
		$("#chart-div, #psychta-note, #psychtop-note, #veltop-note, #veltopchart-div").hide();
		if ($('#link').is(':checked')) {
        	$('#labelforlink').show();
		} else {
			$('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
        	$('#globeTemp').removeAttr('disabled');
        	$('#tr-input, #tr-lab, #labelforlink').show();
		}
	} else if (chart == "veltop") {
		$("#veltopchart-div, #veltop-note").show();
		$("#chart-div, #psychta-note, #psychtop-note, #temphum-note, #temphumchart-div").hide();
//		if ($('#link').is(':checked')) {
//        	$('#labelforlink').show();
//		} else {
//			$('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
//        	$('#globeTemp').removeAttr('disabled');
//        	$('#tr-input, #tr-lab, #labelforlink').show();
//		}
            $('#link').is(':checked');
            $('#labelforlink').show();
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab, #labelforlink').hide();
	}
	update();
});

$("#local-control-div").change(function(){
    var local_control = $('#local-control').val();
    if (local_control == 'withairspeedcontrol' || local_control == 'noairspeedcontrol' ){
//    $("#local-control-div").show();
    }
    update();
});

function toggleUnits() {
    var v, el;
    var hs = $('#humidity-spec').val();
    isCelsius = !isCelsius;
    if (isCelsius) {
        $('.tempunit').each(function() {
            $(this).html(' &deg;C');
        });
        $('#ta, #tr, #trm').each(function() {
            v = util.FtoC($(this).val());
            $(this).val(v.toFixed(1));
        });
        $('#vel-unit').html(' m/s');
        v = $('#vel').val();
        $('#vel').val(v / 196.9).spinner({
            step: 0.01,
            min: 0,
            max: 3,
            numberFormat: 'n'
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
        $('#ta, #tr, #trm').each(function() {
            v = util.CtoF($(this).val());
            $(this).val(v.toFixed(1));
        });
        $('#vel-unit, #vel-a-unit').html(' fpm');
        v = $('#vel').val();
        $('#vel').val(v * 196.9).spinner({
            step: 1,
            min: 0,
            max: 300,
            numberFormat: 'n'
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
    vc.toggleUnits(isCelsius);
    ac.toggleUnits(isCelsius);
}


function setClo() {
    var clo = 0;
    var opt = document.getElementById('cloMultiSelect').options;
    for (var i = 0; i < opt.length; i++) {
        if (opt[i].selected) clo += parseFloat(opt[i].value);
    }
    document.getElementById('clo').value = clo.toFixed(2);
}

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

function update() {

    if ($('#link').is(':checked') || $("#chartSelect").val() == "psychtop" || $("#chartSelect").val() == "veltop") {
        $('#tr').val($('#ta').val());
    }
    keys.forEach(function(element) {
        d_cache[element] = d[element];
        var e = document.getElementById(element).value
        e = e.replace(/,/g, '.')
        d[element] = parseFloat(e);
    });
    d.wme = 0;
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
    model = document.getElementById('model-type').value;
    if (model == 'pmvElevatedAirspeed') {
        r = comf.pmvElevatedAirspeed(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
        if (!isCelsius){
            r.set = util.CtoF(r.set)
        }
        renderPmvElevResults(r);
        calcPmvElevCompliance(d, r);
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
        } else if ($('#veltopchart-div').is(':visible')) {
            var b = vc.findComfortBoundary(d, 0.5)
            vc.redrawComfortRegion(b);
            var whitebound = vc.findWhiteBoundary()
            vc.redrawWhiteRegion(whitebound);
            vc.redrawPoint();
        };

    } else if (model == 'adaptiveComfort') {
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
        if (to < r.tComfUpper90) {
            $('#sensation90').html('Too cool');
        } else {
            $('#sensation90').html('Too warm');
        }
    } else if (to < r.tComfLower80) {
        $('#sensation80, #sensation90').html('Too cool');
    } else {
        $('#sensation80, #sensation90').html('Too warm');
    }
}

function calcPmvCompliance(d, r) {
    var pmv_comply = Math.abs(r.pmv) <= 0.5;
    var met_comply = d.met <= 2 && d.met >= 1;
    var clo_comply = d.clo <= 1.5;
//    var local_control = $('#local-control').is(':checked');
    var local_control = $('#local-control').val();
    var special_msg = '';
    comply = true;
    if (local_control == 'withairspeedcontrol'){
    if (!met_comply) {
        comply = false;
        special_msg += '&#8627; Metabolic rates below 1.0 or above 2.0 are not covered by this standard<br>';
    }
    if (!clo_comply) {
        comply = false;
        special_msg += '&#8627; Clo values above 1.5 are not covered by this standard<br>';
    }
    if (elev_airspeed && d.clo > 0.7) {
        comply = false;
        special_msg += '&#8627; Elevated air speeds with clo > 0.7 are not covered by this standard<br>';
    }
    if (!pmv_comply) {
        comply = false;
    }
    }
    renderCompliance(comply, special_msg);
}

function calcPmvElevCompliance(d, r) {
    var pmv_comply = (Math.abs(r.pmv) <= 0.5);
    var met_comply = d.met <= 2 && d.met >= 1;
    var clo_comply = d.clo <= 1.5;
//    var local_control = $('#local-control').is(':checked');
    var local_control = $('#local-control').val();
    var special_msg = '';
    var compliance_ranges, unit_t, unit_v;
    comply = true;

    if (!met_comply) {
        comply = false;
        special_msg += '&#8627; Metabolic rates below 1.0 or above 2.0 are not covered by this Standard<br>';
    }
    if (!clo_comply) {
        comply = false;
        special_msg += '&#8627; Clo values above 1.5 are not covered by this Standard<br>';
    }
    if (!pmv_comply) {
        comply = false;
    }

    if (d.vel > 0.2) {
        $("#pmv-out-label").html('PMV with elevated air speed')
        $("#ppd-out-label").html('PPD with elevated air speed')
        $("#pmv-elev-outputs").show();
    } else {
        $("#pmv-out-label").html('PMV')
        $("#ppd-out-label").html('PPD')
        $("#pmv-elev-outputs").hide();
    }

//    if (!local_control) {
    if (local_control == 'noairspeedcontrol'){
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
            special_msg += '&#8627; Maximum air speed has been limited due to no occupant control<br>';
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
    if (to < 25 & d.vel_a > 0.3) {
        special_msg += '&#8627; The cooling effect of air speed '
          + 'is used only when the operative temperature is above ' 
          + (isCelsius ? '25&deg;C' : '77&deg;F');
    }
    if (!r.acceptability80) comply = false;

    renderCompliance(comply, special_msg);
}

function renderCompliance(comply, special_msg) {
    var comply_msg = '&#10004; &nbsp;Complies with ASHRAE Standard 55-2013';
    var no_comply_msg = '&#10008 &nbsp; Does not comply with ASHRAE Standard 55-2013';

    $('#vel-range').html('');
    if (comply) {
        $('#comply-msg').html(comply_msg);
        $('#comply-msg').css('color', 'green')
        $('#special-msg').html(special_msg);
    } else {
        $('#comply-msg').html(no_comply_msg);
        $('#comply-msg').css('color', 'red')
        $('#special-msg').html(special_msg);
    }
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
        vel: 0.10,
        rh: rh.toFixed(psy.PREC[hs]),
        met: 1.1,
        clo: 0.5,
        trm: 29,
        vel_a: 0.3
    };

    keys.forEach(function(element) {
        document.getElementById(element).value = defaults[element];
    });
}

function updateGlobe() {
    var ta = parseFloat($('#ta-g').val());
    var vel = parseFloat($('#vel-g').val());
    var tglobe = parseFloat($('#tglobe').val());
    var diameter = parseFloat($('#diameter').val());
    var emissivity = parseFloat($('#emissivity').val());
    if (!isCelsius) {
        ta = util.FtoC(ta)
        vel /= 196.9
        tglobe = util.FtoC(tglobe)
        diameter *= 0.0254
    }
    var tr = psy.globetemp(ta, vel, tglobe, diameter, emissivity);
    if (!isCelsius) tr = util.CtoF(tr)
    $('#mrt-result').val(tr.toFixed(1));
}

function createDocument(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = html;
    return doc
}

function openDocument(doc) {
    var openwindow = window.open()
    openwindow.document.write(doc.documentElement.innerHTML);
    return openwindow
}
