"""
This is a python version of the CBE Comfort tool comfort models.
Also included are functions for polynomial approximations of Universal
Thermal Climate Index (UTCI) for outdoor comfort. The module also includes
functions to calculate humidity ratio and enthalpy from EWP variables so that
these can be used to generate psychrometric charts.
@author Chris Mackey <Chris@MackeyArchitecture.com>
"""

import math

def comfPMVElevatedAirspeed(ta, tr, vel, rh, met, clo, wme):
    """
    This function accepts any input conditions (including low air speeds)
    but will return accurate values if the airspeed is above (>0.15m/s).
    The function will return the following:
    pmv : Predicted mean vote
    ppd : Percent predicted dissatisfied [%]
    ta_adj: Air temperature adjusted for air speed [C]
    cooling_effect : The difference between the air temperature and adjusted
        air temperature [C]
    set: The Standard Effective Temperature [C] (see below)
    """
    r = []
    set = comfPierceSET(ta, tr, vel, rh, met, clo, wme)
    stillAirThreshold = 0.1

    # This function is taken from the util.js script of the CBE comfort tool
    # page and has been modified to include the fn inside the utilSecant function
    def utilSecant(a, b, epsilon):
        # root-finding only
        res = []
        def fn(t):
            return (set - comfPierceSET(ta - t, tr - t, stillAirThreshold, rh, met, clo, wme))

        f1 = fn(a)
        if abs(f1) <= epsilon: res.append(a)
        else:
            f2 = fn(b)
            if abs(f2) <= epsilon: res.append(b)
            else:
                count = range(100)
                for i in count:
                    if (b - a) != 0 and (f2 - f1) != 0:
                        slope = (f2 - f1) / (b - a)
                        c = b - f2 / slope
                        f3 = fn(c)
                        if abs(f3) < epsilon:
                            res.append(c)
                        a = b
                        b = c
                        f1 = f2
                        f2 = f3
            res.append('NaN')

        return res[0]

    # This function is taken from the util.js script of the CBE comfort
    # tool page and has been modified to include the fn inside the
    # function definition.
    def utilBisect(a, b, epsilon, target):
        def fn(t):
            return (set - comfPierceSET(ta - t, tr - t, stillAirThreshold, rh, met, clo, wme))

        while abs(b - a) > (2 * epsilon):
            midpoint = (b + a) / 2
            a_T = fn(a)
            b_T = fn(b)
            midpoint_T = fn(midpoint)
            if (a_T - target) * (midpoint_T - target) < 0: b = midpoint
            elif (b_T - target) * (midpoint_T - target) < 0: a = midpoint
            else: return -999
        return midpoint


    if vel <= stillAirThreshold:
        pmv, ppd = comfPMV(ta, tr, vel, rh, met, clo, wme)
        ta_adj = ta
        ce = 0
    else:
        ce_l = 0
        ce_r = 40
        eps = 0.001  # precision of ce

        ce = utilSecant(ce_l, ce_r, eps)
        if ce == 'NaN':
            ce = utilBisect(ce_l, ce_r, eps, 0)

        pmv, ppd = comfPMV(ta - ce, tr - ce, stillAirThreshold, rh, met, clo, wme)
        ta_adj = ta - ce

    r.append(pmv)
    r.append(ppd)
    r.append(set)
    r.append(ta_adj)
    r.append(ce)

    return r


def comfPMV(ta, tr, vel, rh, met, clo, wme):
    """
    returns [pmv, ppd]
    ta, air temperature (C)
    tr, mean radiant temperature (C)
    vel, relative air velocity (m/s)
    rh, relative humidity (%) Used only this way to input humidity level
    met, metabolic rate (met)
    clo, clothing (clo)
    wme, external work, normally around 0 (met)
    """

    pa = rh * 10 * math.exp(16.6536 - 4030.183 / (ta + 235))

    icl = 0.155 * clo  # thermal insulation of the clothing in M2K/W
    m = met * 58.15  # metabolic rate in W/M2
    w = wme * 58.15  # external work in W/M2
    mw = m - w  # internal heat production in the human body
    if (icl <= 0.078):
        fcl = 1 + (1.29 * icl)
    else:
        fcl = 1.05 + (0.645 * icl)

    # heat transf. coeff. by forced convection
    hcf = 12.1 * math.sqrt(vel)
    taa = ta + 273
    tra = tr + 273
    tcla = taa + (35.5 - ta) / (3.5 * icl + 0.1)

    p1 = icl * fcl
    p2 = p1 * 3.96
    p3 = p1 * 100
    p4 = p1 * taa
    p5 = (308.7 - 0.028 * mw) + (p2 * math.pow(tra / 100, 4))
    xn = tcla / 100
    xf = tcla / 50
    eps = 0.00015

    n = 0
    while abs(xn - xf) > eps:
        xf = (xf + xn) / 2
        hcn = 2.38 * math.pow(abs(100.0 * xf - taa), 0.25)
        if (hcf > hcn):
            hc = hcf
        else:
            hc = hcn
        xn = (p5 + p4 * hc - p2 * math.pow(xf, 4)) / (100 + p3 * hc)
        n += 1
        if (n > 150):
            print 'Max iterations exceeded'
            return 1


    tcl = 100 * xn - 273

    # heat loss diff. through skin
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa)
    # heat loss by sweating
    if mw > 58.15:
        hl2 = 0.42 * (mw - 58.15)
    else:
        hl2 = 0
    # latent respiration heat loss
    hl3 = 1.7 * 0.00001 * m * (5867 - pa)
    # dry respiration heat loss
    hl4 = 0.0014 * m * (34 - ta)
    # heat loss by radiation
    hl5 = 3.96 * fcl * (math.pow(xn, 4) - math.pow(tra / 100, 4))
    # heat loss by convection
    hl6 = fcl * hc * (tcl - ta)

    ts = 0.303 * math.exp(-0.036 * m) + 0.028
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6)
    ppd = 100.0 - 95.0 * math.exp(-0.03353 * pow(pmv, 4.0)
        - 0.2179 * pow(pmv, 2.0))

    r = []
    r.append(pmv)
    r.append(ppd)

    return r


def comfPierceSET(ta, tr, vel, rh, met, clo, wme):
    """
    Function to find the saturation vapor pressure, used frequently
    throughtout the comfPierceSET function.
    """
    res = None

    def findSaturatedVaporPressureTorr(T):
        # calculates Saturated Vapor Pressure (Torr) at Temperature T  (C)
        return math.exp(18.6686 - 4030.183 / (T + 235.0))

    # Key initial variables.
    VaporPressure = (rh * findSaturatedVaporPressureTorr(ta)) / 100
    AirVelocity = max(vel, 0.1)
    KCLO = 0.25
    BODYWEIGHT = 69.9
    BODYSURFACEAREA = 1.8258
    METFACTOR = 58.2
    SBC = 0.000000056697  # Stefan-Boltzmann constant (W/m2K4)
    CSW = 170
    CDIL = 120
    CSTR = 0.5

    TempSkinNeutral = 33.7  # setpoint (neutral) value for Tsk
    TempCoreNeutral = 36.49  # setpoint value for Tcr
    # setpoint for Tb (.1*TempSkinNeutral + .9*TempCoreNeutral)
    TempBodyNeutral = 36.49
    SkinBloodFlowNeutral = 6.3  # neutral value for SkinBloodFlow

    # INITIAL VALUES - start of 1st experiment
    TempSkin = TempSkinNeutral
    TempCore = TempCoreNeutral
    SkinBloodFlow = SkinBloodFlowNeutral
    MSHIV = 0.0
    ALFA = 0.1
    ESK = 0.1 * met

    # Start new experiment here (for graded experiments)
    # UNIT CONVERSIONS (from input variables)

    # This variable is the pressure of the atmosphere in kPa and was taken
    # from the psychrometrics.js file of the CBE comfort tool.
    p = 101325.0 / 1000

    PressureInAtmospheres = p * 0.009869
    LTIME = 60
    TIMEH = LTIME / 60.0
    RCL = 0.155 * clo

    FACL = 1.0 + 0.15 * clo  # INCREASE IN BODY SURFACE AREA DUE TO CLOTHING
    LR = 2.2 / PressureInAtmospheres  # Lewis Relation is 2.2 at sea level
    RM = met * METFACTOR
    M = met * METFACTOR

    if clo <= 0:
        WCRIT = 0.38 * pow(AirVelocity, -0.29)
        ICL = 1.0
    else:
        WCRIT = 0.59 * pow(AirVelocity, -0.08)
        ICL = 0.45

    CHC = 3.0 * pow(PressureInAtmospheres, 0.53)
    CHCV = 8.600001 * pow((AirVelocity * PressureInAtmospheres), 0.53)
    CHC = max(CHC, CHCV)

    # initial estimate of Tcl
    CHR = 4.7
    CTC = CHR + CHC
    RA = 1.0 / (FACL * CTC)  # resistance of air layer to dry heat transfer
    TOP = (CHR * tr + CHC * ta) / CTC
    TCL = TOP + (TempSkin - TOP) / (CTC * (RA + RCL))

    # ========================  BEGIN ITERATION
    #
    # Tcl and CHR are solved iteratively using: H(Tsk - To) = CTC(Tcl - To),
    # where H = 1/(Ra + Rcl) and Ra = 1/Facl*CTC

    TCL_OLD = TCL
    TIME = range(LTIME)
    flag = True
    for TIM in TIME:
        if flag == True:
            while abs(TCL - TCL_OLD) > 0.01:
                TCL_OLD = TCL
                CHR = 4.0 * SBC * pow(((TCL + tr) / 2.0 + 273.15), 3.0) * 0.72
                CTC = CHR + CHC
                # resistance of air layer to dry heat transfer
                RA = 1.0 / (FACL * CTC)
                TOP = (CHR * tr + CHC * ta) / CTC
                TCL = (RA * TempSkin + RCL * TOP) / (RA + RCL)
        flag = False
        DRY = (TempSkin - TOP) / (RA + RCL)
        HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow)
        ERES = 0.0023 * M * (44.0 - VaporPressure)
        CRES = 0.0014 * M * (34.0 - ta)
        SCR = M - HFCS - ERES - CRES - wme
        SSK = HFCS - DRY - ESK
        TCSK = 0.97 * ALFA * BODYWEIGHT
        TCCR = 0.97 * (1 - ALFA) * BODYWEIGHT
        DTSK = (SSK * BODYSURFACEAREA) / (TCSK * 60.0)  # deg C per minute
        DTCR = SCR * BODYSURFACEAREA / (TCCR * 60.0)  # deg C per minute
        TempSkin = TempSkin + DTSK
        TempCore = TempCore + DTCR
        TB = ALFA * TempSkin + (1 - ALFA) * TempCore
        SKSIG = TempSkin - TempSkinNeutral
        WARMS = (SKSIG > 0) * SKSIG
        COLDS = ((-1.0 * SKSIG) > 0) * (-1.0 * SKSIG)
        CRSIG = (TempCore - TempCoreNeutral)
        WARMC = (CRSIG > 0) * CRSIG
        COLDC = ((-1.0 * CRSIG) > 0) * (-1.0 * CRSIG)
        BDSIG = TB - TempBodyNeutral
        WARMB = (BDSIG > 0) * BDSIG
        COLDB = ((-1.0 * BDSIG) > 0) * (-1.0 * BDSIG)
        SkinBloodFlow = ((SkinBloodFlowNeutral + CDIL * WARMC)
            / (1 + CSTR * COLDS))
        if SkinBloodFlow > 90.0: SkinBloodFlow = 90.0
        if SkinBloodFlow < 0.5: SkinBloodFlow = 0.5
        REGSW = CSW * WARMB * math.exp(WARMS / 10.7)
        if REGSW > 500.0: REGSW = 500.0
        ERSW = 0.68 * REGSW
        REA = 1.0 / (LR * FACL * CHC)  # evaporative resistance of air layer
        # evaporative resistance of clothing (icl=.45)
        RECL = RCL / (LR * ICL)
        EMAX = ((findSaturatedVaporPressureTorr(TempSkin) - VaporPressure) /
            (REA + RECL))
        PRSW = ERSW / EMAX
        PWET = 0.06 + 0.94 * PRSW
        EDIF = PWET * EMAX - ERSW
        ESK = ERSW + EDIF
        if PWET > WCRIT:
            PWET = WCRIT
            PRSW = WCRIT / 0.94
            ERSW = PRSW * EMAX
            EDIF = 0.06 * (1.0 - PRSW) * EMAX
            ESK = ERSW + EDIF
        if EMAX < 0:
            EDIF = 0
            ERSW = 0
            PWET = WCRIT
            PRSW = WCRIT
            ESK = EMAX
        ESK = ERSW + EDIF
        MSHIV = 19.4 * COLDS * COLDC
        M = RM + MSHIV
        ALFA = 0.0417737 + 0.7451833 / (SkinBloodFlow + .585417)


    # Define new heat flow terms, coeffs, and abbreviations
    STORE = M - wme - CRES - ERES - DRY - ESK  # rate of body heat storage
    HSK = DRY + ESK  # total heat loss from skin
    RN = M - wme  # net metabolic heat production
    ECOMF = 0.42 * (RN - (1 * METFACTOR))
    if ECOMF < 0.0: ECOMF = 0.0  # from Fanger
    EREQ = RN - ERES - CRES - DRY
    EMAX = EMAX * WCRIT
    HD = 1.0 / (RA + RCL)
    HE = 1.0 / (REA + RECL)
    W = PWET
    PSSK = findSaturatedVaporPressureTorr(TempSkin)
    # Definition of ASHRAE standard environment... denoted "S"
    CHRS = CHR
    if met < 0.85:
        CHCS = 3.0
    else:
        CHCS = 5.66 * pow((met - 0.85), 0.39)
        if CHCS < 3.0: CHCS = 3.0

    CTCS = CHCS + CHRS
    RCLOS = 1.52 / ((met - wme / METFACTOR) + 0.6944) - 0.1835
    RCLS = 0.155 * RCLOS
    FACLS = 1.0 + KCLO * RCLOS
    FCLS = 1.0 / (1.0 + 0.155 * FACLS * CTCS * RCLOS)
    IMS = 0.45
    ICLS = IMS * CHCS / CTCS * (1 - FCLS) / (CHCS / CTCS - FCLS * IMS)
    RAS = 1.0 / (FACLS * CTCS)
    REAS = 1.0 / (LR * FACLS * CHCS)
    RECLS = RCLS / (LR * ICLS)
    HD_S = 1.0 / (RAS + RCLS)
    HE_S = 1.0 / (REAS + RECLS)

    # SET* (standardized humidity, clo, Pb, and CHC)
    # determined using Newton's iterative solution
    # FNERRS is defined in the GENERAL SETUP section above

    DELTA = .0001
    dx = 100.0
    X_OLD = TempSkin - HSK / HD_S  # lower bound for SET
    while abs(dx) > .01:
        ERR1 = (HSK - HD_S * (TempSkin - X_OLD) - W * HE_S
            * (PSSK - 0.5 * findSaturatedVaporPressureTorr(X_OLD)))
        ERR2 = (HSK - HD_S * (TempSkin - (X_OLD + DELTA)) - W * HE_S
            * (PSSK - 0.5 * findSaturatedVaporPressureTorr((X_OLD + DELTA))))
        X = X_OLD - DELTA * ERR1 / (ERR2 - ERR1)
        dx = X - X_OLD
        X_OLD = X

    return X


def comfAdaptiveComfortASH55(self, ta, tr, runningMean, vel, eightyOrNinety, levelOfConditioning=0):
    # Define the variables that will be used throughout the calculation.
    r = []
    coolingEffect = 0
    if eightyOrNinety == True: offset = 3.5
    else: offset = 2.5
    to = (ta + tr) / 2
    # See if the running mean temperature is between 10 C and 33.5 C (the range where the adaptive model is supposed to be used).
    if runningMean >= 10.0 and runningMean <= 33.5:

        if (vel >= 0.6 and to >= 25):
            # calculate cooling effect of elevated air speed
            # when top > 25 degC.
            if vel < 0.9: coolingEffect = 1.2
            elif vel < 1.2: coolingEffect = 1.8
            elif vel >= 1.2: coolingEffect = 2.2
            else: pass

        # Figure out the relation between comfort and outdoor temperature depending on the level of conditioning.
        if levelOfConditioning == 0: tComf = 0.31 * runningMean + 17.8
        elif levelOfConditioning == 1: tComf = 0.09 * runningMean + 22.6
        else: tComf = ((0.09 * levelOfConditioning) + (0.31 * (1 - levelOfConditioning))) * runningMean + ((22.6 * levelOfConditioning) + (17.8 * (1 - levelOfConditioning)))

        tComfLower = tComf - offset
        tComfUpper = tComf + offset + coolingEffect
        r.append(tComf)
        r.append(to - tComf)
        r.append(tComfLower)
        r.append(tComfUpper)

        # See if the conditions are comfortable.
        if to > tComfLower and to < tComfUpper:
            # compliance
            acceptability = True
        else:
            # nonCompliance
            acceptability = False
        r.append(acceptability)

        # Append a number to the result list to show whether the values are too hot, too cold, or comfortable.
        if acceptability == True: r.append(0)
        elif to > tComfUpper: r.append(1)
        else: r.append(-1)

    elif runningMean < 10.0:
        # The prevailing temperature is too cold for the adaptive standard but we will use some correlations from adaptive-style surveys of conditioned buildings to give a good guess.
        if levelOfConditioning == 0: tComf = 24.024 + (0.295 * (runningMean - 22.0)) * math.exp((-1) * (((runningMean - 22) / (33.941125)) * ((runningMean - 22) / (33.941125))))
        else:
            conditOffset = 2.6 * levelOfConditioning
            tComf = conditOffset + 24.024 + (0.295 * (runningMean - 22.0)) * math.exp((-1) * (((runningMean - 22) / (33.941125)) * ((runningMean - 22) / (33.941125))))

        tempDiff = to - tComf
        tComfLower = tComf - offset
        tComfUpper = tComf + offset
        if to > tComfLower and to < tComfUpper: acceptability = True
        else: acceptability = False
        if acceptability == True: condit = 0
        elif to > tComfUpper: condit = 1
        else: condit = -1
        outputs = [tComf, tempDiff, tComfLower, tComfUpper, acceptability, condit]
        r.extend(outputs)
    else:
        # The prevailing temperature is too hot for the adaptive method.  This should usually not happen for climates on today's earth but it might be possible in the future with global warming. For this case, we will just use the adaptive model at its hottest limit.
        if (vel >= 0.6 and to >= 25):
            if vel < 0.9: coolingEffect = 1.2
            elif vel < 1.2: coolingEffect = 1.8
            elif vel >= 1.2: coolingEffect = 2.2
            else: pass
        if levelOfConditioning == 0: tComf = 0.31 * 33.5 + 17.8
        else: tComf = ((0.09 * levelOfConditioning) + (0.31 * (1 - levelOfConditioning))) * 33.5 + ((22.6 * levelOfConditioning) + (17.8 * (1 - levelOfConditioning)))
        tempDiff = to - tComf
        tComfLower = tComf - offset
        tComfUpper = tComf + offset + coolingEffect
        if to > tComfLower and to < tComfUpper: acceptability = True
        else: acceptability = False
        if acceptability == True: condit = 0
        elif to > tComfUpper: condit = 1
        else: condit = -1
        outputs = [tComf, tempDiff, tComfLower, tComfUpper, acceptability, condit]
        r.extend(outputs)

    return r


def comfAdaptiveComfortEN15251(self, ta, tr, runningMean, vel, comfortClass, levelOfConditioning=0):
    # Define the variables that will be used throughout the calculation.
    r = []
    coolingEffect = 0
    if comfortClass == 1: offset = 2
    elif comfortClass == 2: offset = 3
    else: offset = 4
    to = (ta + tr) / 2

    # See if the running mean temperature is between 10 C and 30.0 C (the range where the adaptive model is supposed to be used).
    if runningMean >= 10.0 and runningMean <= 30.0:
        if (vel >= 0.2 and to >= 25):
            # calculate cooling effect of elevated air speed
            # when top > 25 degC.
            coolingEffect = 1.7856 * math.log(vel) + 2.9835

        if levelOfConditioning == 0: tComf = 0.33 * runningMean + 18.8
        elif levelOfConditioning == 1: tComf = 0.09 * runningMean + 22.6
        else: tComf = ((0.09 * levelOfConditioning) + (0.33 * (1 - levelOfConditioning))) * runningMean + ((22.6 * levelOfConditioning) + (18.8 * (1 - levelOfConditioning)))

        if runningMean > 15:
            tComfLower = tComf - offset
            tComfUpper = tComf + offset + coolingEffect
        elif runningMean > 12.73 and runningMean < 15 and levelOfConditioning == 0:
            tComfLow = 23.75
            tComfLower = tComfLow - offset
            tComfUpper = tComf + offset + coolingEffect
        elif levelOfConditioning != 0:
            tComfLower = tComf - offset
            tComfUpper = tComf + offset + coolingEffect
        else:
            tComfLow = 23.75
            tComfLower = tComfLow - offset
            if comfortClass == 1: tComfUpper = tComf + offset
            else: tComfUpper = tComf + offset + coolingEffect

        r.append(tComf)
        r.append(to - tComf)
        r.append(tComfLower)
        r.append(tComfUpper)

        # See if the conditions are comfortable.
        if to > tComfLower and to < tComfUpper:
            # compliance
            acceptability = True
        else:
            # nonCompliance
            acceptability = False
        r.append(acceptability)

        # Append a number to the result list to show whether the values are too hot, too cold, or comfortable.
        if acceptability == True: r.append(0)
        elif to > tComfUpper: r.append(1)
        else: r.append(-1)

    elif runningMean < 10.0:
        # The prevailing temperature is too cold for the adaptive standard but we will use some correlations from adaptive-style surveys of conditioned buildings to give a good guess.
        if levelOfConditioning == 0: tComf = 25.224 + (0.295 * (runningMean - 22.0)) * math.exp((-1) * (((runningMean - 22) / (33.941125)) * ((runningMean - 22) / (33.941125))))
        else:
            conditOffset = 1.4 * levelOfConditioning
            tComf = conditOffset + 25.224 + (0.295 * (runningMean - 22.0)) * math.exp((-1) * (((runningMean - 22) / (33.941125)) * ((runningMean - 22) / (33.941125))))

        tempDiff = to - tComf
        tComfLower = tComf - offset
        tComfUpper = tComf + offset
        if to > tComfLower and to < tComfUpper: acceptability = True
        else: acceptability = False
        if acceptability == True: condit = 0
        elif to > tComfUpper: condit = 1
        else: condit = -1
        outputs = [tComf, tempDiff, tComfLower, tComfUpper, acceptability, condit]
        r.extend(outputs)
    else:
        # The prevailing temperature is too hot for the adaptive method.  This should usually not happen for climates on today's earth but it might be possible in the future with global warming. For this case, we will just use the adaptive model at its hottest limit.
        if (vel >= 0.2 and to >= 25):
            # calculate cooling effect of elevated air speed
            # when top > 25 degC.
            coolingEffect = 1.7856 * math.log(vel) + 2.9835
        if levelOfConditioning == 0: tComf = 0.33 * 30.0 + 18.8
        else: tComf = ((0.09 * levelOfConditioning) + (0.33 * (1 - levelOfConditioning))) * 30.0 + ((22.6 * levelOfConditioning) + (18.8 * (1 - levelOfConditioning)))
        tempDiff = to - tComf
        tComfLower = tComf - offset
        tComfUpper = tComf + offset + coolingEffect
        if to > tComfLower and to < tComfUpper: acceptability = True
        else: acceptability = False
        if acceptability == True: condit = 0
        elif to > tComfUpper: condit = 1
        else: condit = -1
        outputs = [tComf, tempDiff, tComfLower, tComfUpper, acceptability, condit]
        r.extend(outputs)

    return r


def comfUTCI(Ta, Tmrt, va, RH):
    # Define a function to change the RH to water saturation vapor
    # pressure in hPa
    def es(ta):
        g = [
            -2836.5744, -6028.076559, 19.54263612,
            -0.02737830188, 0.000016261698,
            (7.0229056 * (10**(-10))), (-1.8680009 * (10**(-13)))]
        tk = ta + 273.15  # air temp in K
        es = 2.7150305 * math.log1p(tk)
        for count, i in enumerate(g):
            es = es + (i * (tk**(count - 2)))
        es = math.exp(es) * 0.01  # convert Pa to hPa
        return es

    # Do a series of checks to be sure that the input values are within
    # the bounds accepted by the model.
    check = (Ta < -50.0 or Ta > 50.0 or
             Tmrt - Ta < -30.0 or Tmrt - Ta > 70.0)
    if va < 0.5:
        va = 0.5
    elif va > 17:
        va = 17

    # If everything is good, run the data through the model below to get
    # the UTCI.
    # This is a python version of the UTCI_approx function
    # Version a 0.002, October 2009
    # Ta: air temperature, degrees Celsius
    # ehPa: water vapour presure, hPa=hecto Pascal
    # Tmrt: mean radiant temperature, degrees Celsius
    # va10m: wind speed 10m above ground level in m/s

    if check == True:
        ehPa = es(Ta) * (RH / 100.0)
        D_Tmrt = Tmrt - Ta
        Pa = ehPa / 10.0  # convert vapour pressure to kPa

        UTCI_approx = (Ta +
            (0.607562052) +
            (-0.0227712343) * Ta +
            (8.06470249*(10**(-4))) * Ta * Ta +
            (-1.54271372*(10**(-4))) * Ta * Ta * Ta +
            (-3.24651735*(10**(-6))) * Ta * Ta * Ta * Ta +
            (7.32602852*(10**(-8))) * Ta * Ta * Ta * Ta * Ta +
            (1.35959073*(10**(-9))) * Ta * Ta * Ta * Ta * Ta * Ta +
            (-2.25836520) * va +
            (0.0880326035) * Ta * va +
            (0.00216844454) * Ta * Ta * va +
            (-1.53347087*(10**(-5))) * Ta * Ta * Ta * va +
            (-5.72983704*(10**(-7))) * Ta * Ta * Ta * Ta * va +
            (-2.55090145*(10**(-9))) * Ta * Ta * Ta * Ta * Ta * va +
            (-0.751269505) * va * va +
            (-0.00408350271) * Ta * va * va +
            (-5.21670675*(10**(-5))) * Ta * Ta * va * va +
            (1.94544667*(10**(-6))) * Ta * Ta * Ta * va * va +
            (1.14099531*(10**(-8))) * Ta * Ta * Ta * Ta * va * va +
            (0.158137256) * va * va * va +
            (-6.57263143*(10**(-5))) * Ta * va * va * va +
            (2.22697524*(10**(-7))) * Ta * Ta * va * va * va +
            (-4.16117031*(10**(-8))) * Ta * Ta * Ta * va * va * va +
            (-0.0127762753) * va * va * va * va +
            (9.66891875*(10**(-6))) * Ta * va * va * va * va +
            (2.52785852*(10**(-9))) * Ta * Ta * va * va * va * va +
            (4.56306672*(10**(-4))) * va * va * va * va * va +
            (-1.74202546*(10**(-7))) * Ta * va * va * va * va * va +
            (-5.91491269*(10**(-6))) * va * va * va * va * va * va +
            (0.398374029) * D_Tmrt +
            (1.83945314*(10**(-4))) * Ta * D_Tmrt +
            (-1.73754510*(10**(-4))) * Ta * Ta * D_Tmrt +
            (-7.60781159*(10**(-7))) * Ta * Ta * Ta * D_Tmrt +
            (3.77830287*(10**(-8))) * Ta * Ta * Ta * Ta * D_Tmrt +
            (5.43079673*(10**(-10))) * Ta * Ta * Ta * Ta * Ta * D_Tmrt +
            (-0.0200518269) * va * D_Tmrt +
            (8.92859837*(10**(-4))) * Ta * va * D_Tmrt +
            (3.45433048*(10**(-6))) * Ta * Ta * va * D_Tmrt +
            (-3.77925774*(10**(-7))) * Ta * Ta * Ta * va * D_Tmrt +
            (-1.69699377*(10**(-9))) * Ta * Ta * Ta * Ta * va * D_Tmrt +
            (1.69992415*(10**(-4))) * va*va*D_Tmrt +
            ( -4.99204314*(10**(-5)) ) * Ta*va*va*D_Tmrt +
            ( 2.47417178*(10**(-7)) ) * Ta*Ta*va*va*D_Tmrt +
            ( 1.07596466*(10**(-8)) ) * Ta*Ta*Ta*va*va*D_Tmrt +
            ( 8.49242932*(10**(-5)) ) * va*va*va*D_Tmrt +
            ( 1.35191328*(10**(-6)) ) * Ta*va*va*va*D_Tmrt +
            ( -6.21531254*(10**(-9)) ) * Ta*Ta*va*va*va*D_Tmrt +
            ( -4.99410301*(10**(-6)) ) * va*va*va*va*D_Tmrt +
            ( -1.89489258*(10**(-8)) ) * Ta*va*va*va*va*D_Tmrt +
            ( 8.15300114*(10**(-8)) ) * va*va*va*va*va*D_Tmrt +
            ( 7.55043090*(10**(-4)) ) * D_Tmrt*D_Tmrt +
            ( -5.65095215*(10**(-5)) ) * Ta*D_Tmrt*D_Tmrt +
            ( -4.52166564*(10**(-7)) ) * Ta*Ta*D_Tmrt*D_Tmrt +
            ( 2.46688878*(10**(-8)) ) * Ta*Ta*Ta*D_Tmrt*D_Tmrt +
            ( 2.42674348*(10**(-10)) ) * Ta*Ta*Ta*Ta*D_Tmrt*D_Tmrt +
            ( 1.54547250*(10**(-4)) ) * va*D_Tmrt*D_Tmrt +
            ( 5.24110970*(10**(-6)) ) * Ta*va*D_Tmrt*D_Tmrt +
            ( -8.75874982*(10**(-8)) ) * Ta*Ta*va*D_Tmrt*D_Tmrt +
            ( -1.50743064*(10**(-9)) ) * Ta*Ta*Ta*va*D_Tmrt*D_Tmrt +
            ( -1.56236307*(10**(-5)) ) * va*va*D_Tmrt*D_Tmrt +
            ( -1.33895614*(10**(-7)) ) * Ta*va*va*D_Tmrt*D_Tmrt +
            ( 2.49709824*(10**(-9)) ) * Ta*Ta*va*va*D_Tmrt*D_Tmrt +
            ( 6.51711721*(10**(-7)) ) * va*va*va*D_Tmrt*D_Tmrt +
            ( 1.94960053*(10**(-9)) ) * Ta*va*va*va*D_Tmrt*D_Tmrt +
            ( -1.00361113*(10**(-8)) ) * va*va*va*va*D_Tmrt*D_Tmrt +
            ( -1.21206673*(10**(-5)) ) * D_Tmrt*D_Tmrt*D_Tmrt +
            ( -2.18203660*(10**(-7)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 7.51269482*(10**(-9)) ) * Ta*Ta*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 9.79063848*(10**(-11)) ) * Ta*Ta*Ta*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 1.25006734*(10**(-6)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -1.81584736*(10**(-9)) ) * Ta*va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -3.52197671*(10**(-10)) ) * Ta*Ta*va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -3.36514630*(10**(-8)) ) * va*va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 1.35908359*(10**(-10)) ) * Ta*va*va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 4.17032620*(10**(-10)) ) * va*va*va*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -1.30369025*(10**(-9)) ) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 4.13908461*(10**(-10)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 9.22652254*(10**(-12)) ) * Ta*Ta*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -5.08220384*(10**(-9)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -2.24730961*(10**(-11)) ) * Ta*va*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 1.17139133*(10**(-10)) ) * va*va*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 6.62154879*(10**(-10)) ) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 4.03863260*(10**(-13)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 1.95087203*(10**(-12)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( -4.73602469*(10**(-12))) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt +
            ( 5.12733497) * Pa +
            ( -0.312788561) * Ta*Pa +
            ( -0.0196701861 ) * Ta*Ta*Pa +
            ( 9.99690870*(10**(-4)) ) * Ta*Ta*Ta*Pa +
            ( 9.51738512*(10**(-6)) ) * Ta*Ta*Ta*Ta*Pa +
            ( -4.66426341*(10**(-7)) ) * Ta*Ta*Ta*Ta*Ta*Pa +
            ( 0.548050612 ) * va*Pa +
            ( -0.00330552823) * Ta*va*Pa +
            ( -0.00164119440 ) * Ta*Ta*va*Pa +
            ( -5.16670694*(10**(-6)) ) * Ta*Ta*Ta*va*Pa +
            ( 9.52692432*(10**(-7)) ) * Ta*Ta*Ta*Ta*va*Pa +
            ( -0.0429223622 ) * va*va*Pa +
            ( 0.00500845667 ) * Ta*va*va*Pa +
            ( 1.00601257*(10**(-6)) ) * Ta*Ta*va*va*Pa +
            ( -1.81748644*(10**(-6)) ) * Ta*Ta*Ta*va*va*Pa +
            ( -1.25813502*(10**(-3)) ) * va*va*va*Pa +
            ( -1.79330391*(10**(-4)) ) * Ta*va*va*va*Pa +
            ( 2.34994441*(10**(-6)) ) * Ta*Ta*va*va*va*Pa +
            ( 1.29735808*(10**(-4)) ) * va*va*va*va*Pa +
            ( 1.29064870*(10**(-6)) ) * Ta*va*va*va*va*Pa +
            ( -2.28558686*(10**(-6)) ) * va*va*va*va*va*Pa +
            ( -0.0369476348 ) * D_Tmrt*Pa +
            ( 0.00162325322 ) * Ta*D_Tmrt*Pa +
            ( -3.14279680*(10**(-5)) ) * Ta*Ta*D_Tmrt*Pa +
            ( 2.59835559*(10**(-6)) ) * Ta*Ta*Ta*D_Tmrt*Pa +
            ( -4.77136523*(10**(-8)) ) * Ta*Ta*Ta*Ta*D_Tmrt*Pa +
            ( 8.64203390*(10**(-3)) ) * va*D_Tmrt*Pa +
            ( -6.87405181*(10**(-4)) ) * Ta*va*D_Tmrt*Pa +
            ( -9.13863872*(10**(-6)) ) * Ta*Ta*va*D_Tmrt*Pa +
            ( 5.15916806*(10**(-7)) ) * Ta*Ta*Ta*va*D_Tmrt*Pa +
            ( -3.59217476*(10**(-5)) ) * va*va*D_Tmrt*Pa +
            ( 3.28696511*(10**(-5)) ) * Ta*va*va*D_Tmrt*Pa +
            ( -7.10542454*(10**(-7)) ) * Ta*Ta*va*va*D_Tmrt*Pa +
            ( -1.24382300*(10**(-5)) ) * va*va*va*D_Tmrt*Pa +
            ( -7.38584400*(10**(-9)) ) * Ta*va*va*va*D_Tmrt*Pa +
            ( 2.20609296*(10**(-7)) ) * va*va*va*va*D_Tmrt*Pa +
            ( -7.32469180*(10**(-4)) ) * D_Tmrt*D_Tmrt*Pa +
            ( -1.87381964*(10**(-5)) ) * Ta*D_Tmrt*D_Tmrt*Pa +
            ( 4.80925239*(10**(-6)) ) * Ta*Ta*D_Tmrt*D_Tmrt*Pa +
            ( -8.75492040*(10**(-8)) ) * Ta*Ta*Ta*D_Tmrt*D_Tmrt*Pa +
            ( 2.77862930*(10**(-5)) ) * va*D_Tmrt*D_Tmrt*Pa +
            ( -5.06004592*(10**(-6)) ) * Ta*va*D_Tmrt*D_Tmrt*Pa +
            ( 1.14325367*(10**(-7)) ) * Ta*Ta*va*D_Tmrt*D_Tmrt*Pa +
            ( 2.53016723*(10**(-6)) ) * va*va*D_Tmrt*D_Tmrt*Pa +
            ( -1.72857035*(10**(-8)) ) * Ta*va*va*D_Tmrt*D_Tmrt*Pa +
            ( -3.95079398*(10**(-8)) ) * va*va*va*D_Tmrt*D_Tmrt*Pa +
            ( -3.59413173*(10**(-7)) ) * D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( 7.04388046*(10**(-7)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( -1.89309167*(10**(-8)) ) * Ta*Ta*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( -4.79768731*(10**(-7)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( 7.96079978*(10**(-9)) ) * Ta*va*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( 1.62897058*(10**(-9)) ) * va*va*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( 3.94367674*(10**(-8)) ) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( -1.18566247*(10**(-9)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( 3.34678041*(10**(-10)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( -1.15606447*(10**(-10)) ) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*Pa +
            ( -2.80626406 ) * Pa*Pa +
            ( 0.548712484 ) * Ta*Pa*Pa +
            ( -0.00399428410 ) * Ta*Ta*Pa*Pa +
            ( -9.54009191*(10**(-4)) ) * Ta*Ta*Ta*Pa*Pa +
            ( 1.93090978*(10**(-5)) ) * Ta*Ta*Ta*Ta*Pa*Pa +
            ( -0.308806365 ) * va*Pa*Pa +
            ( 0.0116952364 ) * Ta*va*Pa*Pa +
            ( 4.95271903*(10**(-4)) ) * Ta*Ta*va*Pa*Pa +
            ( -1.90710882*(10**(-5)) ) * Ta*Ta*Ta*va*Pa*Pa +
            ( 0.00210787756 ) * va*va*Pa*Pa +
            ( -6.98445738*(10**(-4)) ) * Ta*va*va*Pa*Pa +
            ( 2.30109073*(10**(-5)) ) * Ta*Ta*va*va*Pa*Pa +
            ( 4.17856590*(10**(-4)) ) * va*va*va*Pa*Pa +
            ( -1.27043871*(10**(-5)) ) * Ta*va*va*va*Pa*Pa +
            ( -3.04620472*(10**(-6)) ) * va*va*va*va*Pa*Pa +
            ( 0.0514507424 ) * D_Tmrt*Pa*Pa +
            ( -0.00432510997 ) * Ta*D_Tmrt*Pa*Pa +
            ( 8.99281156*(10**(-5)) ) * Ta*Ta*D_Tmrt*Pa*Pa +
            ( -7.14663943*(10**(-7)) ) * Ta*Ta*Ta*D_Tmrt*Pa*Pa +
            ( -2.66016305*(10**(-4)) ) * va*D_Tmrt*Pa*Pa +
            ( 2.63789586*(10**(-4)) ) * Ta*va*D_Tmrt*Pa*Pa +
            ( -7.01199003*(10**(-6)) ) * Ta*Ta*va*D_Tmrt*Pa*Pa +
            ( -1.06823306*(10**(-4)) ) * va*va*D_Tmrt*Pa*Pa +
            ( 3.61341136*(10**(-6)) ) * Ta*va*va*D_Tmrt*Pa*Pa +
            ( 2.29748967*(10**(-7)) ) * va*va*va*D_Tmrt*Pa*Pa +
            ( 3.04788893*(10**(-4)) ) * D_Tmrt*D_Tmrt*Pa*Pa +
            ( -6.42070836*(10**(-5)) ) * Ta*D_Tmrt*D_Tmrt*Pa*Pa +
            ( 1.16257971*(10**(-6)) ) * Ta*Ta*D_Tmrt*D_Tmrt*Pa*Pa +
            ( 7.68023384*(10**(-6)) ) * va*D_Tmrt*D_Tmrt*Pa*Pa +
            ( -5.47446896*(10**(-7)) ) * Ta*va*D_Tmrt*D_Tmrt*Pa*Pa +
            ( -3.59937910*(10**(-8)) ) * va*va*D_Tmrt*D_Tmrt*Pa*Pa +
            ( -4.36497725*(10**(-6)) ) * D_Tmrt*D_Tmrt*D_Tmrt*Pa*Pa +
            ( 1.68737969*(10**(-7)) ) * Ta*D_Tmrt*D_Tmrt*D_Tmrt*Pa*Pa +
            ( 2.67489271*(10**(-8)) ) * va*D_Tmrt*D_Tmrt*D_Tmrt*Pa*Pa +
            ( 3.23926897*(10**(-9)) ) * D_Tmrt*D_Tmrt*D_Tmrt*D_Tmrt*Pa*Pa +
            ( -0.0353874123 ) * Pa*Pa*Pa +
            ( -0.221201190 ) * Ta*Pa*Pa*Pa +
            ( 0.0155126038 ) * Ta*Ta*Pa*Pa*Pa +
            ( -2.63917279*(10**(-4)) ) * Ta*Ta*Ta*Pa*Pa*Pa +
            ( 0.0453433455 ) * va*Pa*Pa*Pa +
            ( -0.00432943862 ) * Ta*va*Pa*Pa*Pa +
            ( 1.45389826*(10**(-4)) ) * Ta*Ta*va*Pa*Pa*Pa +
            ( 2.17508610*(10**(-4)) ) * va*va*Pa*Pa*Pa +
            ( -6.66724702*(10**(-5)) ) * Ta*va*va*Pa*Pa*Pa +
            ( 3.33217140*(10**(-5)) ) * va*va*va*Pa*Pa*Pa +
            ( -0.00226921615 ) * D_Tmrt*Pa*Pa*Pa +
            ( 3.80261982*(10**(-4)) ) * Ta*D_Tmrt*Pa*Pa*Pa +
            ( -5.45314314*(10**(-9)) ) * Ta*Ta*D_Tmrt*Pa*Pa*Pa +
            ( -7.96355448*(10**(-4)) ) * va*D_Tmrt*Pa*Pa*Pa +
            ( 2.53458034*(10**(-5)) ) * Ta*va*D_Tmrt*Pa*Pa*Pa +
            ( -6.31223658*(10**(-6)) ) * va*va*D_Tmrt*Pa*Pa*Pa +
            ( 3.02122035*(10**(-4)) ) * D_Tmrt*D_Tmrt*Pa*Pa*Pa +
            ( -4.77403547*(10**(-6)) ) * Ta*D_Tmrt*D_Tmrt*Pa*Pa*Pa +
            ( 1.73825715*(10**(-6)) ) * va*D_Tmrt*D_Tmrt*Pa*Pa*Pa +
            ( -4.09087898*(10**(-7)) ) * D_Tmrt*D_Tmrt*D_Tmrt*Pa*Pa*Pa +
            ( 0.614155345 ) * Pa*Pa*Pa*Pa +
            ( -0.0616755931 ) * Ta*Pa*Pa*Pa*Pa +
            ( 0.00133374846 ) * Ta*Ta*Pa*Pa*Pa*Pa +
            ( 0.00355375387 ) * va*Pa*Pa*Pa*Pa +
            ( -5.13027851*(10**(-4)) ) * Ta*va*Pa*Pa*Pa*Pa +
            ( 1.02449757*(10**(-4)) ) * va*va*Pa*Pa*Pa*Pa +
            ( -0.00148526421 ) * D_Tmrt*Pa*Pa*Pa*Pa +
            ( -4.11469183*(10**(-5)) ) * Ta*D_Tmrt*Pa*Pa*Pa*Pa +
            ( -6.80434415*(10**(-6)) ) * va*D_Tmrt*Pa*Pa*Pa*Pa +
            ( -9.77675906*(10**(-6)) ) * D_Tmrt*D_Tmrt*Pa*Pa*Pa*Pa +
            ( 0.0882773108 ) * Pa*Pa*Pa*Pa*Pa +
            ( -0.00301859306 ) * Ta*Pa*Pa*Pa*Pa*Pa +
            ( 0.00104452989 ) * va*Pa*Pa*Pa*Pa*Pa +
            ( 2.47090539*(10**(-4)) ) * D_Tmrt*Pa*Pa*Pa*Pa*Pa +
            ( 0.00148348065 ) * Pa*Pa*Pa*Pa*Pa*Pa)

        comfortable = UTCI_approx > 9 and UTCI_approx < 26

        if UTCI_approx < -14.0:
            stressRange = -2
        elif UTCI_approx < 9.0:
            stressRange = -1
        elif UTCI_approx < 26.0:
            stressRange = 0
        elif UTCI_approx < 32.0:
            stressRange = 1
        else:
            stressRange = 2
    else:
        UTCI_approx = None
        comfortable = None
        stressRange = None

    return UTCI_approx, comfortable, stressRange

def calcHumidRatio(airTemp, relHumid, barPress):
    # Convert Temperature to Kelvin
    TKelvin = []
    for item in airTemp:
        TKelvin.append(item + 273)

    # Calculate saturation vapor pressure above freezing
    Sigma = []
    for item in TKelvin:
        if item >= 273:
            Sigma.append(1-(item/647.096))
        else:
            Sigma.append(0)

    ExpressResult = []
    for item in Sigma:
        ExpressResult.append(((item) * (-7.85951783)) +
            ((item**1.5) * 1.84408259) + ((item**3) * (-11.7866487)) +
            ((item**3.5) * 22.6807411) + ((item**4)*(-15.9618719)) +
            ((item**7.5)*1.80122502))

    CritTemp = []
    for item in TKelvin:
        CritTemp.append(647.096/item)

    Exponent = [a*b for a,b in zip(CritTemp,ExpressResult)]

    Power = []
    for item in Exponent:
        Power.append(math.exp(item))

    SatPress1 = []
    for item in Power:
        if item != 1:
            SatPress1.append(item*22064000)
        else:
            SatPress1.append(0)

    # Calculate saturation vapor pressure below freezing
    Theta = []
    for item in TKelvin:
        if item < 273:
            Theta.append(item/273.16)
        else:
            Theta.append(1)

    Exponent2 = []
    for x in Theta:
        Exponent2.append(((1 - (x**(-1.5))) * (-13.928169)) +
            ((1-(x**(-1.25)))*34.707823))

    Power = []
    for item in Exponent2:
        Power.append(math.exp(item))

    SatPress2 = []
    for item in Power:
        if item != 1:
            SatPress2.append(item*611.657)
        else:
            SatPress2.append(0)

    # Combine into final saturation vapor pressure
    saturationPressure = [a+b for a,b in zip(SatPress1,SatPress2)]

    # Calculate hourly water vapor pressure
    DecRH = []
    for item in relHumid:
        DecRH.append(item*0.01)

    partialPressure = [a*b for a,b in zip(DecRH,saturationPressure)]

    # Calculate hourly humidity ratio
    PressDiffer = [a-b for a,b in zip(barPress,partialPressure)]

    Constant = []
    for item in partialPressure:
        Constant.append(item*0.621991)

    humidityRatio = [a/b for a,b in zip(Constant,PressDiffer)]

    # Calculate hourly enthalpy
    EnVariable1 = []
    for item in humidityRatio:
        EnVariable1.append(1.01+(1.89*item))

    EnVariable2 = [a*b for a,b in zip(EnVariable1,airTemp)]

    EnVariable3 = []
    for item in humidityRatio:
        EnVariable3.append(2500*item)

    EnVariable4 = [a+b for a,b in zip(EnVariable2,EnVariable3)]

    enthalpy = []
    for x in EnVariable4:
        if x >= 0:
            enthalpy.append(x)
        else:
            enthalpy.append(0)

    return humidityRatio, enthalpy, partialPressure, saturationPressure
