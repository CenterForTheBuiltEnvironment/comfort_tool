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
        activity: 'Typing: 1.1',
        met: 1.1
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

    $(function() {
        $(".multiselect").multiselect({
            sortable: false,
            searchable: false,
            dividerLocation: 0.5
        });
    });
    $('#adaptive-inputs, #adaptive-note, #psychtop-note, #temphum-note, #chart-div-adaptive, #temphumchart-div').hide();
    window.isCelsius = true;
    window.humUnit = 'rh';
    setDefaults();
    update();
    bc.drawChart();
    var bound = bc.findComfortBoundary(d, 0.5)
    enbc.drawComfortRegions(d);
    bc.drawPoint();

    pc.drawChart();
    var json = [{ "db": d.ta,
                  "hr": pc.getHumRatio(d.ta, d.rh) }];
    enpc.drawComfortRegions(d);
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
                if (!isCelsius) tr = util.CtoF(tr);
                $('#tr').val(tr);
                $(this).dialog("close");
                update();
            }
        }
    });

    $('#localdialog').dialog({
        autoOpen: false,
        height: 600,
        width: 470,
        modal: true,
        resizable: false,
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

    $('#local-control').button();
    $('#radio').buttonset();
    //$('#local-control-adapt').button();

    $('#customClo').button({
        icons: {
            primary: 'ui-icon-person'
        }
    }).click(function() {
        $('#customCloToggle').toggle('fast');
    });

    $('button').button();
    $('.buttons').buttonset();

    $('#ta, #tr, #trm').spinner({
        step: 0.1,
        min: 0,
        max: 120,
        numberFormat: "n"
    });

    $('#vel, #vel_a').spinner({
        step: 0.01,
        min: 0,
        max: 4,
        numberFormat: "n"
    });

    $('#clo').spinner({
        step: 0.05,
        min: 0.0,
        max: 2.0,
        numberFormat: "n"
    });

    $('#met').spinner({
        step: 0.05,
        min: 0.8,
        max: 4.0,
        numberFormat: "n"
    });

    $('#rh').spinner({
        step: 1,
        min: 0,
        max: 100,
        numberFormat: "n"
    });

    $('select#humidity-spec').selectmenu({
        width: 200
    });

    $('select#model-type').selectmenu({
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

$('#vel_a').focusout(function() {
    update();
    updateBounds();
});
$('#vel-a-box').click(function() {
    update();
    updateBounds();
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
    var customPressure = prompt('Enter atmospheric pressure in '.concat(isCelsius ? 'Pascals (Pa)':'inches of mercury (inHg)'));
    if (customPressure !== '' && customPressure !== null) {
        customPressure = parseFloat(customPressure);
        if (!isCelsius) {
            customPressure *= 3386.39;
        }
        if (!isNaN(customPressure) && customPressure >= 30000 && customPressure <= 110000) {
            psy.PROP.Patm = customPressure;
            enpc.redraw_rh_lines()
            update();
        } else {
            window.alert('The entered atmospheric pressure is invalid.');
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

$('#localDisc').click(function() {
    var container = $('#localdialog');
    $.ajax({
        url: util.STATIC_URL + '/html/localdisc.html',
        success: function(data) {
            $('#localdialog').html(data);
            if (!isCelsius) {
                $('.tempunit').html(' &deg;F')
                $('.velunit').html(' fpm')
                $('#T_head').val('77')
                $('#T_ankle').val('77')
                $('#T_floor').val('77')
                $('#T_op').val('77')
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

$('#setClo').click(function() {
    setClo();
    update();
});
$('#addToEnsembles').click(function() {
    addToEnsembles();
});

$('#model-type').change(function() {
    $('#pmv-out-label').html('PMV');
    $('#local-control-div').hide();
    $('#localDisc').removeAttr('disabled');
    model = $('#model-type').val();
    if (model == 'pmv') {
        $('#pmv-inputs, #pmv-outputs, #cloInput, #actInput, #humidity-spec-cont, #chart-div, #chartSelect-cont, #pmv-notes').show();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive, #temphumchart-div, #temphumchart-title').hide();
        $('#local-control-div').show();
    } else if (model == 'adaptiveComfort') {
        $('#pmv-inputs, #local-control-div, #pmv-outputs, #cloInput').hide();
        $('#actInput, #humidity-spec-cont, #chart-div, #temphumchart-div, #pmv-notes, #chartSelect-cont').hide();
        $('#adaptive-note, #adaptive-inputs, #adaptive-outputs, #chart-div-adaptive, #chart-title-adaptive').show();
        $('#localDisc').attr('disabled', 'disabled');
    }
    update();
});

$("#chartSelect").change(function(){
    var chart = $("#chartSelect").val();
    if (chart == "psychta" || chart == "psychtop"){
        $("#chart-div").show();
        $("#temphumchart-div").hide();
        if (chart == "psychta") {
            $("#psychta-note").show();
            $("#psychtop-note, #temphum-note").hide();
            
            $("#db-axis-C-label").text("Drybulb Temperature [°C]");
            $("#db-axis-F-label").text("Drybulb Temperature [°F]");
            
            if ($('#link').is(':checked')) {
                $('#labelforlink').show();
            } else {
                $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
                $('#globeTemp').removeAttr('disabled');
                $('#tr-input, #tr-lab, #labelforlink').show();
            }
            
        } else if (chart == "psychtop") {
            $("#psychtop-note").show();
            $("#psychta-note, #temphum-note").hide();
            
            $("#db-axis-C-label").text("Operative Temperature [°C]");
            $("#db-axis-F-label").text("Operative Temperature [°F]");
            
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Operative_temperature" target="_new">Operative temperature</a>');
            $('#globeTemp').attr('disabled', 'disabled');
            $('#tr-input, #tr-lab, #labelforlink').hide();
        }
    } else if (chart == "temphum") {
        $("#temphumchart-div, #temphum-note").show();
        $("#chart-div, #psychta-note, #psychtop-note").hide();
        if ($('#link').is(':checked')) {
            $('#labelforlink').show();
        } else {
            $('#ta-lab').html('<a class="mainlink" href="http://en.wikipedia.org/wiki/Dry-bulb_temperature" target="_new">Air temperature</a>');
            $('#globeTemp').removeAttr('disabled');
            $('#tr-input, #tr-lab, #labelforlink').show();
        }
    }
    update();
});

function toggleUnits() {
    var v, v_a, el;
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
        $('#vel-unit, #vel-a-unit').html(' m/s');
        v = $('#vel').val();
        $('#vel').val(v / 196.9).spinner({
            step: 0.01,
            min: 0,
            max: 3,
            numberFormat: 'n'
        });
		v_a = $('#vel_a').val();
        $('#vel_a').val(v_a / 196.9).spinner({
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
	    v_a = $('#vel_a').val();
        $('#vel_a').val(v_a * 196.9).spinner({
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

    if ($('#link').is(':checked') || $("#chartSelect").val() == "psychtop") {
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
        d.vel_a /= 196.9;
        if (window.humUnit == 'wetbulb' || window.humUnit == 'dewpoint') d.rh = util.FtoC(d.rh);
        else if (window.humUnit == 'vappress') d.rh *= 2953;
    } else {
        if (window.humUnit == 'vappress') d.rh *= 1000;
    }
    d.rh = psy.convert(d.rh, d.ta, window.humUnit, 'rh');
    model = document.getElementById('model-type').value;
    if (model == 'pmv') {
        r = comf.pmv(d.ta, d.tr, d.vel, d.rh, d.met, d.clo, 0);
        renderPmvResults(r);
        calcPmvCompliance(d, r);
        if ($('#chart-div').is(':visible')) {
            enpc.redrawComfortRegions(d);
            var pointdata = [{
                "db": d.ta,
                "hr": pc.getHumRatio(d.ta, d.rh)
            }];
            pc.redrawPoint(pointdata);
        } else if ($('#temphumchart-div').is(':visible')) {
            enbc.redrawComfortRegions(d);
            bc.redrawPoint();
        }

    } else if (model == 'adaptiveComfort') {
        r = comf.adaptiveComfortEN15251(d.ta, d.tr, d.trm, d.vel_a);
        renderAdaptiveResults(r);
        calcAdaptiveCompliance(d, r);
        ac.redrawPoint([d])
    }
}

function updateBounds() {
	var coolingEffect = 1.7856 * Math.log(d.vel_a) + 2.9835;
    if (coolingEffect > 0) {
        ac.redrawBounds(coolingEffect);
    } else {
	    ac.redrawBounds(0);
    }
}

function getCategory(pmv) {
	if (Math.abs(pmv) <= 0.2) return 'I';
	else if (Math.abs(pmv) <= 0.5) return 'II';
	else if (Math.abs(pmv) <= 0.7) return 'III';
	else if (Math.abs(pmv) > 0.7) return 'IV';
	else return '-';
}

function renderPmvResults(r) {
    $('#pmv-res').html(r.pmv.toFixed(2));
    $('#ppd-res').html(r.ppd.toFixed(0));
    var category = getCategory(r.pmv);
    $('#category').html(category);
}

function renderAdaptiveResults(r) {
    var to = (parseFloat($('#ta').val()) + parseFloat($('#tr').val())) / 2;
    if (!isCelsius) {
        r.tComfIUpper = util.CtoF(r.tComfIUpper);
        r.tComfIIUpper = util.CtoF(r.tComfIIUpper);
        r.tComfIIIUpper = util.CtoF(r.tComfIIIUpper);
        r.tComfILower = util.CtoF(r.tComfILower);
        r.tComfIILower = util.CtoF(r.tComfIILower);
        r.tComfIIILower = util.CtoF(r.tComfIIILower);
    }
    $('#limitsI').html('Operative temperature: ' + r.tComfILower.toFixed(1) + ' to ' + r.tComfIUpper.toFixed(1));
    $('#limitsII').html('Operative temperature: ' + r.tComfIILower.toFixed(1) + ' to ' + r.tComfIIUpper.toFixed(1));
    $('#limitsIII').html('Operative temperature: ' + r.tComfIIILower.toFixed(1) + ' to ' + r.tComfIIIUpper.toFixed(1));
    if (r.acceptabilityI) {
        $('#sensationIII, #sensationII, #sensationI').html('Comfortable');
    } else if (r.acceptabilityII) {
        $('#sensationIII, #sensationII').html('Comfortable');
        if (to < r.tComfIUpper) {
            $('#sensationI').html('Too cool');
        } else {
            $('#sensationI').html('Too warm');
        }
	} else if (r.acceptabilityIII) {
        $('#sensationIII').html('Comfortable');
        if (to < r.tComfIIUpper) {
            $('#sensationI, #sensationII').html('Too cool');
        } else {
            $('#sensationI, #sensationII').html('Too warm');
        }
    } else if (to < r.tComfIIIUpper) {
        $('#sensationIII, #sensationII, #sensationI').html('Too cool');
    } else {
        $('#sensationIII, #sensationII, #sensationI').html('Too warm');
    }
}

function calcPmvCompliance(d, r) {
    var pmv_complyI = Math.abs(r.pmv) <= 0.2;
    var pmv_complyII = Math.abs(r.pmv) <= 0.5;
    var pmv_complyIII = Math.abs(r.pmv) <= 0.7;
    var met_comply = d.met <= 4 && d.met >= 0.8;
    var clo_comply = d.clo <= 2;
    var local_control = $('#local-control').is(':checked');
    var special_msg = '';
    comply = true;

    if (!met_comply) {
        comply = false;
        special_msg += '&#8627; Metabolic rates below 0.8 or above 4.0 are not covered by this standard<br>';
    }
    if (!clo_comply) {
        comply = false;
        special_msg += '&#8627; Clo values above 2.0 are not covered by this standard<br>';
    }
    if (!pmv_complyIII) {
        comply = false;
    }

    renderCompliance(comply, special_msg);
}

function calcAdaptiveCompliance(d, r) {
    var comply = true;
    var special_msg = '';

    if (d.trm > 30 || d.trm < 10) {
        comply = false;
        special_msg += '&#8627; Running mean outdoor temperatures above ' + (isCelsius ? '30&deg;C ' : '92.3&deg;F ') 
          + 'or below ' + (isCelsius ? '10&deg;C ' : '50&deg;F ') + 'are not covered by Standard-55<br>';
    }
    if (!r.acceptabilityIII) comply = false;

    renderCompliance(comply, special_msg);
}

function renderCompliance(comply, special_msg) {
    var comply_msg = '&#10004; &nbsp;Complies with EN-15251';
    var no_comply_msg = '&#10008 &nbsp; Does not comply with EN-15251';

    $('#vel-range').html('');
    if (comply) {
        $('#comply-msg').html(comply_msg);
        $('#comply-msg').css('color', 'green');
        $('#special-msg').html(special_msg);
    } else {
        $('#comply-msg').html(no_comply_msg);
        $('#comply-msg').css('color', 'red');
        $('#special-msg').html(special_msg);
    }
}

function setDefaults() {
    if (!isCelsius) toggleUnits();
    var hs = $('#humidity-spec').val();
    var rh = psy.convert(50, 25, 'rh', hs);
    if (hs == 'vappress') {
        rh /= 1000;
    }
    var defaults = {
        ta: 25,
        tr: 25,
        vel: 0.10,
        rh: rh.toFixed(psy.PREC[hs]),
        met: 1.2,
        clo: 0.5,
        trm: 24,
        vel_a: 0.2
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
