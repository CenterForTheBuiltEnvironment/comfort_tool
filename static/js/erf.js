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

function radians_to_degrees(radians) {
  const pi = Math.PI;
  return radians * (180 / pi);
}

function degrees_to_radians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

function get_fp(alt, az, posture) {
  //  This function calculates the projected sunlit fraction (fp)
  //  given a seated or standing posture, a solar altitude, and a
  //  solar horizontal angle relative to the person (SHARP). fp
  //  values are taken from Thermal Comfort, Fanger 1970, Danish
  //  Technical Press.

  //  alt : altitude of sun in degrees [0, 90] Integer
  //  az : azimuth of sun in degrees [0, 180] Integer

  let fp_table;

  if (posture === "standing" || posture === "supine") {
    fp_table = [
      /*azm=0*/ [0.35, 0.35, 0.314, 0.258, 0.206, 0.144, 0.082],
      /*azm=15*/ [0.342, 0.342, 0.31, 0.252, 0.2, 0.14, 0.082],
      /*azm=30*/ [0.33, 0.33, 0.3, 0.244, 0.19, 0.132, 0.082],
      /*azm=45*/ [0.31, 0.31, 0.275, 0.228, 0.175, 0.124, 0.082],
      /*azm=60*/ [0.283, 0.283, 0.251, 0.208, 0.16, 0.114, 0.082],
      /*azm=75*/ [0.252, 0.252, 0.228, 0.188, 0.15, 0.108, 0.082],
      /*azm=90*/ [0.23, 0.23, 0.214, 0.18, 0.148, 0.108, 0.082],
      /*azm=105*/ [0.242, 0.242, 0.222, 0.18, 0.153, 0.112, 0.082],
      /*azm=120*/ [0.274, 0.274, 0.245, 0.203, 0.165, 0.116, 0.082],
      /*azm=135*/ [0.304, 0.304, 0.27, 0.22, 0.174, 0.121, 0.082],
      /*azm=150*/ [0.328, 0.328, 0.29, 0.234, 0.183, 0.125, 0.082],
      /*azm=165*/ [0.344, 0.344, 0.304, 0.244, 0.19, 0.128, 0.082],
      /*azm=180*/ [0.347, 0.347, 0.308, 0.246, 0.191, 0.128, 0.082],
    ];
  } else {
    // if posture === 'seated'
    fp_table = [
      /*azm=0*/ [0.29, 0.324, 0.305, 0.303, 0.262, 0.224, 0.177],
      /*azm=15*/ [0.292, 0.328, 0.294, 0.288, 0.268, 0.227, 0.177],
      /*azm=30*/ [0.288, 0.332, 0.298, 0.29, 0.264, 0.222, 0.177],
      /*azm=45*/ [0.274, 0.326, 0.294, 0.289, 0.252, 0.214, 0.177],
      /*azm=60*/ [0.254, 0.308, 0.28, 0.276, 0.241, 0.202, 0.177],
      /*azm=75*/ [0.23, 0.282, 0.262, 0.26, 0.233, 0.193, 0.177],
      /*azm=90*/ [0.216, 0.26, 0.248, 0.244, 0.22, 0.186, 0.177],
      /*azm=105*/ [0.234, 0.258, 0.236, 0.227, 0.208, 0.18, 0.177],
      /*azm=120*/ [0.262, 0.26, 0.224, 0.208, 0.196, 0.176, 0.177],
      /*azm=135*/ [0.28, 0.26, 0.21, 0.192, 0.184, 0.17, 0.177],
      /*azm=150*/ [0.298, 0.256, 0.194, 0.174, 0.168, 0.168, 0.177],
      /*azm=165*/ [0.306, 0.25, 0.18, 0.156, 0.156, 0.166, 0.177],
      /*azm=180*/ [0.3, 0.24, 0.168, 0.152, 0.152, 0.164, 0.177],
    ];
  }

  if (posture === "supine") {
    // transpose alt and az for a supine person
    const altitude_new = radians_to_degrees(
      Math.asin(
        Math.sin(degrees_to_radians(Math.abs(az - 90))) *
          Math.cos(degrees_to_radians(alt))
      )
    );
    az = radians_to_degrees(
      Math.atan(
        Math.sin(degrees_to_radians(az)) *
          Math.tan(degrees_to_radians(90 - alt))
      )
    );
    alt = altitude_new;
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
  const hr = 6;
  const I_diff = 0.2 * I_dir;

  // Floor reflectance
  const R_floor = 0.6;

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
  const E_direct = f_eff * fp * t_sol * f_bes * I_dir;
  const E_reflected =
    f_eff *
    f_svv *
    0.5 *
    t_sol *
    (I_dir * Math.sin(alt * DEG_TO_RAD) + I_diff) *
    R_floor;

  const E_solar = E_diff + E_direct + E_reflected;
  const _ERF = E_solar * (sw_abs / lw_abs);
  const dMRT = _ERF / (hr * f_eff);

  return { ERF: _ERF, dMRT: dMRT };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { degrees_to_radians, radians_to_degrees, ERF };
}
