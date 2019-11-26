function find_span(arr, x) {
    // for ordered array arr and value x, find the left index
    // of the closed interval that the value falls in.
    for (var i = 0; i < arr.length - 1; i++) {
        if (x <= arr[i + 1] && x >= arr[i]) {
            return i;
        }
    }
    return -1;
}

function get_fp(alt, az, posture) {
    //  This function calculates the projected sunlit fraction (fp)
    //  given a seated or standing posture, a solar altitude, and a
    //  solar horizontal angle relative to the person (SHARP). fp
    //  values are taken from Thermal Comfort, Fanger 1970, Danish
    //  Technical Press.

    //  alt : altitude of sun in degrees [0, 90] Integer
    //  az : azimuth of sun in degrees [0, 180] Integer

    if (posture === 'standing' || posture === 'supine') {
        var fp_table = [[0.25, 0.25, 0.23, 0.19, 0.15, 0.10, 0.06],
            [0.25, 0.25, 0.23, 0.18, 0.15, 0.10, 0.06],
            [0.24, 0.24, 0.22, 0.18, 0.14, 0.10, 0.06],
            [0.22, 0.22, 0.20, 0.17, 0.13, 0.09, 0.06],
            [0.21, 0.21, 0.18, 0.15, 0.12, 0.08, 0.06],
            [0.18, 0.18, 0.17, 0.14, 0.11, 0.08, 0.06],
            [0.17, 0.17, 0.16, 0.13, 0.11, 0.08, 0.06],
            [0.18, 0.18, 0.16, 0.13, 0.11, 0.08, 0.06],
            [0.20, 0.20, 0.18, 0.15, 0.12, 0.08, 0.06],
            [0.22, 0.22, 0.20, 0.16, 0.13, 0.09, 0.06],
            [0.24, 0.24, 0.21, 0.17, 0.13, 0.09, 0.06],
            [0.25, 0.25, 0.22, 0.18, 0.14, 0.09, 0.06],
            [0.25, 0.25, 0.22, 0.18, 0.14, 0.09, 0.06]];
    } else if (posture === 'seated') {
        var fp_table = [[0.20, 0.23, 0.21, 0.21, 0.18, 0.16, 0.12],
            [0.20, 0.23, 0.20, 0.20, 0.20, 0.19, 0.16, 0.12],
            [0.20, 0.23, 0.21, 0.20, 0.18, 0.15, 0.12],
            [0.19, 0.23, 0.20, 0.20, 0.18, 0.15, 0.12],
            [0.18, 0.21, 0.19, 0.19, 0.17, 0.14, 0.12],
            [0.16, 0.20, 0.18, 0.18, 0.16, 0.13, 0.12],
            [0.15, 0.18, 0.17, 0.17, 0.15, 0.13, 0.12],
            [0.16, 0.18, 0.16, 0.16, 0.14, 0.13, 0.12],
            [0.18, 0.18, 0.16, 0.14, 0.14, 0.12, 0.12],
            [0.19, 0.18, 0.15, 0.13, 0.13, 0.12, 0.12],
            [0.21, 0.18, 0.14, 0.12, 0.12, 0.12, 0.12],
            [0.21, 0.17, 0.13, 0.11, 0.11, 0.12, 0.12],
            [0.21, 0.17, 0.12, 0.11, 0.11, 0.11, 0.12]];
    }

    if (posture == 'supine') {
        // transpose alt and az for a supine person
        alt_temp = alt;
        alt = Math.abs(90 - az)
        az = alt_temp;
    }

    var fp;
    var alt_range = [0, 15, 30, 45, 60, 75, 90];
    var az_range = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

    var alt_i = find_span(alt_range, alt);
    var az_i = find_span(az_range, az);

    var fp11 = fp_table[az_i][alt_i];
    var fp12 = fp_table[az_i][alt_i + 1];
    var fp21 = fp_table[az_i + 1][alt_i];
    var fp22 = fp_table[az_i + 1][alt_i + 1];

    var az1 = az_range[az_i];
    var az2 = az_range[az_i + 1];
    var alt1 = alt_range[alt_i];
    var alt2 = alt_range[alt_i + 1];

    // bilinear interpolation
    fp = fp11 * (az2 - az) * (alt2 - alt);
    fp += fp21 * (az - az1) * (alt2 - alt);
    fp += fp12 * (az2 - az) * (alt - alt1);
    fp += fp22 * (az - az1) * (alt - alt1);
    fp /= (az2 - az1) * (alt2 - alt1);

    return fp;
}

function get_fp_real(alt, az, posture) {
    //  alt : altitude of sun in degrees [0, 90] Integer
    //  az : azimuth of sun in degrees [0, 180] Integer

    if (posture == 'standing' | posture == 'supine') {
        var fp_table = [[0.25375, 0.25375, 0.22765, 0.18705, 0.14935, 0.1044, 0.05945],
            [0.24795, 0.24795, 0.22475, 0.1827, 0.145, 0.1015, 0.05945],
            [0.23925, 0.23925, 0.2175, , 0.1769, 0.13775, 0.0957, 0.05945],
            [0.22475, 0.22475, 0.199375, 0.1653, 0.126875, 0.0899, 0.05945],
            [0.205175, 0.205175, 0.181975, 0.1508, , 0.116, 0.08265, 0.05945],
            [0.1827, 0.1827, 0.1653, 0.1363, 0.10875, 0.0783, 0.05945],
            [0.16675, 0.16675, 0.15515, 0.1305, 0.1073, 0.0783, 0.05945],
            [0.17545, 0.17545, 0.16095, 0.1305, 0.110925, 0.0812, 0.05945],
            [0.19865, 0.19865, 0.177625, 0.147175, 0.119625, 0.0841, 0.05945],
            [0.2204, 0.2204, 0.19575, 0.1595, 0.12615, 0.087725, 0.05945],
            [0.2378, 0.2378, 0.21025, 0.16965, 0.132675, 0.090625, 0.05945],
            [0.2494, 0.2494, 0.2204, 0.1769, 0.13775, 0.0928, 0.05945],
            [0.251575, 0.251575, 0.2233, 0.17835, 0.138475, 0.0928, 0.05945]];
    } else if (posture == 'seated') {
        var fp_table = [[0.20184, 0.225504, 0.21228, 0.210888, 0.182352, 0.155904, 0.123192],
            [0.203232, 0.228288, 0.204624, 0.200448, 0.186528, 0.157992, 0.123192],
            [0.200448, 0.231072, 0.207408, 0.20184, 0.183744, 0.154512, 0.123192],
            [0.190704, 0.226896, 0.204624, 0.201144, 0.175392, 0.148944, 0.123192],
            [0.176784, 0.214368, 0.19488, 0.192096, 0.167736, 0.140592, 0.123192],
            [0.16008, 0.196272, 0.182352, 0.18096, 0.162168, 0.134328, 0.123192],
            [0.150336, 0.18096, 0.172608, 0.169824, 0.15312, 0.129456, 0.123192],
            [0.162864, 0.179568, 0.164256, 0.157992, 0.144768, 0.12528, 0.123192],
            [0.182352, 0.18096, 0.155904, 0.144768, 0.136416, 0.122496, 0.123192],
            [0.19488, 0.18096, 0.14616, 0.133632, 0.128064, 0.11832, 0.123192],
            [0.207408, 0.178176, 0.135024, 0.121104, 0.116928, 0.116928, 0.123192],
            [0.212976, 0.174, 0.12528, 0.108576, 0.108576, 0.115536, 0.123192],
            [0.2088, 0.16704, 0.116928, 0.105792, 0.105792, 0.114144, 0.123192]];
    }

    if (posture == 'supine') {
        // transpose alt and az for a supine person
        alt_temp = alt;
        alt = Math.abs(90 - az)
        az = alt_temp;
    }

    var fp;
    var alt_range = [0, 15, 30, 45, 60, 75, 90];
    var az_range = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

    var alt_i = find_span(alt_range, alt);
    var az_i = find_span(az_range, az);

    var fp11 = fp_table[az_i][alt_i];
    var fp12 = fp_table[az_i][alt_i + 1];
    var fp21 = fp_table[az_i + 1][alt_i];
    var fp22 = fp_table[az_i + 1][alt_i + 1];

    var az1 = az_range[az_i];
    var az2 = az_range[az_i + 1];
    var alt1 = alt_range[alt_i];
    var alt2 = alt_range[alt_i + 1];

    // bilinear interpolation
    fp = fp11 * (az2 - az) * (alt2 - alt);
    fp += fp21 * (az - az1) * (alt2 - alt);
    fp += fp12 * (az2 - az) * (alt - alt1);
    fp += fp22 * (az - az1) * (alt - alt1);
    fp /= (az2 - az1) * (alt2 - alt1);

    return fp;
}

function ERF(alt, az, posture, Idir, tsol, fsvv, fbes, asa, tsol_factor) {
    //  ERF function to estimate the impact of solar radiation on occupant comfort
    //  INPUTS:
    //  alt : altitude of sun in degrees [0, 90]
    //  az : azimuth of sun in degrees [0, 180]
    //  posture: posture of occupant ('seated', 'standing', or 'supine')
    //  Idir : direct beam intensity (normal)
    //  tsol: total solar transmittance (SC * 0.87)
    //  fsvv : sky vault view fraction : fraction of sky vault in occupant's view [0, 1]
    //  fbes : fraction body exposed to sun [0, 1]
    //  asa : avg shortwave abs : average shortwave absorptivity of body [0, 1]
    //  tsol_factor : (optional) correction to tsol based on angle of incidence

    if (tsol_factor === undefined) {
        tsol_factor = 1.0;
    }

    var DEG_TO_RAD = 0.0174532925;
    var hr = 6;
    var Idiff = 0.2 * Idir;

    // Floor reflectance
    var Rfloor = 0.6;

    var fp = get_fp(alt, az, posture);

    if (posture === 'standing' || posture === 'supine') {
        var feff = 0.725;
    } else if (posture === 'seated') {
        var feff = 0.696;
    } else {
        return;
    }

    var sw_abs = asa;
    var lw_abs = 0.95;

    var E_diff = feff * fsvv * 0.5 * tsol * Idiff;
    var E_direct = fp * tsol * fbes * Idir;
    var E_refl = feff * fsvv * 0.5 * tsol * (Idir * Math.sin(alt * DEG_TO_RAD) + Idiff) * Rfloor;

    var E_solar = E_diff + E_direct + E_refl;
    var ERF = E_solar * (sw_abs / lw_abs);
    var dMRT = ERF / (hr * feff);

    return {"ERF": ERF, "dMRT": dMRT};
}

function ERF_test() {

    // alt,az,posture,Idir,tsol,fsvv,fbes,asa
    var v = [[0, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [60, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [90, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 0, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 30, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 60, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 90, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 150, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 180, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "standing", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 400, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 600, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 1000, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.1, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.3, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.7, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.1, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.3, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.7, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.1, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.3, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.7, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.3],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.5],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.9],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7],
        [30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7]];

    var res = [[26.872926315789474, 6.435087719298245],
        [53.9686502136441, 12.923527350010561],
        [57.258821052631575, 13.711403508771928],
        [50.83547366394898, 12.173245609183185],
        [50.11749471658056, 12.00131578462178],
        [48.27126313763319, 11.559210521463886],
        [44.989073663948986, 10.773245609183187],
        [39.450378927106875, 9.446929819709501],
        [36.78359997973846, 8.808333328481432],
        [46.54309208415738, 10.69956139865687],
        [21.263715779342913, 5.091885962486329],
        [31.895573669014375, 7.637828943729495],
        [53.1592894483573, 12.729714906215827],
        [8.505486311737165, 2.036754384994532],
        [25.516458935211496, 6.1102631549835955],
        [59.538404182160164, 14.257280694961725],
        [26.885747364368743, 6.438157893766461],
        [34.70658946152729, 8.310964909369561],
        [50.34827365584437, 12.05657894057576],
        [24.14717050605425, 5.78236841620073],
        [33.33730103237004, 7.9830701705866955],
        [51.71756208500161, 12.384473679358623],
        [18.22604209657964, 4.364473682131139],
        [30.376736827632733, 7.274122803551899],
        [54.67812628973893, 13.09342104639342],
        [30.4756420974907, 7.297807015682638],
        [36.50153682808826, 8.740789470327648],
        [42.52743155868583, 10.183771924972659],
        [48.55332628928339, 11.626754379617669]]

    var pass = true;
    var eps = 0.01;
    for (var i = 0; i < v.length; i++) {
        var my_erf = ERF(v[i][0], v[i][1], v[i][2], v[i][3], v[i][4], v[i][5], v[i][6], v[i][7])
        var my_res = res[i];
        var delta_erf = my_erf[0] - res[0];
        var delta_dMRT = my_erf[1] - res[1];
        if (delta_erf > eps) {
            pass = false;
        }
        if (delta_dMRT > eps) {
            pass = false;
        }
    }
}
