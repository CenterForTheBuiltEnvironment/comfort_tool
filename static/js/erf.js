function find_span(arr, x) {
  // for ordered array arr and value x, find the left index
  // of the closed interval that the value falls in.
  for (let i = 0; i < arr.length - 1; i++) {
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

  // fp_table for both standing and supine person
  let fp_table = [
    [0.25, 0.25, 0.23, 0.19, 0.15, 0.1, 0.06],
    [0.25, 0.25, 0.23, 0.18, 0.15, 0.1, 0.06],
    [0.24, 0.24, 0.22, 0.18, 0.14, 0.1, 0.06],
    [0.22, 0.22, 0.2, 0.17, 0.13, 0.09, 0.06],
    [0.21, 0.21, 0.18, 0.15, 0.12, 0.08, 0.06],
    [0.18, 0.18, 0.17, 0.14, 0.11, 0.08, 0.06],
    [0.17, 0.17, 0.16, 0.13, 0.11, 0.08, 0.06],
    [0.18, 0.18, 0.16, 0.13, 0.11, 0.08, 0.06],
    [0.2, 0.2, 0.18, 0.15, 0.12, 0.08, 0.06],
    [0.22, 0.22, 0.2, 0.16, 0.13, 0.09, 0.06],
    [0.24, 0.24, 0.21, 0.17, 0.13, 0.09, 0.06],
    [0.25, 0.25, 0.22, 0.18, 0.14, 0.09, 0.06],
    [0.25, 0.25, 0.22, 0.18, 0.14, 0.09, 0.06],
  ];

  if (posture === "seated") {
    fp_table = [
      [0.2, 0.23, 0.21, 0.21, 0.18, 0.16, 0.12],
      [0.2, 0.23, 0.2, 0.2, 0.2, 0.19, 0.16, 0.12],
      [0.2, 0.23, 0.21, 0.2, 0.18, 0.15, 0.12],
      [0.19, 0.23, 0.2, 0.2, 0.18, 0.15, 0.12],
      [0.18, 0.21, 0.19, 0.19, 0.17, 0.14, 0.12],
      [0.16, 0.2, 0.18, 0.18, 0.16, 0.13, 0.12],
      [0.15, 0.18, 0.17, 0.17, 0.15, 0.13, 0.12],
      [0.16, 0.18, 0.16, 0.16, 0.14, 0.13, 0.12],
      [0.18, 0.18, 0.16, 0.14, 0.14, 0.12, 0.12],
      [0.19, 0.18, 0.15, 0.13, 0.13, 0.12, 0.12],
      [0.21, 0.18, 0.14, 0.12, 0.12, 0.12, 0.12],
      [0.21, 0.17, 0.13, 0.11, 0.11, 0.12, 0.12],
      [0.21, 0.17, 0.12, 0.11, 0.11, 0.11, 0.12],
    ];
  }

  if (posture === "supine") {
    // transpose alt and az for a supine person
    const alt_temp = alt;
    alt = Math.abs(90 - az);
    az = alt_temp;
  }

  let fp;
  const alt_range = [0, 15, 30, 45, 60, 75, 90];
  const az_range = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  const alt_i = find_span(alt_range, alt);
  const az_i = find_span(az_range, az);

  const fp11 = fp_table[az_i][alt_i];
  const fp12 = fp_table[az_i][alt_i + 1];
  const fp21 = fp_table[az_i + 1][alt_i];
  const fp22 = fp_table[az_i + 1][alt_i + 1];

  const az1 = az_range[az_i];
  const az2 = az_range[az_i + 1];
  const alt1 = alt_range[alt_i];
  const alt2 = alt_range[alt_i + 1];

  // bi-linear interpolation
  fp = fp11 * (az2 - az) * (alt2 - alt);
  fp += fp21 * (az - az1) * (alt2 - alt);
  fp += fp12 * (az2 - az) * (alt - alt1);
  fp += fp22 * (az - az1) * (alt - alt1);
  fp /= (az2 - az1) * (alt2 - alt1);

  return fp;
}

function ERF(alt, az, posture, I_dir, t_sol, f_svv, f_bes, asa) {
  //  ERF function to estimate the impact of solar radiation on occupant comfort
  //  INPUTS:
  //  alt : altitude of sun in degrees [0, 90]
  //  az : azimuth of sun in degrees [0, 180]
  //  posture: posture of occupant ('seated', 'standing', or 'supine')
  //  I_dir : direct beam intensity (normal)
  //  t_sol: total solar transmittance (SC * 0.87)
  //  f_svv : sky vault view fraction : fraction of sky vault in occupant's view [0, 1]
  //  f_bes : fraction body exposed to sun [0, 1]
  //  asa : avg shortwave abs : average shortwave absorptivity of body [0, 1]

  const DEG_TO_RAD = 0.0174532925;
  const h_r = 6;
  const I_diff = 0.2 * I_dir;

  // Floor reflectance
  const r_floor = 0.6;

  const fp = get_fp(alt, az, posture);

  let f_eff;
  if (posture === "standing" || posture === "supine") {
    f_eff = 0.725;
  } else if (posture === "seated") {
    f_eff = 0.696;
  } else {
    return;
  }

  const sw_abs = asa;
  const lw_abs = 0.95;

  const E_diff = f_eff * f_svv * 0.5 * t_sol * I_diff;
  const E_direct = fp * t_sol * f_bes * I_dir;
  const E_reflected =
    f_eff *
    f_svv *
    0.5 *
    t_sol *
    (I_dir * Math.sin(alt * DEG_TO_RAD) + I_diff) *
    r_floor;

  const E_solar = E_diff + E_direct + E_reflected;
  const erf_value = E_solar * (sw_abs / lw_abs);
  const delta_mrt = erf_value / (h_r * f_eff);

  return { ERF: erf_value, dMRT: delta_mrt };
}
