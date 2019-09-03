/*
This file contains all the global variables shared among the .js file.

I have grouped them all here so there is no repetition, hence, it should be easier to fix issues and maintain consistency.

Remember to include this file in the HTML file if you want to access these variables
 */

let d = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};
let d_cache = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};
let keys = ["ta", "tr", "vel", "rh", "met", "clo", "trm", "vel_a"];

// Clothes ensambles that are shown in the drop down menu. The values are sorted by clo in ascending order
let cloInsulationTypicalEnsambles = [
    {
        clothing: 'Walking shorts, short-sleeve shirt: 0.36 clo',
        clo: 0.36
    }, {
        clothing: 'Typical summer indoor clothing: 0.5 clo',
        clo: 0.5
    }, {
        clothing: 'Knee-length skirt, short-sleeve shirt, sandals, underwear: 0.54 clo',
        clo: 0.54
    }, {
        clothing: 'Trousers, short-sleeve shirt, socks, shoes, underwear: 0.57 clo',
        clo: 0.57
    }, {
        clothing: 'Trousers, long-sleeve shirt: 0.61 clo',
        clo: 0.61
    }, {
        clothing: 'Knee-length skirt, long-sleeve shirt, full slip: 0.67 clo',
        clo: 0.67
    }, {
        clothing: 'Sweat pants, long-sleeve sweatshirt: 0.74 clo',
        clo: 0.74
    }, {
        clothing: 'Jacket, Trousers, long-sleeve shirt: 0.96 clo',
        clo: 0.96
    }, {
        clothing: 'Typical winter indoor clothing: 1.0 clo',
        clo: 1.0
    }];
// Sorting the json array as function of clo value
cloInsulationTypicalEnsambles.sort((a, b) => parseFloat(a.clo) - parseFloat(b.clo));

// Clothing insulation of individual
let cloInsulationGarments = [
    {
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
        article: 'Long sleeve shirt (thin)',
        clo: 0.25
    }, {
        article: 'Long sleeve shirt (thick)',
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
cloInsulationGarments.sort((a, b) => parseFloat(a.clo) - parseFloat(b.clo));

// Metabolic rates of typical activities
let metRatesTypicalTasks = [
    {
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
metRatesTypicalTasks.sort((a, b) => parseFloat(a.met) - parseFloat(b.met));

// Metabolic rates of typical activities ASHRAE removed reclining and sleeping
let metRatesTypicalTasksASHRAE = metRatesTypicalTasks.filter(function (el) {
    return el.met > 0.7 && // 0.8 is the reclining met
        el.met <= 4.0  // as defined in page 36 ASHRAE 55
});
metRatesTypicalTasksASHRAE.sort((a, b) => parseFloat(a.met) - parseFloat(b.met));

// defined below the upper and lower limits for environmental variables as specified in ISO 7730 and ASHRAE
const envVarLimits = {
    'ta': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 0,
            'max': 50
        },
        'ip': {
            'step': 0.5,
            'default': 77,
            'min': 32,
            'max': 122
        },
    },
    'tr': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 0,
            'max': 50
        },
        'ip': {
            'step': 0.5,
            'default': 77,
            'min': 32,
            'max': 122
        },
    },
    'vel': {
        'si': {
            'step': 0.1,
            'default': 0.1,
            'min': 0,
            'max': 4,
            'elevated_air_speed': 0.1,
        },
        'ip': {
            'step': 0.1,
            'default': 20,
            'min': 0,
            'max': 790
        },
    },
    'rh': {
        'step': 1,
        'default': 50,
        'min': 0,
        'max': 100
    },
    'met': {
        'step': 0.1,
        'default': 1,
        'min': 0.7,
        'max': 4
    },
    'clo': {
        'step': 0.1,
        'default': 0.6,
        'min': 0,
        'max': 4  // ISO imposes 2 and ASHRAE 1.5
    },
    'trm': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 10,
            'max': 35
        },
        'ip': {
            'step': 0.5,
            'min': 40,
            'max': 95
        },
    },
    'twb': {
        'si': {
            'step': 0.1,
            'default': 25,
            'min': 0.1,
            'max': 36
        },
        'ip': {
            'step': 0.1,
            'default': 50,
            'min': 33.2,
            'max': 100
        },
    },
    'tdp': {
        'si': {
            'step': 0.1,
            'default': 0.1,
            'min': 15,
            'max': 32
        },
        'ip': {
            'step': 0.1,
            'default': 45,
            'min': 0.1,
            'max': 90
        },
    },
};

// Handles the toggling of the units between SI and IP
function toggleUnits() {
    var v;
    let hs = $('#humidity-spec').val();
    isCelsius = !isCelsius;

    // if the unit system is the SI
    if (isCelsius) {

        // change the temperature unit
        $('.tempunit').each(function () {
            $(this).html(' &deg;C');
        });

        // Convert the temperature to Celisus and revert the spinner limits
        $('#ta, #tr, #trm').each(function () {
            v = util.FtoC($(this).val());
            $(this).val(v.toFixed(1)).spinner({
                step: envVarLimits.ta.si.step,
                min: envVarLimits.ta.si.min,
                max: envVarLimits.ta.si.max,
            });
        });

        // change the air velocity unit
        $('#vel-unit').html(' m/s');

        // Convert the air velocity to m/s and revert the spinner limits
        v = $('#vel').val();
        $('#vel').val(v / 196.9).spinner({
            step: envVarLimits.vel.si.step,
            min: envVarLimits.vel.si.min,
            max: envVarLimits.vel.si.max,
            numberFormat: "n"
        });

        // change dewpoint and wetbulb temperature units
        if (hs === 'dewpoint') {
            $('#rh-unit').html(' &deg;C');
            v = (util.FtoC($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.tdp.si.step,
                min: envVarLimits.tdp.si.min,
                max: envVarLimits.tdp.si.max,
                numberFormat: "n"
            });
        } else if (hs == 'wetbulb') {
            $('#rh-unit').html(' &deg;C');
            v = (util.FtoC($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.twb.si.step,
                min: envVarLimits.twb.si.min,
                max: envVarLimits.twb.si.max,
                numberFormat: "n"
            });
        } else if (hs == 'vappress') {
            $('#rh-unit').html(' KPa');
            v = $('#rh').val() * 2.953;
            $('#rh').val(v.toFixed(2));
        }

        // if instead the unit system is IP
    } else {
        // change the temperature unit
        $('.tempunit').each(function () {
            $(this).html(' &deg;F');
        });

        // Convert the temperature to Fahrenheit and change the spinner limits
        $('#ta, #tr, #trm').each(function () {
            v = util.CtoF($(this).val());
            $(this).val(v.toFixed(1)).spinner({
                step: envVarLimits.ta.ip.step,
                min: envVarLimits.ta.ip.min,
                max: envVarLimits.ta.ip.max,
            });
        });

        // change the air velocity unit
        $('#vel-unit, #vel-a-unit').html(' fpm');

        // Convert the air velocity to fpm and change spinner limit
        v = $('#vel').val();
        $('#vel').val(v * 196.9).spinner({
            step: envVarLimits.vel.ip.step,
            min: envVarLimits.vel.ip.min,
            max: envVarLimits.vel.ip.max,
            numberFormat: 'n'
        });

        if (hs === 'dewpoint') {
            $('#rh-unit').html(' &deg;F');
            v = (util.CtoF($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.tdp.ip.step,
                min: envVarLimits.tdp.ip.min,
                max: envVarLimits.tdp.ip.max,
                numberFormat: "n"
            });
        } else if (hs === 'wetbulb') {
            $('#rh-unit').html(' &deg;F');
            v = (util.CtoF($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.twb.ip.step,
                min: envVarLimits.twb.ip.min,
                max: envVarLimits.twb.ip.max,
                numberFormat: "n"
            });
        } else if (hs === 'vappress') {
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

// check user entry
function validateUserEntry(i) {

    keys.forEach(function (element) {
        d_cache[element] = d[element];
        let e = document.getElementById(element + i).value;

        // replace comma with dot
        e = e.replace(/,/g, '.');

        // define which measurement system is being used
        let measurementSystem;
        if (isCelsius) {
            measurementSystem = 'si'
        } else {
            measurementSystem = 'ip'
        }

        // check user entry. if value is beyond the acceptability limit replace it with the default value
        try {
            if (e > envVarLimits[element][measurementSystem]['max'] || e < envVarLimits[element][measurementSystem]['min']) {
                $('#' + element + i).val(envVarLimits[element][measurementSystem]['default']);
                e = envVarLimits[element][measurementSystem]['default'];
                window.alert('The value you entered is outside the stardard\'s applicability limits.\nPlease select a value between ' +
                    envVarLimits[element][measurementSystem]['min'] + ' and ' + envVarLimits[element][measurementSystem]['max'] + '.');
            }
        } catch {
        }
        try {
            if (e > envVarLimits[element]['max'] || e < envVarLimits[element]['min']) {
                $('#' + element + i).val(envVarLimits[element]['default']);
                e = envVarLimits[element]['default'];
                window.alert('The value you entered is outside the stardard\'s applicability limits.\nPlease select a value between ' +
                    envVarLimits[element]['min'] + ' and ' + envVarLimits[element]['max'] + '.');
            }
        } catch {
        }

        // store the value into json
        d[element] = parseFloat(e);
    });

    if (d.clo > 0.7 || d.met > 1.3) {
        const select = document.getElementById("local-control");
        select.selectedIndex = 1;
        $('#local-control-button').hide();
    } else {
        $('#local-control-button').show();
    }

}