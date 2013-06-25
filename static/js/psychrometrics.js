var psy = psy || {};

if (typeof module !== 'undefined' && module.exports) {
  module.exports.psy = psy
}
 
psy.PROP = {
    Patm: 101325.0,
    CpAir: 1004.0,
    CpWat: 4186.0,
    CpVap: 1805.0,
    Hfg: 2501000.0,
    RAir: 287.055,
    TKelConv: 273.15
};

psy.PREC = {
    rh: 0,
    wetbulb: 1,
    w: 3,
    dewpoint: 1,
    vappress: 1
};

psy.convert = function(x, tdb, origin, target) {
    switch (origin) {
        case 'rh':
            a = this.tdb_rh(tdb, x);
            break;
        case 'wetbulb':
            a = this.tdb_twb(tdb, x);
            break;
        case 'w':
            a = this.tdb_w(tdb, x);
            break;
        case 'dewpoint':
            a = this.tdb_dewpoint(tdb, x);
            break;
        case 'vappress':
            a = this.tdb_vappress(tdb, x);
            break;
    }
    switch (target) {
        case 'rh':
            return a.rh;
        case 'wetbulb':
            return a.wetbulb;
        case 'w':
            return a.w;
        case 'dewpoint':
            return a.dewpoint;
        case 'vappress':
            return a.vappress;
    }
}

psy.tdb_rh = function(tdb, rh) {
    var a = {};
    var psat = this.satpress(tdb);

    a.rh = parseFloat(rh);
    a.vappress = rh / 100 * psat;
    a.w = this.humratio(this.PROP.Patm, a.vappress);
    a.wetbulb = this.wetbulb(tdb, a.w);
    a.dewpoint = this.dewpoint(a.w);
    return a;
}

psy.tdb_twb = function(tdb, twb) {
    var a = {};
    var psat = this.satpress(twb);
    var PROP = this.PROP;
    var wstar = this.humratio(PROP.Patm, psat);

    a.wetbulb = twb;
    a.w = ((PROP.Hfg + (PROP.CpVap - PROP.CpWat) * twb) * wstar - PROP.CpAir * (tdb - twb)) / (PROP.Hfg + PROP.CpVap * tdb - PROP.CpWat * twb);
    psat = this.satpress(tdb);
    a.rh = 100 * this.relhum(PROP.Patm, psat, a.w);
    a.dewpoint = this.dewpoint(a.w);
    a.vappress = a.rh / 100 * psat;

    return a;
}

psy.tdb_w = function(tdb, w) {
    var a = {};
    var psat = this.satpress(tdb);

    a.w = w;
    a.rh = 100 * psy.relhum(this.PROP.Patm, psat, w);
    if (a.rh > 100) a.rh = Number.NaN
    a.wetbulb = this.wetbulb(tdb, w);
    a.dewpoint = this.dewpoint(w);
    a.vappress = a.rh / 100 * psat;

    return a;
}

psy.tdb_dewpoint = function(tdb, dewpoint) {
    var w_l = 0.00001,
        w_r = 0.2,
        eps = 0.0001;
    var fn = function(w) {
        var dpstar = psy.dewpoint(w);
        return dewpoint - dpstar;
    }
    var w = util.bisect(w_l, w_r, fn, eps, 0);
    return psy.tdb_w(tdb, w);
}

psy.tdb_vappress = function(tdb, vappress) {
    var psat = this.satpress(tdb);
    var rh = 100 * vappress / psat;

    return psy.tdb_rh(tdb, rh);
}

psy.drybulb = function(h, w) {
    var PROP = this.PROP;
    return (H - PROP.Hfg * w) / (PROP.CpAir + PROP.CpVap * w);
}

psy.wetbulb = function(tdb, w) {
    var psatStar, wStar, fn, eps = 0.01,
        wetbulb_l = -100,
        wetbulb_r = 200;
    var PROP = this.PROP;

    fn = function(t) {
        psatStar = psy.satpress(t);
        wStar = psy.humratio(PROP.Patm, psatStar);
        newW = ((PROP.Hfg - PROP.CpWat - PROP.CpVap * t) * wStar - PROP.CpAir * (tdb - t)) / (PROP.Hfg + PROP.CpVap * tdb - PROP.CpWat * t);
        return (w - newW);
    }
    return util.bisect(wetbulb_l, wetbulb_r, fn, eps, 0);
}

psy.satpress = function(tdb) {
    var tKel = tdb + this.PROP.TKelConv,
        C1 = -5674.5359,
        C2 = 6.3925247,
        C3 = -0.9677843 * Math.pow(10, -2),
        C4 = 0.62215701 * Math.pow(10, -6),
        C5 = 0.20747825 * Math.pow(10, -8),
        C6 = -0.9484024 * Math.pow(10, -12),
        C7 = 4.1635019,
        C8 = -5800.2206,
        C9 = 1.3914993,
        C10 = -0.048640239,
        C11 = 0.41764768 * Math.pow(10, -4),
        C12 = -0.14452093 * Math.pow(10, -7),
        C13 = 6.5459673,
        pascals;

    if (tKel < 273.15) {
        pascals = Math.exp(C1 / tKel + C2 + tKel * (C3 + tKel * (C4 + tKel * (C5 + C6 * tKel))) + C7 * Math.log(tKel));
    } else if (tKel >= 273.15) {
        pascals = Math.exp(C8 / tKel + C9 + tKel * (C10 + tKel * (C11 + tKel * C12)) + C13 * Math.log(tKel));
    }
    return pascals;
}

psy.relhum = function(patm, psat, humRatio) {
    var pw, rh;
    pw = patm * humRatio / (0.62198 + humRatio);
    rh = pw / psat;
    return rh;
}

psy.humratio = function(patm, pw) {
    // ASHRAE Fundamentals 2009: 0.621945
    return 0.62198 * pw / (patm - pw);
}

psy.enthalpy = function(tdb, w) {
    var hDryAir, hSatVap, h;
    var PROP = this.PROP;
    hDryAir = PROP.CpAir * tdb;
    hSatVap = PROP.Hfg + PROP.CpVap * tdb;
    h = hDryAir + w * hSatVap;
    return h;
}

psy.rhodry = function(tdb, w) {
    var PROP = this.PROP;
    var pAir = 0.62198 * PROP.Patm / (0.62198 + w)
    return pAir / PROP.RAir / (tdb + PROP.TKelConv);
}

psy.rhomoist = function(rhodry, w) {
    return rhodry * (1 + w);
}

psy.enthsat = function(tdb) {
    var psat = this.satpress(tdb);
    var w = this.humratio(this.PROP.Patm, psat);

    return this.enthalpy(tdb, w);
}

psy.dewpoint = function(w) {
    var pw = this.PROP.Patm * w / (0.62198 + w);

    return this.sattemp(pw);
}

psy.sattemp = function(p) {
    var tsat_l = 0,
        tsat_r = 500,
        eps = 0.0001,
        psat;
    var fn = function(t) {
        return (p - psy.satpress(t));
    }

    return util.bisect(tsat_l, tsat_r, fn, eps, 0);
}

psy.tairsat = function(hsat) {
    var tsat_l = 0,
        tsat_r = 1000,
        eps = 0.01;
    var fn = function(t) {
        return (hsat - psy.enthsat(t));
    }
    return util.bisect(tsat_l, tsat_r, fn, eps, 0);
}

psy.globetemp = function(ta, vel, tglobe, diameter, emissivity) {
    pow = Math.pow;
    return pow(pow(tglobe + 273, 4) + (1.1 * pow(10, 8) * pow(vel, 0.6)) / (emissivity * pow(diameter, 0.4)) * (tglobe - ta), 0.25) - 273;
}
