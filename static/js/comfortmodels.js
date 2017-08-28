var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var comf = comf || {}

if (typeof module !== 'undefined' && module.exports) {
  var psy = require('./psychrometrics.js').psy
  var util = require('./util.js').util
  module.exports.comf = comf;
}

comf.validation_table = function(){
  var cases = [
      [25, 25, 0.15, 50, 1, 0.5],
      [0, 25, 0.15, 50, 1, 0.5],
      [10, 25, 0.15, 50, 1, 0.5],
      [15, 25, 0.15, 50, 1, 0.5],
      [20, 25, 0.15, 50, 1, 0.5],
      [30, 25, 0.15, 50, 1, 0.5],
      [40, 25, 0.15, 50, 1, 0.5],
      [25, 25, 0.15, 10, 1, 0.5],
      [25, 25, 0.15, 90, 1, 0.5],
      [25, 25, 0.1, 50, 1, 0.5],
      [25, 25, 0.6, 50, 1, 0.5],
      [25, 25, 1.1, 50, 1, 0.5],
      [25, 25, 3.0, 50, 1, 0.5],
      [25, 10, 0.15, 50, 1, 0.5],
      [25, 40, 0.15, 50, 1, 0.5],
      [25, 25, 0.15, 50, 1, 0.1],
      [25, 25, 0.15, 50, 1, 1],
      [25, 25, 0.15, 50, 1, 2],
      [25, 25, 0.15, 50, 1, 4],
      [25, 25, 0.15, 50, 0.8, 0.5],
      [25, 25, 0.15, 50, 2, 0.5],
      [25, 25, 0.15, 50, 4, 0.5]
  ]
  for (var i = 0; i < cases.length; i++){
    var c = cases[i];
    var s = comf.pmvElevatedAirspeed(c[0], c[1], c[2], c[3], c[4], c[5], 0);
    console.log(s.set, util.CtoF(s.set))
  }
}

comf.calc_set_contours = function(still_air_threshold, clo) {

    comf.still_air_threshold = still_air_threshold;
    var hr = 0.01;
    var met = 1.1;
    var vel = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
   
    // first, solve for t_op where pmv = -0.5 at still air;

    var fn = function(t){
        var rh = psy.convert(hr, t, 'w', 'rh');
        var pmv = comf.pmv(t, t, 0.1, rh, met, clo, 0);
        return pmv.pmv;
    };
    var eps = 0.01;
    var t_op_L = util.bisect(15, 40, fn, eps, -0.5);
    var t_op_R = util.bisect(15, 40, fn, eps, 0.5);
    console.log(t_op_L, t_op_R);

    var rh_L = psy.convert(hr, t_op_L, 'w', 'rh');
    var set0_L = comf.pierceSET(t_op_L, t_op_L, 0.1, rh_L, met, clo, 0);
    var rh_R = psy.convert(hr, t_op_R, 'w', 'rh');
    var set0_R = comf.pierceSET(t_op_R, t_op_R, 0.1, rh_R, met, clo, 0);

    var a = {'clo': clo, 'still_air': still_air_threshold, 'contour_L': [], 'contour_R': []};
     
    for (var i = 0; i < vel.length; i++){
        var vel_i = vel[i];
        var fn_set = function(t){
            var rh = psy.convert(hr, t, 'w', 'rh');
            var set = comf.pierceSET(t, t, vel_i, rh, met, clo, 0);
            return set;
        }

        var LL = util.bisect(15, 40, fn_set, eps, set0_L);
        var RR = util.bisect(15, 40, fn_set, eps, set0_R);
        a.contour_L.push(LL);
        a.contour_R.push(RR);
    }
    return a;
}

comf.go = function(){
    var r = []
    r[0] = comf.calc_set_contours(0.1, 0.5);
    r[1] = comf.calc_set_contours(0.1, 1.0);
    r[2] = comf.calc_set_contours(0.15, 0.5);
    r[3] = comf.calc_set_contours(0.15, 1.0);
    r[4] = comf.calc_set_contours(0.2, 0.5);
    r[5] = comf.calc_set_contours(0.2, 1.0);
    return r;
}

comf.still_air_threshold = 0.1; // m/s

comf.test = function() {
    // reproduces the bug related to sweat saturation and heat loss from skin
    met_values = [1.7, 1.71, 1.72, 1.73, 1.74, 1.75, 1.76, 1.77, 1.78, 1.79, 1.8, 1.81, 1.82, 1.83, 1.84, 1.85, 1.86, 1.87, 1.88, 1.89, 1.9];
    for (var i = 0; i < met_values.length; i++){
        console.log("MET:", met_values[i]);
        var x = comf.pierceSET(34, 34, 4, 80, met_values[i], 0.4, 0) // not normal
        //var x = comf.pierceSET(34.08, 34.08, 4, 80, met_values[i], 0.4, 0) // normal
        console.log(x)
    }
}

comf.between = function (x, l, r) {
    return (x > l && x < r);
}

comf.globeTemperature = function(tw, tr, ta) {
    // calculate composite globe temperature
    return 0.7 * tw + 0.2 * tr + 0.1 * ta;
}

comf.adaptiveComfortASH55 = function(ta, tr, runningMean, vel) {
    var r = {}
    var to = (ta + tr) / 2;
    var coolingEffect = 0;
    if (vel > 0.3 & to >= 25) {
        // calculate cooling effect of elevated air speed
        // when top > 25 degC.
        switch (vel) {
            case 0.6:
                coolingEffect = 1.2
                break
            case 0.9:
                coolingEffect = 1.8
                break
            case 1.2:
                coolingEffect = 2.2
                break
        }
    }
    var tComf = 0.31 * runningMean + 17.8;
    r.tComf80Lower = tComf - 3.5;
    r.tComf80Upper = tComf + 3.5 + coolingEffect;
    r.tComf90Lower = tComf - 2.5;
    r.tComf90Upper = tComf + 2.5 + coolingEffect;
    var acceptability80, acceptability90;

    if (comf.between(to, r.tComf90Lower, r.tComf90Upper)) {
        // compliance at 80% and 90% levels
        acceptability80 = acceptability90 = true;
    } else if (comf.between(to, r.tComf80Lower, r.tComf80Upper)) {
        // compliance at 80% only
        acceptability80 = true;
        acceptability90 = false;
    } else {
        // neither
        acceptability80 = acceptability90 = false;
    }
    r.acceptability90 = acceptability90;
    r.acceptability80 = acceptability80;
    return r
}

comf.pmvElevatedAirspeed = function(ta, tr, vel, rh, met, clo, wme) {
    // returns pmv at elevated airspeed (> comf.still_air_threshold)
    var r = {}
    var set = comf.pierceSET(ta, tr, vel, rh, met , clo, wme);
    if (vel <= comf.still_air_threshold) {
        var pmv = comf.pmv(ta, tr, vel, rh, met, clo, wme)
        var ta_adj = ta
        var ce = 0
    } else {
        var ce_l = 0;
        var ce_r = 40;
        var eps = 0.001;  // precision of ce
        var fn = function(ce){
            return (set - comf.pierceSET(ta - ce, tr - ce, comf.still_air_threshold, rh, met, clo, wme));
        };
        var ce = util.secant(ce_l, ce_r, fn, eps);
        if (isNaN(ce)) {
            ce = util.bisect(ce_l, ce_r, fn, eps, 0);
        }
        var pmv = comf.pmv(ta - ce, tr - ce, comf.still_air_threshold, rh, met, clo, wme);
    }
    r.pmv = pmv.pmv;
    r.ppd = pmv.ppd;
    r.set = set;
    r.ta_adj = ta - ce;
    r.tr_adj = tr - ce;
    r.cooling_effect = ce;
    return r
}

comf.pmv = function(ta, tr, vel, rh, met, clo, wme) {
    // returns [pmv, ppd]
    // ta, air temperature (°C)
    // tr, mean radiant temperature (°C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)

    var pa, icl, m, w, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * exp(16.6536 - 4030.183 / (ta + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    m = met * 58.15; //metabolic rate in W/M2
    w = wme * 58.15; //external work in W/M2
    mw = m - w; //internal heat production in the human body
    if (icl <= 0.078) fcl = 1 + (1.29 * icl);
    else fcl = 1.05 + (0.645 * icl);

    //heat transf. coeff. by forced convection
    hcf = 12.1 * sqrt(vel);
    taa = ta + 273;
    tra = tr + 273;
    tcla = taa + (35.5 - ta) / (3.5 * icl + 0.1);

    p1 = icl * fcl;
    p2 = p1 * 3.96;
    p3 = p1 * 100;
    p4 = p1 * taa;
    p5 = 308.7 - 0.028 * mw + p2 * pow(tra / 100, 4);
    xn = tcla / 100;
    xf = tcla / 50;
    eps = 0.00015;

    n = 0;
    while (abs(xn - xf) > eps) {
        xf = (xf + xn) / 2;
        hcn = 2.38 * pow(abs(100.0 * xf - taa), 0.25);
        if (hcf > hcn) hc = hcf;
        else hc = hcn;
        xn = (p5 + p4 * hc - p2 * pow(xf, 4)) / (100 + p3 * hc);
        ++n;
        if (n > 150) {
            alert('Max iterations exceeded');
            return 1;
        }
    }

    tcl = 100 * xn - 273;

    // heat loss diff. through skin 
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa);
    // heat loss by sweating
    if (mw > 58.15) hl2 = 0.42 * (mw - 58.15);
    else hl2 = 0;
    // latent respiration heat loss 
    hl3 = 1.7 * 0.00001 * m * (5867 - pa);
    // dry respiration heat loss
    hl4 = 0.0014 * m * (34 - ta);
    // heat loss by radiation  
    hl5 = 3.96 * fcl * (pow(xn, 4) - pow(tra / 100, 4));
    // heat loss by convection
    hl6 = fcl * hc * (tcl - ta);

    ts = 0.303 * exp(-0.036 * m) + 0.028;
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
    ppd = 100.0 - 95.0 * exp(-0.03353 * pow(pmv, 4.0) - 0.2179 * pow(pmv, 2.0));

    var r = {}
    r.pmv = pmv;
    r.ppd = ppd;

    return r
}

comf.FindSaturatedVaporPressureTorr = function(T) {
    //calculates Saturated Vapor Pressure (Torr) at Temperature T  (C)
    return exp(18.6686 - 4030.183 / (T + 235.0));
}

comf.pierceSET = function(ta, tr, vel, rh, met, clo, wme) {

    var TempSkinNeutral, TempBodyNeutral, SkinBloodFlowNeutral, TempSkin, TempCore,
    SkinBloodFlow, MSHIV, ALFA, ESK, PressureInAtmospheres, TIMEH, LTIME, DELTA, RCL,
    FACL, LR, RM, M, WCRIT, ICL, CHC, CHCA, CHCV, CHR, CTC, TOP, TCL, DRY, HFCS, ERES,
    CRES, SCR, SSK, TCSK, TB, SKSIG, WARMS, COLDS, WARMC, COLDC, CRSIG, WARMB, COLDB,
    REGSW, BDSIG, REA, RECL, EMAX, PRSW, PWET, EDIF, RA, TCL_OLD, TCCR, DTSK, DTCR, ERSW,
    X, X_OLD, CHCS, TIM, STORE, HSK, RN, ECOMF, EREQ, HD, HE, W, PSSK, CHRS, CTCS,
    RCLOS, RCLS, FACLS, FCLS, IMS, ICLS, RAS, REAS, RECLS, HD_S, HE_S;

    var VaporPressure = rh * comf.FindSaturatedVaporPressureTorr(ta) / 100;
    var AirVelocity = max(vel, 0.1);
    var KCLO = 0.25;
    var BODYWEIGHT = 69.9;
    var BODYSURFACEAREA = 1.8258;
    var METFACTOR = 58.2;
    var SBC = 0.000000056697; // Stefan-Boltzmann constant (W/m2K4)
    var CSW = 170;
    var CDIL = 120;
    var CSTR = 0.5;

    TempSkinNeutral = 33.7; //setpoint (neutral) value for Tsk
    TempCoreNeutral = 36.49; //setpoint value for Tcr
    TempBodyNeutral = 36.49; //setpoint for Tb (.1*TempSkinNeutral + .9*TempCoreNeutral)
    SkinBloodFlowNeutral = 6.3; //neutral value for SkinBloodFlow

    //INITIAL VALUES - start of 1st experiment
    TempSkin = TempSkinNeutral;
    TempCore = TempCoreNeutral;
    SkinBloodFlow = SkinBloodFlowNeutral;
    MSHIV = 0.0;
    ALFA = 0.1;
    ESK = 0.1 * met;

    //Start new experiment here (for graded experiments)
    //UNIT CONVERSIONS (from input variables)

    var p = psy.PROP.Patm / 1000; // TH : interface?

    PressureInAtmospheres = p * 0.009869;
    LTIME = 60.0;
    TIMEH = LTIME / 60.0;
    RCL = 0.155 * clo;
    // AdjustICL(RCL, Conditions);  TH: I don't think this is used in the software

    FACL = 1.0 + 0.15 * clo; //% INCREASE IN BODY SURFACE AREA DUE TO CLOTHING
    LR = 2.2 / PressureInAtmospheres; //Lewis Relation is 2.2 at sea level
    RM = met * METFACTOR;
    M = met * METFACTOR;

    if (clo <= 0) {
        WCRIT = 0.38 * pow(AirVelocity, -0.29);
        ICL = 1.0;
    } else {
        WCRIT = 0.59 * pow(AirVelocity, -0.08);
        ICL = 0.45;
    }

    CHC = 3.0 * pow(PressureInAtmospheres, 0.53);
    CHCV = 8.600001 * pow((AirVelocity * PressureInAtmospheres), 0.53);
    CHC = max(CHC, CHCV);

    //initial estimate of Tcl
    CHR = 4.7;
    CTC = CHR + CHC;
    RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
    TOP = (CHR * tr + CHC * ta) / CTC;
    TCL = TOP + (TempSkin - TOP) / (CTC * (RA + RCL));

    // ========================  BEGIN ITERATION
    //
    // Tcl and CHR are solved iteratively using: H(Tsk - To) = CTC(Tcl - To),
    //  where H = 1/(Ra + Rcl) and Ra = 1/Facl*CTC
    //

    TCL_OLD = TCL;
    var flag = true;
    for (TIM = 1; TIM <= LTIME; TIM++) {
        do {
            if (flag) {
                TCL_OLD = TCL;
                CHR = 4.0 * SBC * pow(((TCL + tr) / 2.0 + 273.15), 3.0) * 0.72;
                CTC = CHR + CHC;
                RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
                TOP = (CHR * tr + CHC * ta) / CTC;
            }
            TCL = (RA * TempSkin + RCL * TOP) / (RA + RCL);
            flag = true;
        } while (abs(TCL - TCL_OLD) > 0.01);
        flag = false;
        DRY = (TempSkin - TOP) / (RA + RCL);
        HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
        ERES = 0.0023 * M * (44.0 - VaporPressure);
        CRES = 0.0014 * M * (34.0 - ta);
        SCR = M - HFCS - ERES - CRES - wme;
        SSK = HFCS - DRY - ESK;
        TCSK = 0.97 * ALFA * BODYWEIGHT;
        TCCR = 0.97 * (1 - ALFA) * BODYWEIGHT;
        DTSK = (SSK * BODYSURFACEAREA) / (TCSK * 60.0); //deg C per minute
        DTCR = SCR * BODYSURFACEAREA / (TCCR * 60.0); //deg C per minute
        TempSkin = TempSkin + DTSK;
        TempCore = TempCore + DTCR;
        TB = ALFA * TempSkin + (1 - ALFA) * TempCore;
        SKSIG = TempSkin - TempSkinNeutral;
        WARMS = (SKSIG > 0) * SKSIG;
        COLDS = ((-1.0 * SKSIG) > 0) * (-1.0 * SKSIG);
        CRSIG = (TempCore - TempCoreNeutral);
        WARMC = (CRSIG > 0) * CRSIG;
        COLDC = ((-1.0 * CRSIG) > 0) * (-1.0 * CRSIG);
        BDSIG = TB - TempBodyNeutral;
        WARMB = (BDSIG > 0) * BDSIG;
        COLDB = ((-1.0 * BDSIG) > 0) * (-1.0 * BDSIG);
        SkinBloodFlow = (SkinBloodFlowNeutral + CDIL * WARMC) / (1 + CSTR * COLDS);
        if (SkinBloodFlow > 90.0) SkinBloodFlow = 90.0;
        if (SkinBloodFlow < 0.5) SkinBloodFlow = 0.5;
        REGSW = CSW * WARMB * exp(WARMS / 10.7);
        if (REGSW > 500.0) REGSW = 500.0;
        ERSW = 0.68 * REGSW;
        REA = 1.0 / (LR * FACL * CHC); //evaporative resistance of air layer
        RECL = RCL / (LR * ICL); //evaporative resistance of clothing (icl=.45)
        EMAX = (comf.FindSaturatedVaporPressureTorr(TempSkin) - VaporPressure) / (REA + RECL);
        PRSW = ERSW / EMAX;
        PWET = 0.06 + 0.94 * PRSW;
        EDIF = PWET * EMAX - ERSW;
        ESK = ERSW + EDIF;
        if (PWET > WCRIT) {
            PWET = WCRIT;
            PRSW = WCRIT / 0.94;
            ERSW = PRSW * EMAX;
            EDIF = 0.06 * (1.0 - PRSW) * EMAX;
            ESK = ERSW + EDIF;
        } 
        if (EMAX < 0) {
            EDIF = 0;
            ERSW = 0;
            PWET = WCRIT;
            PRSW = WCRIT;
            ESK = EMAX;
        }
        ESK = ERSW + EDIF;
        MSHIV = 19.4 * COLDS * COLDC;
        M = RM + MSHIV;
        ALFA = 0.0417737 + 0.7451833 / (SkinBloodFlow + .585417);
    }

    //Define new heat flow terms, coeffs, and abbreviations
    STORE = M - wme - CRES - ERES - DRY - ESK; //rate of body heat storage

    HSK = DRY + ESK; //total heat loss from skin
    RN = M - wme; //net metabolic heat production
    ECOMF = 0.42 * (RN - (1 * METFACTOR));
    if (ECOMF < 0.0) ECOMF = 0.0; //from Fanger
    EREQ = RN - ERES - CRES - DRY;
    EMAX = EMAX * WCRIT;
    HD = 1.0 / (RA + RCL);
    HE = 1.0 / (REA + RECL);
    W = PWET;
    PSSK = comf.FindSaturatedVaporPressureTorr(TempSkin);
    // Definition of ASHRAE standard environment... denoted "S"
    CHRS = CHR;
    if (met < 0.85) {
        CHCS = 3.0;
    } else {
        CHCS = 5.66 * pow(((met - 0.85)), 0.39);
        if (CHCS < 3.0) CHCS = 3.0;
    }
    CTCS = CHCS + CHRS;
    RCLOS = 1.52 / ((met - wme / METFACTOR) + 0.6944) - 0.1835;
    RCLS = 0.155 * RCLOS;
    FACLS = 1.0 + KCLO * RCLOS;
    FCLS = 1.0 / (1.0 + 0.155 * FACLS * CTCS * RCLOS);
    IMS = 0.45;
    ICLS = IMS * CHCS / CTCS * (1 - FCLS) / (CHCS / CTCS - FCLS * IMS);
    RAS = 1.0 / (FACLS * CTCS);
    REAS = 1.0 / (LR * FACLS * CHCS);
    RECLS = RCLS / (LR * ICLS);
    HD_S = 1.0 / (RAS + RCLS);
    HE_S = 1.0 / (REAS + RECLS);

    // SET* (standardized humidity, clo, Pb, and CHC)
    // determined using Newton//s iterative solution
    // FNERRS is defined in the GENERAL SETUP section above

    DELTA = .0001;
    var ERR1, ERR2;
    var dx = 100.0;
    X_OLD = TempSkin - HSK / HD_S; //lower bound for SET
    while (abs(dx) > .01) {
        ERR1 = (HSK - HD_S * (TempSkin - X_OLD) - W * HE_S * (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr(X_OLD)));
        ERR2 = (HSK - HD_S * (TempSkin - (X_OLD + DELTA)) - W * HE_S * (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr((X_OLD + DELTA))));
        X = X_OLD - DELTA * ERR1 / (ERR2 - ERR1);
        dx = X - X_OLD;
        X_OLD = X;
    }
    return X;
}

comf.schiavonClo = function(ta6) {
    var clo_r
    if(!isCelsius) ta6 = util.FtoC(ta6)
    if (ta6 < -5) {
        clo_r = 1
    } else if (ta6 < 5) {
        clo_r = 0.818 - 0.0364 * ta6
    } else if (ta6 < 26) {
        clo_r = Math.pow(10, -0.1635 - 0.0066 * ta6)
    } else {
        clo_r = 0.46
    }
    return clo_r
}

comf.adaptiveComfortEN15251 = function(ta, tr, runningMean, vel) {
    var to = (ta + tr) / 2;
    var coolingEffect = 0;
	if (vel >= 0.2 && to > 25) {
	    // calculate cooling effect of elevated air speed
	    // when top > 25 degC.
    var coolingEffect = 1.7856 * Math.log(vel) + 2.9835;
	}
	var tComf = 0.33 * runningMean + 18.8;
	if(runningMean > 15){
	    var tComfILower = tComf - 2;
	    var tComfIUpper = tComf + 2 + coolingEffect;
		var tComfIILower = tComf - 3;
	    var tComfIIUpper = tComf + 3 + coolingEffect;
	    var tComfIIILower = tComf - 4;
	    var tComfIIIUpper = tComf + 4 + coolingEffect;
    } else if (12.73 < runningMean && runningMean < 15){
	    var tComfLow = 0.33 * 15 + 18.8;
		var tComfILower = tComfLow - 2;
	    var tComfIUpper = tComf + 2 + coolingEffect;
		var tComfIILower = tComfLow - 3;
	    var tComfIIUpper = tComf + 3 + coolingEffect;
	    var tComfIIILower = tComfLow - 4;
	    var tComfIIIUpper = tComf + 4 + coolingEffect;
	} else {
		var tComfLow = 0.33 * 15 + 18.8;
		var tComfILower = tComfLow - 2;
	    var tComfIUpper = tComf + 2;
		var tComfIILower = tComfLow - 3;
	    var tComfIIUpper = tComf + 3 + coolingEffect;
	    var tComfIIILower = tComfLow - 4;
	    var tComfIIIUpper = tComf + 4 + coolingEffect;
	}
    var acceptabilityI, acceptabilityII, acceptabilityIII;

    if (comf.between(to, tComfILower, tComfIUpper)) {
        // compliance at all levels
        acceptabilityI = acceptabilityII = acceptabilityIII = true;
    } else if (comf.between(to, tComfIILower, tComfIIUpper)) {
        // compliance at II and III only
        acceptabilityII = acceptabilityIII = true;
        acceptabilityI = false;
	} else if (comf.between(to, tComfIIILower, tComfIIIUpper)) {
        // compliance at III only
        acceptabilityIII = true;
        acceptabilityI = acceptabilityII = false;
    } else {
        // neither
        acceptabilityI = acceptabilityII = acceptabilityIII = false;
    }
    r = {}
    r.acceptabilityI = acceptabilityI
    r.acceptabilityII = acceptabilityII
    r.acceptabilityIII = acceptabilityIII
    r.tComfILower = tComfILower
    r.tComfIILower = tComfIILower
    r.tComfIIILower = tComfIIILower
    r.tComfIUpper = tComfIUpper
    r.tComfIIUpper = tComfIIUpper
    r.tComfIIIUpper = tComfIIIUpper
    return r
    return [[acceptabilityIII, tComfIIILower, tComfIIIUpper],
            [acceptabilityII, tComfIILower, tComfIIUpper],
            [acceptabilityI, tComfILower, tComfIUpper]];
}
