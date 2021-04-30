function asymmetryRisk(rad_DT_warmC, rad_DT_coolC, rad_DT_warmW, rad_DT_coolW) {
  return [
    rad_DT_warmC >= 5 ||
      rad_DT_coolC >= 14 ||
      rad_DT_warmW >= 23 ||
      rad_DT_coolW >= 10,
    rad_DT_warmC >= 5,
    rad_DT_coolC >= 14,
    rad_DT_warmW >= 23,
    rad_DT_coolW >= 10,
  ];
}

// -------------------------- PPD with vertical temperature gradient -------------------------------------------------
function verticalGradientPPD(parameters) {
  const TSV = comf.pmvElevatedAirspeed(
    parameters.tmp_grad_ta,
    parameters.tmp_grad_tr,
    parameters.tmp_grad_v,
    parameters.tmp_grad_rh,
    parameters.tmp_grad_met,
    parameters.tmp_grad_clo,
    0
  ).pmv;

  const numerator = Math.exp(
    0.13 * Math.pow(TSV - 1.91, 2) + 0.15 * parameters.vert_temp_gradient - 1.6
  );
  const ppdValue = numerator / (1 + numerator) - 0.345;

  return Math.max(ppdValue, 0);
}

//-------------------------- Floor surface temperature -------------------------------------------------
function floorRisk(T_floor) {
  return [T_floor < 19 || T_floor > 29];
}

// -------------------------------- Draft ----------------------------------------------------------------------
function draftRisk(T_op, local_vel) {
  return (T_op < 23.0) & (local_vel > 0.2);
}

// -------------------------------- Ankle Draft ----------------------------------------------------------------------
function ankleDraft(ankle_vel, overall_pmv) {
  return (
    Math.exp(-2.58 + 3.05 * ankle_vel - 1.06 * overall_pmv) /
    (1 + Math.exp(-2.58 + 3.05 * ankle_vel - 1.06 * overall_pmv))
  );
}

//------------------------------- For the dialog --------------------------------------
// NOTE: due to how the code is structured, "true" means that there is local discomfort, so the space does NOT comply.

function updateLocalDisc() {
  const localDisc = {};
  let msg;
  localDisc.rad_DT_warmC = parseFloat($("#rad_DT_warmC").val());
  localDisc.rad_DT_coolC = parseFloat($("#rad_DT_coolC").val());
  localDisc.rad_DT_warmW = parseFloat($("#rad_DT_warmW").val());
  localDisc.rad_DT_coolW = parseFloat($("#rad_DT_coolW").val());
  localDisc.T_floor = parseFloat($("#T_floor").val());
  localDisc.T_op = parseFloat($("#T_op").val());
  localDisc.local_Ta = parseFloat($("#local_Ta").val());
  localDisc.local_Tr = parseFloat($("#local_Tr").val());
  localDisc.local_V = parseFloat($("#local_V").val());
  localDisc.local_rh = parseFloat($("#local_rh").val());
  localDisc.local_met = parseFloat($("#local_met").val());
  localDisc.local_clo = parseFloat($("#local_clo").val());
  localDisc.local_vel = parseFloat($("#local_vel").val());
  localDisc.local_ank_vel = parseFloat($("#local_ank_vel").val());
  // vertical temperature gradient inputs
  localDisc.vert_temp_gradient = parseFloat($("#vertical_temp_gradient").val());
  localDisc.tmp_grad_ta = parseFloat($("#tmp_grad_ta").val());
  localDisc.tmp_grad_tr = parseFloat($("#tmp_grad_tr").val());
  localDisc.tmp_grad_v = parseFloat($("#tmp_grad_v").val());
  localDisc.tmp_grad_rh = parseFloat($("#tmp_grad_rh").val());
  localDisc.tmp_grad_clo = parseFloat($("#tmp_grad_clo").val());
  localDisc.tmp_grad_met = parseFloat($("#tmp_grad_met").val());

  $(function () {
    const limitInput = function () {
      const value = parseFloat(this.value, 10);
      const min = 0.06;
      if (value < min) {
        this.value = min;
      }
    };
    $("#local_ank_vel").change(limitInput);
  });

  if (!isCelsius) {
    localDisc.rad_DT_warmC = (localDisc.rad_DT_warmC * 5) / 9;
    localDisc.rad_DT_coolC = (localDisc.rad_DT_coolC * 5) / 9;
    localDisc.rad_DT_warmW = (localDisc.rad_DT_warmW * 5) / 9;
    localDisc.rad_DT_coolW = (localDisc.rad_DT_coolW * 5) / 9;
    localDisc.T_floor = util.FtoC(localDisc.T_floor);
    localDisc.T_op = util.FtoC(localDisc.T_op);
    localDisc.local_Ta = util.FtoC(localDisc.local_Ta);
    localDisc.local_Tr = util.FtoC(localDisc.local_Tr);
    localDisc.local_V = util.FtoC(localDisc.local_V);
    localDisc.local_vel /= 196.9;
    localDisc.local_ank_vel /= 196.9;
    // vertical temperature gradient inputs
    localDisc.vert_temp_gradient = (localDisc.vert_temp_gradient / 1.8) * 3.28;
    localDisc.tmp_grad_ta = util.FtoC(localDisc.tmp_grad_ta);
    localDisc.tmp_grad_tr = util.FtoC(localDisc.tmp_grad_tr);
    localDisc.tmp_grad_v /= 196.9;

    $(function () {
      var limitInput = function () {
        const value = parseFloat(this.value, 10);
        const min = 20;
        if (value < min) {
          this.value = min;
        }
      };
      $("#local_ank_vel").change(limitInput);
    });
  }

  const asym_res = asymmetryRisk(
    localDisc.rad_DT_warmC,
    localDisc.rad_DT_coolC,
    localDisc.rad_DT_warmW,
    localDisc.rad_DT_coolW
  );
  const vert_grad_ppd = 100 * verticalGradientPPD(localDisc);
  const floor_res = floorRisk(localDisc.T_floor);
  const draft_res = draftRisk(localDisc.T_op, localDisc.local_vel);
  const draft_pmv_res = comf.pmv(
    localDisc.local_Ta,
    localDisc.local_Tr,
    localDisc.local_V,
    localDisc.local_rh,
    localDisc.local_met,
    localDisc.local_clo,
    0
  );
  const ank_draft_res =
    ankleDraft(localDisc.local_ank_vel, draft_pmv_res.pmv) * 100;
  const clo_check = localDisc.local_clo;
  const met_check = localDisc.local_met;

  //if (asym_res[1] > 5){
  if (asym_res[1]) {
    msg = "&#10008; &nbsp; &nbsp; "; /* + asym_res[1].toFixed(0) + "%" */
    $("#rad-warmC-res").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; "; /* + asym_res[1].toFixed(0) + "%" */
    $("#rad-warmC-res").css("color", "green");
  }
  $("#rad-warmC-res").html(msg);

  // if (asym_res[2] > 5){
  if (asym_res[2]) {
    msg = "&#10008; &nbsp; &nbsp; "; /* + asym_res[2].toFixed(0) + "%" */
    $("#rad-coolC-res").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; "; /* + asym_res[2].toFixed(0) + "%" */
    $("#rad-coolC-res").css("color", "green");
  }
  $("#rad-coolC-res").html(msg);

  // if (asym_res[3] > 5){
  if (asym_res[3]) {
    msg = "&#10008; &nbsp; &nbsp; "; /* + asym_res[3].toFixed(0) + "%" */
    $("#rad-warmW-res").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; "; /* + asym_res[3].toFixed(0) + "%" */
    $("#rad-warmW-res").css("color", "green");
  }
  $("#rad-warmW-res").html(msg);

  // if (asym_res[4] > 5){
  if (asym_res[4]) {
    msg = "&#10008; &nbsp; &nbsp; "; /* + asym_res[4].toFixed(0) + "%" */
    $("#rad-coolW-res").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; "; /* + asym_res[4].toFixed(0) + "%" */
    $("#rad-coolW-res").css("color", "green");
  }
  $("#rad-coolW-res").html(msg);

  $("#vertical_temp_gradient_ppd").attr("value", vert_grad_ppd.toFixed(0));
  if (vert_grad_ppd > 5) {
    msg = "&#10008";
    $("#vertical_temp_gradient_compliance").css("color", "red");
  } else {
    msg = "&#10004";
    $("#vertical_temp_gradient_compliance").css("color", "green");
  }
  $("#vertical_temp_gradient_compliance").html(msg);

  if (floor_res[0]) {
    msg = "&#10008; &nbsp; &nbsp; "; /* + floor_res[1].toFixed(0) + "%" */
    $("#floor-disc").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; "; /* + floor_res[1].toFixed(0) + "%" */
    $("#floor-disc").css("color", "green");
  }
  $("#floor-disc").html(msg);

  if (draft_res) {
    msg = "&#10008; &nbsp; &nbsp; ";
    $("#draft-disc").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; ";
    $("#draft-disc").css("color", "green");
  }
  $("#draft-disc").html(msg);

  if (asym_res[0] || floor_res[0] || draft_res || ank_draft_res > 20) {
    msg = "&#10008; &nbsp; Does not comply with ASHRAE Standard 55-2020";
    $("#all-disc").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; Complies with ASHRAE Standard 55-2020";
    $("#all-disc").css("color", "green");
  }
  $("#all-disc").html(msg);

  $("#draft_pmv_res").attr("value", draft_pmv_res.pmv.toFixed(2));
  $("#ankle-draft-disc").attr("value", ank_draft_res.toFixed(0));

  if (ank_draft_res > 20) {
    msg = "&#10008; &nbsp; &nbsp; ";
    $("#ank-draft-sign").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; &nbsp; ";
    $("#ank-draft-sign").css("color", "green");
  }
  $("#ank-draft-sign").html(msg);

  if (clo_check > 0.7) {
    msg = "&#10008; clo > 0.7";
    $("#col-sign").css("color", "red");
  } else {
    msg = "trivial";
    $("#col-sign").css("color", "white");
  }
  $("#col-sign").html(msg);

  if (met_check > 1.3) {
    msg = "&#10008; met > 1.3";
    $("#met-sign").css("color", "red");
  } else {
    msg = "trivial";
    $("#met-sign").css("color", "white");
  }
  $("#met-sign").html(msg);
}
