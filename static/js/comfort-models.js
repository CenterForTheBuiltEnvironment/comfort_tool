const comf = {};

if (typeof module !== "undefined" && module.exports) {
  var psy = require("./psychrometrics.js").psy;
  var util = require("./util.js").util;
  module.exports.comf = comf;
}

comf.relativeAirSpeed = function (v, met) {
  if (met > 1) {
    return v + 0.3 * (met - 1);
  } else {
    return v;
  }
};

comf.dynamicClothing = function (clo, met) {
  if (met > 1.2) {
    return clo * (0.6 + 0.4 / met);
  } else {
    return clo;
  }
};

comf.still_air_threshold = 0.1; // m/s

comf.between = function (x, l, r) {
  return x >= l && x <= r;
};

comf.adaptiveComfortASH55 = function (ta, tr, runningMean, vel) {
  const r = {};
  const to = (ta + tr) / 2;
  let coolingEffect = 0;
  if (vel > 0.3 && to >= 25) {
    // calculate cooling effect of elevated air speed when top > 25 degC.
    switch (vel) {
      case 0.6:
        coolingEffect = 1.2;
        break;
      case 0.9:
        coolingEffect = 1.8;
        break;
      case 1.2:
        coolingEffect = 2.2;
        break;
    }
  }
  const tmpComfort = 0.31 * runningMean + 17.8;
  r.tComf80Lower = tmpComfort - 3.5;
  r.tComf80Upper = tmpComfort + 3.5 + coolingEffect;
  r.tComf90Lower = tmpComfort - 2.5;
  r.tComf90Upper = tmpComfort + 2.5 + coolingEffect;
  let acceptability80, acceptability90;

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
  return r;
};

comf.pmvElevatedAirspeed = function (ta, tr, vel, rh, met, clo, wme) {
  /**
   * Returns comfort values for elevated air speeds
   * @param  {Number} ta      air temperature, [C]
   * @param  {Number} tr      mean radiant temperature, [C]
   * @param  {Number} vel     air speed, [m/s]
   * @param  {Number} rh      relative humidity, [%]
   * @param  {Number} met     metabolic rate, [met]
   * @param  {Number} clo     clothing level, [clo]
   * @param  {Number} wme     external work, [met]
   * @return {Class}  r       containing estimated parameters [PMV, PPD, Ta_adj, Tr_adj, cooling_effect, SET]
   */
  // returns pmv
  let r = {};
  let pmv, ce;
  const relativeAirSpeed = comf.relativeAirSpeed(vel, met); // calculate relative air speed
  const dynamicClothing = comf.dynamicClothing(clo, met); // dynamic clothing insulation

  // do not use the elevated air speed model if v <= 0.1
  if (relativeAirSpeed <= 0.1) {
    pmv = comf.pmv(ta, tr, relativeAirSpeed, rh, met, dynamicClothing, wme);
    ce = 0;
  } else {
    ce = comf.cooling_effect(
      ta,
      tr,
      relativeAirSpeed,
      rh,
      met,
      dynamicClothing,
      wme
    );
    pmv = comf.pmv(
      ta - ce,
      tr - ce,
      comf.still_air_threshold,
      rh,
      met,
      clo,
      wme
    );
  }

  // save the data to the object
  r.pmv = pmv.pmv;
  r.ppd = pmv.ppd;
  r.set = comf.pierceSET(ta, tr, vel, rh, met, clo, wme).set;
  r.ta_adj = ta - ce;
  r.tr_adj = tr - ce;
  r.cooling_effect = ce;

  return r;
};

comf.pmvEN = function (ta, tr, vel, rh, met, clo, wme) {
  /**
  ta, air temperature (°C)
  tr, mean radiant temperature (°C)
  vel, average air speed (m/s)
  rh, relative humidity (%)
  met, metabolic rate (met)
  clo, dynamic clothing insulation (clo)
  wme, external work, normally around 0 (met)
   */
  const data = {};
  const relativeAirSpeed = comf.relativeAirSpeed(vel, met);
  const pmv = comf.pmv(ta, tr, relativeAirSpeed, rh, met, clo, wme);
  data.pmv = pmv.pmv;
  data.ppd = pmv.ppd;
  return data;
};

comf.cooling_effect = function (
  ta,
  tr,
  vel,
  rh,
  met,
  clo,
  wme,
  bodyPosition = "sitting"
) {
  const ce_l = 0;
  const ce_r = 40;
  const eps = 0.001; // precision of ce
  let ce;

  if (vel <= 0.1) {
    return 0;
  }

  const set = comf.pierceSET(
    ta,
    tr,
    vel,
    rh,
    met,
    clo,
    wme,
    false,
    true,
    90,
    bodyPosition
  ).set;

  const fn = function (_ce) {
    return (
      set -
      comf.pierceSET(
        ta - _ce,
        tr - _ce,
        comf.still_air_threshold,
        rh,
        met,
        clo,
        wme,
        false,
        true,
        90,
        bodyPosition
      ).set
    );
  };

  ce = util.secant(ce_l, ce_r, fn, eps);

  if (isNaN(ce)) {
    ce = util.bisect(ce_l, ce_r, fn, eps, 0);
  }

  return ce;
};

comf.pmv = function (ta, tr, vel, rh, met, clo, wme = 0) {
  /**
  ta, air temperature (°C)
  tr, mean radiant temperature (°C)
  vel, relative air speed (m/s)
  rh, relative humidity (%) Used only this way to input humidity level
  met, metabolic rate (met)
  clo, dynamic clothing insulation (clo)
  wme, external work, normally around 0 (met)
   */

  let pa,
    icl,
    m,
    w,
    mw,
    fcl,
    hcf,
    taa,
    tra,
    t_cla,
    p1,
    p2,
    p3,
    p4,
    p5,
    xn,
    xf,
    eps,
    hcn,
    hc,
    tcl,
    hl1,
    hl2,
    hl3,
    hl4,
    hl5,
    hl6,
    ts,
    pmv,
    ppd,
    n;

  pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));

  icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
  m = met * 58.15; //metabolic rate in W/M2
  w = wme * 58.15; //external work in W/M2
  mw = m - w; //internal heat production in the human body
  if (icl <= 0.078) fcl = 1 + 1.29 * icl;
  else fcl = 1.05 + 0.645 * icl;

  //heat transfer coefficient by forced convection
  hcf = 12.1 * Math.sqrt(vel);
  taa = ta + 273;
  tra = tr + 273;
  // we have verified that using the equation below or this t_cla = taa + (35.5 - ta) / (3.5 * (6.45 * icl + .1)) does not affect the PMV value
  t_cla = taa + (35.5 - ta) / (3.5 * icl + 0.1);

  p1 = icl * fcl;
  p2 = p1 * 3.96;
  p3 = p1 * 100;
  p4 = p1 * taa;
  p5 = 308.7 - 0.028 * mw + p2 * Math.pow(tra / 100, 4);
  xn = t_cla / 100;
  xf = t_cla / 50;
  eps = 0.00015;

  n = 0;
  while (Math.abs(xn - xf) > eps) {
    xf = (xf + xn) / 2;
    hcn = 2.38 * Math.pow(Math.abs(100.0 * xf - taa), 0.25);
    if (hcf > hcn) hc = hcf;
    else hc = hcn;
    xn = (p5 + p4 * hc - p2 * Math.pow(xf, 4)) / (100 + p3 * hc);
    ++n;
    if (n > 150) {
      alert("Math.max iterations exceeded");
      return 1;
    }
  }

  tcl = 100 * xn - 273;

  // heat loss diff. through skin
  hl1 = 3.05 * 0.001 * (5733 - 6.99 * mw - pa);
  // heat loss by sweating
  if (mw > 58.15) hl2 = 0.42 * (mw - 58.15);
  else hl2 = 0;
  // latent respiration heat loss
  hl3 = 1.7 * 0.00001 * m * (5867 - pa);
  // dry respiration heat loss
  hl4 = 0.0014 * m * (34 - ta);
  // heat loss by radiation
  hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4));
  // heat loss by convection
  hl6 = fcl * hc * (tcl - ta);

  ts = 0.303 * Math.exp(-0.036 * m) + 0.028;
  pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
  ppd =
    100.0 -
    95.0 *
      Math.exp(-0.03353 * Math.pow(pmv, 4.0) - 0.2179 * Math.pow(pmv, 2.0));

  return {
    pmv: pmv,
    ppd: ppd,
    hl1: hl1,
    hl2: hl2,
    hl3: hl3,
    hl4: hl4,
    hl5: hl5,
    hl6: hl6,
  };
};

comf.phs = function (
  tdb,
  tr,
  rh,
  v,
  met,
  clo,
  posture,
  round = false,
  wme = 0,
  i_mst = 0.38,
  a_p = 0.54,
  drink = 1,
  weight = 75,
  height = 1.8,
  walk_sp = 0,
  theta = 0,
  acclimatized = 100,
  duration = 480,
  f_r = 0.97,
  t_sk = 34.1,
  t_cr = 36.8,
  t_re = 36.8, // todo check this since is by default equal to t_cr
  t_cr_eq = 36.8, // todo check this since is by default equal to t_cr
  sweat_rate = 0
) {
  const p_a = ((psy.satpress(tdb) / 1000) * rh) / 100;

  // DuBois body surface area [m2]
  const a_dubois = 0.202 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
  const sp_heat = (57.83 * weight) / a_dubois; // specific heat of the body
  let sw_tot = 0;
  let t_sk_t_cr_wg = 0.3; // t_skin and t_core weighing
  let d_lim_t_re = 0; // maximum allowable exposure time for heat storage [min]
  // maximum allowable exposure time for water loss, mean subject [min]
  let d_lim_loss_50 = 0;
  // maximum allowable exposure time for water loss, 95 % of the working population [min]
  let d_lim_loss_95 = 0;
  // maximum water loss to protect a mean subject [g]
  const d_max_50 = 0.075 * weight * 1000;
  // maximum water loss to protect 95 % of the working population [g]
  const d_max_95 = 0.05 * weight * 1000;
  // exponential averaging constants
  const const_t_eq = Math.exp(-1 / 10);
  const const_t_sk = Math.exp(-1 / 3);
  const const_sw = Math.exp(-1 / 10);
  // water loss [g]
  let sw_tot_g = 0;

  let def_dir = 0;
  if (theta !== 0) {
    // def_dir = 1 for unidirectional walking, def_dir = 0 for omni-directional walking
    def_dir = 1;
  }
  let def_speed = 1;
  if (walk_sp === 0) {
    def_speed = 0;
  }

  // radiating area dubois
  let a_r_du = 0.7;
  if (posture === 2) {
    a_r_du = 0.77;
  }
  if (posture === 3) {
    a_r_du = 0.67;
  }

  // evaluation of the max sweat rate as a function of the metabolic rate
  let sw_max = (met - 32) * a_dubois;
  if (sw_max > 400) {
    sw_max = 400;
  }
  if (sw_max < 250) {
    sw_max = 250;
  }
  if (acclimatized >= 50) {
    sw_max = sw_max * 1.25;
  }

  // max skin wettedness
  let w_max = 1;
  if (acclimatized < 50) {
    w_max = 0.85;
  }

  // static clothing insulation
  const i_cl_st = clo * 0.155;
  const fcl = 1 + 0.3 * clo;

  // Static boundary layer thermal insulation in quiet air
  const i_a_st = 0.111;

  // Total static insulation
  const i_tot_st = i_cl_st + i_a_st / fcl;

  let v_r = v;
  if (def_speed > 0) {
    if (def_dir === 1) {
      // Unidirectional walking
      v_r = Math.abs(v - walk_sp * Math.cos((3.14159 * theta) / 180));
    } else {
      // Omni-directional walking IF
      if (v < walk_sp) {
        v_r = walk_sp;
      } else {
        v_r = v;
      }
    }
  } else {
    walk_sp = 0.0052 * (met - 58);
    if (walk_sp > 0.7) {
      walk_sp = 0.7;
      v_r = v;
    }
  }

  // Dynamic clothing insulation - correction for wind (Var) and walking speed
  let v_ux = v_r;
  if (v_r > 3) {
    v_ux = 3;
  }
  let w_a_ux = walk_sp;
  if (walk_sp > 1.5) {
    w_a_ux = 1.5;
  }
  // correction for the dynamic total dry thermal insulation at or above 0.6 clo
  let corr_cl =
    1.044 *
    Math.exp((0.066 * v_ux - 0.398) * v_ux + (0.094 * w_a_ux - 0.378) * w_a_ux);
  if (corr_cl > 1) {
    corr_cl = 1;
  }
  // correction for the dynamic total dry thermal insulation at 0 clo
  let corr_ia = Math.exp(
    (0.047 * v_r - 0.472) * v_r + (0.117 * w_a_ux - 0.342) * w_a_ux
  );
  if (corr_ia > 1) {
    corr_ia = 1;
  }
  let corr_tot = corr_cl;
  if (clo <= 0.6) {
    corr_tot = ((0.6 - clo) * corr_ia + clo * corr_cl) / 0.6;
  }
  // total dynamic clothing insulation
  let i_tot_dyn = i_tot_st * corr_tot;
  // dynamic boundary layer thermal insulation
  let i_a_dyn = corr_ia * i_a_st;
  const i_cl_dyn = i_tot_dyn - i_a_dyn / fcl;
  // correction for the dynamic permeability index
  const corr_e = (2.6 * corr_tot - 6.5) * corr_tot + 4.9;
  let im_dyn = i_mst * corr_e;
  if (im_dyn > 0.9) {
    im_dyn = 0.9;
  }
  const r_t_dyn = i_tot_dyn / im_dyn / 16.7;
  const t_exp = 28.56 + 0.115 * tdb + 0.641 * p_a; // expired air temperature
  // respiratory convective heat flow [W/m2]
  const c_res = 0.001516 * met * (t_exp - tdb);
  // respiratory evaporative heat flow [W/m2]
  const e_res = 0.00127 * met * (59.34 + 0.53 * tdb - 11.63 * p_a);
  let z = 3.5 + 5.2 * v_r;
  if (v_r > 1) {
    z = 8.7 * Math.pow(v_r, 0.6);
  }

  // dynamic convective heat transfer coefficient
  let hc_dyn = 2.38 * Math.pow(Math.abs(t_sk - tdb), 0.25);
  if (z > hc_dyn) {
    hc_dyn = z;
  }

  const aux_r = 5.67e-8 * a_r_du;
  const f_cl_r = (1 - a_p) * 0.97 + a_p * f_r;

  let d_storage,
    t_sk0,
    t_re0,
    t_cr0,
    t_cr_eq0,
    t_sk_t_cr_wg0,
    t_cr_eq_m,
    d_stored_eq,
    t_sk_eq_cl,
    t_sk_eq_nu,
    t_sk_eq,
    p_sk,
    t_cl,
    t_cl_new,
    h_r,
    convection,
    radiation,
    e_max,
    e_req,
    w_req,
    sw_req,
    e_v_eff,
    e_p,
    k,
    wp,
    t_cr_new,
    t_re_array = [t_re],
    t_cr_array = [t_cr],
    time_array = [0];

  for (let time = 1; time < duration + 1; time++) {
    t_sk0 = t_sk;
    t_re0 = t_re;
    t_cr0 = t_cr;
    t_cr_eq0 = t_cr_eq;
    t_sk_t_cr_wg0 = t_sk_t_cr_wg;

    // equilibrium core temperature associated to the metabolic rate
    t_cr_eq_m = 0.0036 * met + 36.6;
    // Core temperature at this minute, by exponential averaging
    t_cr_eq = t_cr_eq0 * const_t_eq + t_cr_eq_m * (1 - const_t_eq);
    // Heat storage associated with this core temperature increase during the last minute
    d_stored_eq = sp_heat * (t_cr_eq - t_cr_eq0) * (1 - t_sk_t_cr_wg0);
    // skin temperature prediction -- clothed model
    t_sk_eq_cl =
      12.165 + 0.02017 * tdb + 0.04361 * tr + 0.19354 * p_a - 0.25315 * v;
    t_sk_eq_cl = t_sk_eq_cl + 0.005346 * met + 0.51274 * t_re;
    // nude model
    t_sk_eq_nu = 7.191 + 0.064 * tdb + 0.061 * tr + 0.198 * p_a - 0.348 * v;
    t_sk_eq_nu = t_sk_eq_nu + 0.616 * t_re;
    if (clo >= 0.6) {
      t_sk_eq = t_sk_eq_cl;
    } else if (clo <= 0.2) {
      t_sk_eq = t_sk_eq_nu;
    } else {
      t_sk_eq = t_sk_eq_nu + 2.5 * (t_sk_eq_cl - t_sk_eq_nu) * (clo - 0.2);
    }
    // skin temperature [C]
    t_sk = t_sk0 * const_t_sk + t_sk_eq * (1 - const_t_sk);
    // Saturated water vapour pressure at the surface of the skin
    p_sk = 0.6105 * Math.exp((17.27 * t_sk) / (t_sk + 237.3));
    t_cl = tr + 0.1; // clothing surface temperature
    do {
      // radiative heat transfer coefficient
      h_r =
        (f_cl_r * aux_r * (Math.pow(t_cl + 273, 4) - Math.pow(tr + 273, 4))) /
        (t_cl - tr);
      t_cl_new =
        (fcl * (hc_dyn * tdb + h_r * tr) + t_sk / i_cl_dyn) /
        (fcl * (hc_dyn + h_r) + 1 / i_cl_dyn);
      t_cl = (t_cl + t_cl_new) / 2;
    } while (Math.abs(t_cl - t_cl_new) >= 0.001);
    convection = fcl * hc_dyn * (t_cl - tdb);
    radiation = fcl * h_r * (t_cl - tr);
    // maximum evaporative heat flow at the skin surface [W/m2]
    e_max = (p_sk - p_a) / r_t_dyn;
    // required evaporative heat flow [W/m2]
    e_req = met - d_stored_eq - wme - c_res - e_res - convection - radiation;
    // required skin wettedness
    w_req = e_req / e_max;

    if (e_req <= 0) {
      e_req = 0;
      sw_req = 0; // required sweat rate [W/m2]
    } else if (e_max <= 0) {
      e_max = 0;
      sw_req = sw_max;
    } else if (w_req >= 1.7) {
      sw_req = sw_max;
    } else {
      e_v_eff = 1 - Math.pow(w_req, 2) / 2;
      if (w_req > 1) {
        e_v_eff = Math.pow(2 - w_req, 2) / 2;
      }
      sw_req = e_req / e_v_eff;
      if (sw_req > sw_max) {
        sw_req = sw_max;
      }
    }
    sweat_rate = sweat_rate * const_sw + sw_req * (1 - const_sw);
    if (sweat_rate <= 0) {
      e_p = 0;
      // predicted evaporative heat flow [W / m2]
      sweat_rate = 0;
    } else {
      k = e_max / sweat_rate;
      wp = 1;
      if (k >= 0.5) {
        wp = -k + Math.sqrt(k * k + 2);
      }
      if (wp > w_max) {
        wp = w_max;
      }
      e_p = wp * e_max;
    }
    // body heat storage rate [W/m2]
    d_storage = e_req - e_p + d_stored_eq;
    t_cr_new = t_cr0;
    do {
      t_sk_t_cr_wg = 0.3 - 0.09 * (t_cr_new - 36.8);
      if (t_sk_t_cr_wg > 0.3) {
        t_sk_t_cr_wg = 0.3;
      }
      if (t_sk_t_cr_wg < 0.1) {
        t_sk_t_cr_wg = 0.1;
      }
      t_cr =
        d_storage / sp_heat +
        (t_sk0 * t_sk_t_cr_wg0) / 2 -
        (t_sk * t_sk_t_cr_wg) / 2;
      t_cr = (t_cr + t_cr0 * (1 - t_sk_t_cr_wg0 / 2)) / (1 - t_sk_t_cr_wg / 2);
      t_cr_new = (t_cr_new + t_cr) / 2;
    } while (Math.abs(t_cl - t_cl_new) >= 0.001);

    t_re = t_re0 + (2 * t_cr - 1.962 * t_re0 - 1.31) / 9;

    if (d_lim_t_re === 0 && t_re >= 38) {
      d_lim_t_re = time;
    }
    sw_tot = sw_tot + sweat_rate + e_res;
    sw_tot_g = (sw_tot * 2.67 * a_dubois) / 1.8 / 60;
    if (d_lim_loss_50 === 0 && sw_tot_g >= d_max_50) {
      d_lim_loss_50 = time;
    }
    if (d_lim_loss_95 === 0 && sw_tot_g >= d_max_95) {
      d_lim_loss_95 = time;
    }
    if (drink === 0) {
      d_lim_loss_95 = d_lim_loss_95 * 0.6;
      d_lim_loss_50 = d_lim_loss_95;
    }
    t_re_array.push(parseFloat(t_re.toFixed(3)));
    t_cr_array.push(parseFloat(t_cr.toFixed(3)));
    time_array.push(time);
  }
  if (d_lim_loss_50 === 0) {
    d_lim_loss_50 = duration;
  }
  if (d_lim_loss_95 === 0) {
    d_lim_loss_95 = duration;
  }
  if (d_lim_t_re === 0) {
    d_lim_t_re = duration;
  }

  return {
    t_re: round ? parseFloat(t_re.toFixed(1)) : t_re,
    t_cr: round ? parseFloat(t_cr.toFixed(1)) : t_cr,
    d_lim_loss_50: d_lim_loss_50,
    d_lim_loss_95: d_lim_loss_95,
    d_lim_t_re: d_lim_t_re,
    sw_tot_g: parseFloat(sw_tot_g.toFixed(0)),
    t_re_array: t_re_array,
    time_array: time_array,
    t_cr_array: t_cr_array,
  };
};

comf.FindSaturatedVaporPressureTorr = function (T) {
  //calculates Saturated Vapor Pressure (Torr) at Temperature T  (C)
  return Math.exp(18.6686 - 4030.183 / (T + 235.0));
};

comf.pierceSET = function (
  ta,
  tr,
  vel,
  rh,
  met,
  clo,
  wme = 0,
  round = false,
  calculateCE = false,
  maxSkinBloodFlow = 90,
  bodyPosition = "sitting"
) {
  /**
   * SET calculation using code provided in ASHRAE 55
   * @param  {Number} ta      dry bulb air temperature, [C]
   * @param  {Number} tr      mean radiant temperature, [C]
   * @param  {Number} vel     air speed, [m/s]
   * @param  {Number} rh      relative humidity, [%]
   * @param  {Number} met     metabolic rate, [met]
   * @param  {Number} clo     clothing level, [clo]
   * @param  {Number} wme     external work, [met]
   * @return {Number} X       SET temperature
   */

  let DELTA;
  let DRY;
  let HFCS;
  let ERES;
  let CRES;
  let SCR;
  let SSK;
  let TCSK;
  let TB;
  let SKSIG;
  let WARMS;
  let COLDS;
  let WARMC;
  let COLDC;
  let CRSIG;
  let WARMB;
  let REGSW;
  let BDSIG;
  let REA;
  let RECL;
  let EMAX;
  let PRSW;
  let PWET;
  let EDIF;
  let TCCR;
  let DTSK;
  let DTCR;
  let ERSW;
  let _set;
  let X_OLD;
  let CHCS;
  let HSK;
  let W;
  let PSSK;
  let CHRS;
  let CTCS;
  let RCLOS;
  let RCLS;
  let FACLS;
  let FCLS;
  let IMS;
  let ICLS;
  let RAS;
  let REAS;
  let RECLS;
  let HD_S;
  let HE_S;

  const VaporPressure = (rh * comf.FindSaturatedVaporPressureTorr(ta)) / 100;
  const AirSpeed = Math.max(vel, 0.1);
  const KClo = 0.25;
  const BodyWeight = 69.9;
  const BodySurfaceArea = 1.8258;
  const MetFactor = 58.2;
  const SBC = 0.000000056697; // Stefan-Boltzmann constant (W/m2K4)
  const CSW = 170;
  const CDil = 200;
  const CStr = 0.5;

  const TempSkinNeutral = 33.7; // set point (neutral) value for Tsk
  const TempCoreNeutral = 36.8; // set point value for Tcr
  const TempBodyNeutral = 36.49; // set point for Tb (.1*TempSkinNeutral + .9*TempCoreNeutral)
  const SkinBloodFlowNeutral = 6.3; //neutral value for SkinBloodFlow

  // check if any max value was exceeded and thermal strain occurred
  let ExcBloodFlow = false;
  let ExcRegulatorySweating = false;
  let ExcCriticalWettedness = false;

  // function that check if all are false
  let checker_false = (arr) => arr.every((v) => v === false);

  //INITIAL VALUES - start of 1st experiment
  let TempSkin = TempSkinNeutral;
  let TempCore = TempCoreNeutral;
  let SkinBloodFlow = SkinBloodFlowNeutral;
  let MSHIV = 0.0;
  let ALFA = 0.1;
  let ESK = 0.1 * met;

  const p = psy.PROP.Patm / 1000;
  const PressureInAtmospheres = p * 0.009869;
  const LTime = 60.0;
  const RCl = 0.155 * clo;

  const FACL = 1.0 + 0.15 * clo; // INCREASE IN BODY SURFACE AREA DUE TO CLOTHING
  const LR = 2.2 / PressureInAtmospheres; // Lewis Relation is 2.2 at sea level
  const RM = met * MetFactor;
  let M = met * MetFactor;

  let WCRIT;
  let ICL;

  if (clo <= 0) {
    WCRIT = 0.38 * Math.pow(AirSpeed, -0.29);
    ICL = 1.0;
  } else {
    WCRIT = 0.59 * Math.pow(AirSpeed, -0.08);
    ICL = 0.45;
  }

  let heatTransferConvMet;
  if (met < 0.85) {
    heatTransferConvMet = 3.0;
  } else {
    heatTransferConvMet = 5.66 * Math.pow(met - 0.85, 0.39);
  }
  let CHC = 3.0 * Math.pow(PressureInAtmospheres, 0.53);
  let CHCV = 8.600001 * Math.pow(AirSpeed * PressureInAtmospheres, 0.53);
  CHC = Math.max(CHC, CHCV);
  if (!calculateCE) {
    CHC = Math.max(CHC, heatTransferConvMet);
  }

  //initial estimate of Tcl
  let CHR = 4.7;
  let CTC = CHR + CHC;
  let RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
  let TOP = (CHR * tr + CHC * ta) / CTC;
  let TCL = TOP + (TempSkin - TOP) / (CTC * (RA + RCl));

  // ========================  BEGIN ITERATION
  //
  // Tcl and CHR are solved iteratively using: H(Tsk - To) = CTC(Tcl - To),
  //  where H = 1/(Ra + Rcl) and Ra = 1/Facl*CTC
  //

  let TCL_OLD = TCL;
  let TIM;
  let flag = true;
  for (TIM = 1; TIM <= LTime; TIM++) {
    do {
      if (flag) {
        TCL_OLD = TCL;
        if (bodyPosition === "sitting") {
          CHR =
            4.0 * 0.95 * SBC * Math.pow((TCL + tr) / 2.0 + 273.15, 3.0) * 0.7;
        } else {
          CHR =
            4.0 * 0.95 * SBC * Math.pow((TCL + tr) / 2.0 + 273.15, 3.0) * 0.73;
        }
        CTC = CHR + CHC;
        RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
        TOP = (CHR * tr + CHC * ta) / CTC;
      }
      TCL = (RA * TempSkin + RCl * TOP) / (RA + RCl);
      flag = true;
    } while (Math.abs(TCL - TCL_OLD) > 0.01);
    flag = false;
    DRY = (TempSkin - TOP) / (RA + RCl);
    HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
    ERES = 0.0023 * M * (44.0 - VaporPressure);
    CRES = 0.0014 * M * (34.0 - ta);
    SCR = M - HFCS - ERES - CRES - wme;
    SSK = HFCS - DRY - ESK;
    TCSK = 0.97 * ALFA * BodyWeight;
    TCCR = 0.97 * (1 - ALFA) * BodyWeight;
    DTSK = (SSK * BodySurfaceArea) / (TCSK * 60.0); //deg C per minute
    DTCR = (SCR * BodySurfaceArea) / (TCCR * 60.0); //deg C per minute
    TempSkin = TempSkin + DTSK;
    TempCore = TempCore + DTCR;
    TB = ALFA * TempSkin + (1 - ALFA) * TempCore;
    SKSIG = TempSkin - TempSkinNeutral;
    WARMS = (SKSIG > 0) * SKSIG;
    COLDS = (-1.0 * SKSIG > 0) * (-1.0 * SKSIG);
    CRSIG = TempCore - TempCoreNeutral;
    WARMC = (CRSIG > 0) * CRSIG;
    COLDC = (-1.0 * CRSIG > 0) * (-1.0 * CRSIG);
    BDSIG = TB - TempBodyNeutral;
    WARMB = (BDSIG > 0) * BDSIG;
    SkinBloodFlow = (SkinBloodFlowNeutral + CDil * WARMC) / (1 + CStr * COLDS);
    if (SkinBloodFlow > maxSkinBloodFlow) {
      SkinBloodFlow = maxSkinBloodFlow;
      ExcBloodFlow = true;
    }
    if (SkinBloodFlow < 0.5) SkinBloodFlow = 0.5;
    REGSW = CSW * WARMB * Math.exp(WARMS / 10.7);
    if (REGSW > 500.0) {
      REGSW = 500.0;
      ExcRegulatorySweating = true;
    }
    ERSW = 0.68 * REGSW;
    REA = 1.0 / (LR * FACL * CHC); //evaporative resistance of air layer
    RECL = RCl / (LR * ICL); //evaporative resistance of clothing (icl=.45)
    EMAX =
      (comf.FindSaturatedVaporPressureTorr(TempSkin) - VaporPressure) /
      (REA + RECL);
    PRSW = ERSW / EMAX;
    PWET = 0.06 + 0.94 * PRSW;
    EDIF = PWET * EMAX - ERSW;
    if (PWET > WCRIT) {
      PWET = WCRIT;
      PRSW = WCRIT / 0.94;
      ERSW = PRSW * EMAX;
      EDIF = 0.06 * (1.0 - PRSW) * EMAX;
      ExcCriticalWettedness = true;
    }
    if (EMAX < 0) {
      EDIF = 0;
      ERSW = 0;
      PWET = WCRIT;
      PRSW = WCRIT;
    }
    ESK = ERSW + EDIF;
    MSHIV = 19.4 * COLDS * COLDC;
    M = RM + MSHIV;
    ALFA = 0.0417737 + 0.7451833 / (SkinBloodFlow + 0.585417);
  }

  HSK = DRY + ESK; //total heat loss from skin
  W = PWET;
  PSSK = comf.FindSaturatedVaporPressureTorr(TempSkin);
  // Definition of ASHRAE standard environment... denoted "S"
  CHRS = CHR;
  CHCS = 3.0 * Math.pow(PressureInAtmospheres, 0.53);
  if (!calculateCE && met > 0.85) {
    CHCS = Math.max(CHCS, heatTransferConvMet);
  }
  if (CHCS < 3.0) CHCS = 3.0;
  CTCS = CHCS + CHRS;
  RCLOS = 1.52 / (met - wme / MetFactor + 0.6944) - 0.1835;
  RCLS = 0.155 * RCLOS;
  FACLS = 1.0 + KClo * RCLOS;
  FCLS = 1.0 / (1.0 + 0.155 * FACLS * CTCS * RCLOS);
  IMS = 0.45;
  ICLS = (((IMS * CHCS) / CTCS) * (1 - FCLS)) / (CHCS / CTCS - FCLS * IMS);
  RAS = 1.0 / (FACLS * CTCS);
  REAS = 1.0 / (LR * FACLS * CHCS);
  RECLS = RCLS / (LR * ICLS);
  HD_S = 1.0 / (RAS + RCLS);
  HE_S = 1.0 / (REAS + RECLS);

  // SET* (standardized humidity, clo, Pb, and CHC)
  // determined using Newton iterative solution

  DELTA = 0.0001;
  let ERR1, ERR2;
  let dx = 100.0;
  X_OLD = TempSkin - HSK / HD_S; //lower bound for SET
  while (Math.abs(dx) > 0.01) {
    ERR1 =
      HSK -
      HD_S * (TempSkin - X_OLD) -
      W * HE_S * (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr(X_OLD));
    ERR2 =
      HSK -
      HD_S * (TempSkin - (X_OLD + DELTA)) -
      W *
        HE_S *
        (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr(X_OLD + DELTA));
    _set = X_OLD - (DELTA * ERR1) / (ERR2 - ERR1);
    dx = _set - X_OLD;
    X_OLD = _set;
  }

  let r = {};

  r.set = round ? parseFloat(_set.toFixed(1)) : _set;
  r.t_skin = TempSkin;
  r.t_core = TempCore;
  r.t_clo = TCL;
  r.t_mean_body = TB;
  r.q_tot_evap = ESK;
  r.q_sweat_evap = ERSW;
  r.q_vap_diff = EDIF;
  r.q_tot_sensible = DRY;
  r.q_tot_skin = HSK;
  r.q_resp = ERES;
  r.skin_wet = PWET * 100;
  r.thermal_strain = !checker_false([
    ExcRegulatorySweating,
    ExcBloodFlow,
    ExcCriticalWettedness,
  ]);

  return r;
};

comf.schiavonClo = function (ta6) {
  let clo_r;
  if (!isCelsius) ta6 = util.FtoC(ta6);
  if (ta6 < -5) {
    clo_r = 1;
  } else if (ta6 < 5) {
    clo_r = 0.818 - 0.0364 * ta6;
  } else if (ta6 < 26) {
    clo_r = Math.pow(10, -0.1635 - 0.0066 * ta6);
  } else {
    clo_r = 0.46;
  }
  return clo_r;
};

comf.adaptiveComfortEN = function (ta, tr, runningMean, vel) {
  let coolingEffect = 0;

  const to = (ta + tr) / 2;

  // we decided to add a criterion on the running mean even if not specified in the standard
  if (vel >= 1.2 && to > 25 && runningMean > 12.73) {
    // calculate cooling effect of elevated air speed
    // when top > 25 degC.
    coolingEffect = 2.2;
  } else if (vel >= 0.9 && to > 25 && runningMean > 12.73) {
    coolingEffect = 1.8;
  } else if (vel >= 0.6 && to > 25 && runningMean > 12.73) {
    coolingEffect = 1.2;
  }

  const tmpComfort = 0.33 * runningMean + 18.8;
  const tComfortILower = tmpComfort - 3;
  const tComfortIUpper = tmpComfort + 2 + coolingEffect;
  const tComfortIILower = tmpComfort - 4;
  const tComfortIIUpper = tmpComfort + 3 + coolingEffect;
  const tComfortIIILower = tmpComfort - 5;
  const tComfortIIIUpper = tmpComfort + 4 + coolingEffect;
  let acceptabilityI, acceptabilityII, acceptabilityIII;

  if (comf.between(to, tComfortILower, tComfortIUpper)) {
    // compliance at all levels
    acceptabilityI = acceptabilityII = acceptabilityIII = true;
  } else if (comf.between(to, tComfortIILower, tComfortIIUpper)) {
    // compliance at II and III only
    acceptabilityII = acceptabilityIII = true;
    acceptabilityI = false;
  } else if (comf.between(to, tComfortIIILower, tComfortIIIUpper)) {
    // compliance at III only
    acceptabilityIII = true;
    acceptabilityI = acceptabilityII = false;
  } else {
    // neither
    acceptabilityI = acceptabilityII = acceptabilityIII = false;
  }

  let r = {};
  r.acceptabilityI = acceptabilityI;
  r.acceptabilityII = acceptabilityII;
  r.acceptabilityIII = acceptabilityIII;
  r.tComfILower = tComfortILower;
  r.tComfIILower = tComfortIILower;
  r.tComfIIILower = tComfortIIILower;
  r.tComfIUpper = tComfortIUpper;
  r.tComfIIUpper = tComfortIIUpper;
  r.tComfIIIUpper = tComfortIIIUpper;
  return r;
};
