/* code for local thermal discomfort  ---- equations are in SI units */

// -------------------------- radiant temperature asymmetry -------------------------------------------------------

// var rad_DT_warmC , rad_DT_coolC , rad_DT_warmW , rad_DT_coolW  are inputed by the user.
function asymRisk(rad_DT_warmC, rad_DT_coolC, rad_DT_warmW, rad_DT_coolW) {
  var warmC_PPD = 100 / (1 + Math.exp(2.84 - 0.174 * rad_DT_warmC)) - 5.5;
  var coolC_PPD = 100 / (1 + Math.exp(9.93 - 0.5 * rad_DT_coolC));
  var warmW_PPD = 100 / (1 + Math.exp(3.72 - 0.052 * rad_DT_warmW)) - 3.5;
  var coolW_PPD = 100 / (1 + Math.exp(6.61 - 0.345 * rad_DT_coolW));

  if (warmW_PPD < 0) warmW_PPD = 0;

  var max_PPD = Math.max(warmC_PPD, coolC_PPD, warmW_PPD, coolW_PPD);

  return [
    max_PPD >= 10,
    max_PPD >= 5,
    [warmC_PPD, coolC_PPD, warmW_PPD, coolW_PPD],
  ];
}

// -------------------------- vertical air temperature difference -------------------------------------------------

// var T_head and T_ankle must be defined by the user
function verticalRisk(T_head, T_ankle) {
  var Vertical_DT = T_head - T_ankle;
  var Vertical_PPD = 100 / (1 + Math.exp(5.76 - 0.856 * Vertical_DT));

  return [
    Vertical_DT >= 8 || Vertical_PPD >= 10,
    Vertical_DT >= 8 || Vertical_PPD >= 5,
    Vertical_DT >= 8 || Vertical_PPD >= 3,
    Vertical_PPD,
  ];
}

//-------------------------- Floor surface temperature -------------------------------------------------

//var T_floor must be defined by the user
function floorRisk(T_floor) {
  var floor_PPD =
    100 -
    94 * Math.exp(-1.387 + 0.118 * T_floor - 0.0025 * Math.pow(T_floor, 2));

  return [floor_PPD >= 15, floor_PPD >= 10, floor_PPD];
}

// -------------------------------- Draft ----------------------------------------------------------------------

function draftRisk(local_ta, local_vel) {
  if (local_vel < 0.05) {
    local_vel = 0.05;
  }

  var Tu = 40; // local turbulence intensity (40% if unknown)
  var DR =
    (34 - local_ta) *
    Math.pow(local_vel - 0.05, 0.62) *
    (0.37 * local_vel * Tu + 3.14);

  if (DR > 100) {
    DR = 100;
  }

  return [DR >= 30, DR >= 20, DR >= 10, DR];
}

//------------------------------- For the dialog --------------------------------------
// NOTE: "true" means that there is local discomfort, so the space does NOT comply.

function updateLocalDisc() {
  var dlocal = {};
  var msg;
  dlocal.rad_DT_warmC = $("#rad_DT_warmC").val();
  dlocal.rad_DT_coolC = $("#rad_DT_coolC").val();
  dlocal.rad_DT_warmW = $("#rad_DT_warmW").val();
  dlocal.rad_DT_coolW = $("#rad_DT_coolW").val();
  dlocal.T_head = $("#T_head").val();
  dlocal.T_ankle = $("#T_ankle").val();
  dlocal.T_floor = $("#T_floor").val();
  dlocal.T_op = $("#T_op").val();
  dlocal.local_vel = $("#local_vel").val();

  if (!isCelsius) {
    dlocal.rad_DT_warmC = (dlocal.rad_DT_warmC * 5) / 9;
    dlocal.rad_DT_coolC = (dlocal.rad_DT_coolC * 5) / 9;
    dlocal.rad_DT_warmW = (dlocal.rad_DT_warmW * 5) / 9;
    dlocal.rad_DT_coolW = (dlocal.rad_DT_coolW * 5) / 9;
    dlocal.T_head = util.FtoC(dlocal.T_head);
    dlocal.T_ankle = util.FtoC(dlocal.T_ankle);
    dlocal.T_floor = util.FtoC(dlocal.T_floor);
    dlocal.T_op = util.FtoC(dlocal.T_op);
    dlocal.local_vel /= 196.9;
  }

  var asym_res = asymRisk(
    dlocal.rad_DT_warmC,
    dlocal.rad_DT_coolC,
    dlocal.rad_DT_warmW,
    dlocal.rad_DT_coolW
  );
  var vert_res = verticalRisk(dlocal.T_head, dlocal.T_ankle);
  var floor_res = floorRisk(dlocal.T_floor);
  var draft_res = draftRisk(dlocal.T_op, dlocal.local_vel);

  if (asym_res[2][0] >= 10) {
    msg = "&#10008; &nbsp; &nbsp; " + asym_res[2][0].toFixed(0) + "%";
    $("#rad-warmC-res").css("color", "red");
  } else if (asym_res[2][0] >= 5) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][0].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#rad-warmC-res").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][0].toFixed(0) +
      "%" +
      "&nbsp; (I or II)";
    $("#rad-warmC-res").css("color", "green");
  }
  $("#rad-warmC-res").html(msg);

  if (asym_res[2][1] >= 10) {
    msg = "&#10008; &nbsp; &nbsp; " + asym_res[2][1].toFixed(0) + "%";
    $("#rad-coolC-res").css("color", "red");
  } else if (asym_res[2][1] >= 5) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][1].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#rad-coolC-res").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][1].toFixed(0) +
      "%" +
      "&nbsp; (I or II)";
    $("#rad-coolC-res").css("color", "green");
  }
  $("#rad-coolC-res").html(msg);

  if (asym_res[2][2] >= 10) {
    msg = "&#10008; &nbsp; &nbsp; " + asym_res[2][2].toFixed(0) + "%";
    $("#rad-warmW-res").css("color", "red");
  } else if (asym_res[2][2] >= 5) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][2].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#rad-warmW-res").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][2].toFixed(0) +
      "%" +
      "&nbsp; (I or II)";
    $("#rad-warmW-res").css("color", "green");
  }
  $("#rad-warmW-res").html(msg);

  if (asym_res[2][3] >= 10) {
    msg = "&#10008; &nbsp; &nbsp; " + asym_res[2][3].toFixed(0) + "%";
    $("#rad-coolW-res").css("color", "red");
  } else if (asym_res[2][3] >= 5) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][3].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#rad-coolW-res").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      asym_res[2][3].toFixed(0) +
      "%" +
      "&nbsp; (I or II)";
    $("#rad-coolW-res").css("color", "green");
  }
  $("#rad-coolW-res").html(msg);

  if (vert_res[0]) {
    msg = "&#10008; &nbsp; &nbsp; " + vert_res[3].toFixed(0) + "%";
    $("#vert-disc").css("color", "red");
  } else if (vert_res[1]) {
    msg =
      "&#10004; &nbsp; &nbsp; " + vert_res[3].toFixed(0) + "%" + "&nbsp; (III)";
    $("#vert-disc").css("color", "green");
  } else if (vert_res[2]) {
    msg =
      "&#10004; &nbsp; &nbsp; " + vert_res[3].toFixed(0) + "%" + "&nbsp; (II)";
    $("#vert-disc").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " + vert_res[3].toFixed(0) + "%" + "&nbsp; (I)";
    $("#vert-disc").css("color", "green");
  }
  $("#vert-disc").html(msg);

  if (floor_res[0]) {
    msg = "&#10008; &nbsp; &nbsp; " + floor_res[2].toFixed(0) + "%";
    $("#floor-disc").css("color", "red");
  } else if (floor_res[1]) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      floor_res[2].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#floor-disc").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      floor_res[2].toFixed(0) +
      "%" +
      "&nbsp; (I or II)";
    $("#floor-disc").css("color", "green");
  }
  $("#floor-disc").html(msg);

  if (draft_res[0]) {
    msg = "&#10008; &nbsp; &nbsp; ";
    $("#draft-disc").css("color", "red");
  } else if (draft_res[1]) {
    msg =
      "&#10004; &nbsp; &nbsp; " +
      draft_res[3].toFixed(0) +
      "%" +
      "&nbsp; (III)";
    $("#draft-disc").css("color", "green");
  } else if (draft_res[2]) {
    msg =
      "&#10004; &nbsp; &nbsp; " + draft_res[3].toFixed(0) + "%" + "&nbsp; (II)";
    $("#draft-disc").css("color", "green");
  } else {
    msg =
      "&#10004; &nbsp; &nbsp; " + draft_res[3].toFixed(0) + "%" + "&nbsp; (I)";
    $("#draft-disc").css("color", "green");
  }
  $("#draft-disc").html(msg);

  if (asym_res[0] || vert_res[0] || floor_res[0] || draft_res[0]) {
    msg = "&#10008; &nbsp; Does not comply with ISO-7730";
    $("#all-disc").css("color", "red");
  } else {
    msg = "&#10004; &nbsp; Complies with ISO-7730";
    $("#all-disc").css("color", "green");
  }
  $("#all-disc").html(msg);
}
