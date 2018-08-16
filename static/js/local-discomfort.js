/* code for local thermal discomfort part  ---- equations are in SI units */

// NOTE: equations from the Standard ISO-7730-2005 are commented, in case of further use.
//       The current version of this assesment uses the temperature limits given by the ASHRAE-55 standard.

// -------------------------- radiant temperature asymmetry -------------------------------------------------------

// var rad_DT_warmC , rad_DT_coolC , rad_DT_warmW , rad_DT_coolW  are inputed by the user.

function asymRisk(rad_DT_warmC, rad_DT_coolC, rad_DT_warmW, rad_DT_coolW) {
    // var warmC_PPD = 100 / (1 + Math.exp(2.84 - 0.174 * rad_DT_warmC)) - 5.5;
    //     var coolC_PPD = 100 / (1 + Math.exp(9.93 - 0.50 * rad_DT_coolC));
    //     var warmW_PPD = 100 / (1 + Math.exp(3.72 - 0.052 * rad_DT_warmW)) - 3.5;
    //     var coolW_PPD = 100 / (1 + Math.exp(6.61 - 0.345 * rad_DT_coolW));
    //
    //     if (warmW_PPD < 0) warmW_PPD = 0
    //
    //     return [(warmC_PPD >= 5 ||
    // 	     coolW_PPD >= 5 ||
    // 	     coolC_PPD >= 5 ||
    // 	     warmW_PPD >= 5),
    //          warmC_PPD, coolC_PPD, warmW_PPD, coolW_PPD]

    return [rad_DT_warmC >= 5 || rad_DT_coolC >= 14 ||  rad_DT_warmW >= 23 || rad_DT_coolW >= 10
             ,(rad_DT_warmC >= 5), (rad_DT_coolC >= 14), (rad_DT_warmW >= 23), (rad_DT_coolW >= 10)]
};


// -------------------------- vertical air temperature difference -------------------------------------------------

// var T_head and T_ankle must be defined by the user

function verticalRisk(T_head, T_ankle) {

    var Vertical_DT = T_head - T_ankle;

    // var Vertical_PPD = 100 / (1 + Math.exp(5.76 - 0.856 * Vertical_DT))
    //
    // 	return [(Vertical_DT >= 8 || Vertical_PPD >= 5), Vertical_PPD]

    return [(Vertical_DT >= 3)]
}


//-------------------------- Floor surface temperature -------------------------------------------------

//var T_floor must be defined by the user

function floorRisk(T_floor) {
    // var floor_PPD = 100 - 94 * Math.exp(-1.387 + 0.118 * T_floor - 0.0025 * Math.pow(T_floor,2));
    //
    // 	return [(floor_PPD >= 10), floor_PPD]

    return [(T_floor < 19 || T_floor > 29)]
};


// -------------------------------- Draft ----------------------------------------------------------------------

function draftRisk(T_op, local_vel) {
//    return (T_op < 23.0 || local_vel > 0.2)
       return (T_op < 23.0 & local_vel > 0.2)

};

// -------------------------------- Ankle Draft ----------------------------------------------------------------------

function ankledraft(ankle_vel, overall_pmv) {
    return (exp(-2.58 + 3.05*ankle_vel - 1.06*overall_pmv)/(1+ exp(-2.58 + 3.05*ankle_vel - 1.06*overall_pmv )));
};

//------------------------------- For the dialog --------------------------------------
// NOTE: due to how the code is structured, "true" means that there is local discomfort, so the space does NOT comply.



function updateLocalDisc() {
    var dlocal = {}
    var msg;
    dlocal.rad_DT_warmC = parseFloat($('#rad_DT_warmC').val());
    dlocal.rad_DT_coolC = parseFloat($('#rad_DT_coolC').val());
    dlocal.rad_DT_warmW = parseFloat($('#rad_DT_warmW').val());
    dlocal.rad_DT_coolW = parseFloat($('#rad_DT_coolW').val());
    dlocal.T_head = parseFloat($('#T_head').val());
    dlocal.T_ankle = parseFloat($('#T_ankle').val());
    dlocal.T_floor = parseFloat($('#T_floor').val());
    dlocal.T_op = parseFloat($('#T_op').val());
    dlocal.local_Ta = parseFloat($('#local_Ta').val());
    dlocal.local_Tr = parseFloat($('#local_Tr').val());
    dlocal.local_rh = parseFloat($('#local_rh').val());
    dlocal.local_met = parseFloat($('#local_met').val());
    dlocal.local_clo = parseFloat($('#local_clo').val());
    dlocal.local_vel = parseFloat($('#local_vel').val());
    dlocal.local_ank_vel = parseFloat($('#local_ank_vel').val());

 $(function () {
    var limitInput = function () {
        var value = parseFloat(this.value, 10);
        var min = parseFloat(0.06);
        if (value < min) {
            this.value = min;
        }
    };
    $("#local_ank_vel").change(limitInput);
});

    if (!isCelsius) {
        dlocal.rad_DT_warmC = dlocal.rad_DT_warmC * 5 / 9;
        dlocal.rad_DT_coolC = dlocal.rad_DT_coolC * 5 / 9;
        dlocal.rad_DT_warmW = dlocal.rad_DT_warmW * 5 / 9;
        dlocal.rad_DT_coolW = dlocal.rad_DT_coolW * 5 / 9;
        dlocal.T_head = util.FtoC(dlocal.T_head);
        dlocal.T_ankle = util.FtoC(dlocal.T_ankle);
        dlocal.T_floor = util.FtoC(dlocal.T_floor);
        dlocal.T_op = util.FtoC(dlocal.T_op);
        dlocal.local_Ta = util.FtoC(dlocal.local_Ta);
        dlocal.local_Tr = util.FtoC(dlocal.local_Tr);
        dlocal.local_rh = parseFloat($('#local_rh').val());
        dlocal.local_met = parseFloat($('#local_met').val());
        dlocal.local_clo = parseFloat($('#local_clo').val());
        dlocal.local_vel /= 196.9;
        dlocal.local_ank_vel /= 196.9;

         $(function () {
            var limitInput = function () {
                 var value = parseFloat(this.value, 10);
                 var min = parseFloat(20);
            if (value < min) {
                 this.value = min;
            }
            };
        $("#local_ank_vel").change(limitInput);
        });
    }

    var asym_res = asymRisk(dlocal.rad_DT_warmC, dlocal.rad_DT_coolC, dlocal.rad_DT_warmW, dlocal.rad_DT_coolW);
    var vert_res = verticalRisk(dlocal.T_head, dlocal.T_ankle);
    var floor_res = floorRisk(dlocal.T_floor);
    var draft_res = draftRisk(dlocal.T_op, dlocal.local_vel);
    var draft_pmv_res = comf.pmv(dlocal.local_Ta, dlocal.local_Tr, 0.2, dlocal.local_rh, dlocal.local_met, dlocal.local_clo, 0)
    var ank_draft_res= ankledraft(dlocal.local_ank_vel, draft_pmv_res.pmv)*100
    var clo_check = dlocal.local_clo
    var met_check = dlocal.local_met

    //if (asym_res[1] > 5){
    if (asym_res[1]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + asym_res[1].toFixed(0) + "%" */
        $("#rad-warmC-res").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + asym_res[1].toFixed(0) + "%" */
        $("#rad-warmC-res").css('color', 'green')
    }
    $("#rad-warmC-res").html(msg)

    // if (asym_res[2] > 5){
    if (asym_res[2]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + asym_res[2].toFixed(0) + "%" */
        $("#rad-coolC-res").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + asym_res[2].toFixed(0) + "%" */
        $("#rad-coolC-res").css('color', 'green')
    }
    $("#rad-coolC-res").html(msg)

    // if (asym_res[3] > 5){
    if (asym_res[3]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + asym_res[3].toFixed(0) + "%" */
        $("#rad-warmW-res").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + asym_res[3].toFixed(0) + "%" */
        $("#rad-warmW-res").css('color', 'green')
    }
    $("#rad-warmW-res").html(msg)

    // if (asym_res[4] > 5){
    if (asym_res[4]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + asym_res[4].toFixed(0) + "%" */
        $("#rad-coolW-res").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + asym_res[4].toFixed(0) + "%" */
        $("#rad-coolW-res").css('color', 'green')
    }
    $("#rad-coolW-res").html(msg)

    if (vert_res[0]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + vert_res[1].toFixed(0) + "%" */
        $("#vert-disc").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + vert_res[1].toFixed(0) + "%" */
        $("#vert-disc").css('color', 'green')
    }
    $("#vert-disc").html(msg)

    if (floor_res[0]) {
        msg = "&#10008; &nbsp; &nbsp; " /* + floor_res[1].toFixed(0) + "%" */
        $("#floor-disc").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; " /* + floor_res[1].toFixed(0) + "%" */
        $("#floor-disc").css('color', 'green')
    }
    $("#floor-disc").html(msg)

    if (draft_res) {
        msg = "&#10008; &nbsp; &nbsp; "
        $("#draft-disc").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; &nbsp; "
        $("#draft-disc").css('color', 'green')
    }
    $("#draft-disc").html(msg)

    if (asym_res[0] || vert_res[0] || floor_res[0] || draft_res || ank_draft_res > 20) {
        msg = "&#10008; &nbsp; Does not comply with ASHRAE Standard 55-2017"
        $("#all-disc").css('color', 'red')
    } else {
        msg = "&#10004; &nbsp; Complies with ASHRAE Standard 55-2017"
        $("#all-disc").css('color', 'green')
    }
    $("#all-disc").html(msg)

    $('#draft_pmv_res').attr('value', draft_pmv_res.pmv.toFixed(2));
    $('#ankle-draft-disc').attr('value', ank_draft_res.toFixed(0));

    if (ank_draft_res > 20) {
        msg = "&#10008; &nbsp; &nbsp; "
        $("#ank-draft-sign").css('color', 'red')
    }   else{
        msg = "&#10004; &nbsp; &nbsp; "
        $("#ank-draft-sign").css('color', 'green')
    }
        $("#ank-draft-sign").html(msg)

    if (clo_check > 0.7) {
        msg = "&#10008; clo > 0.7"
        $("#col-sign").css('color', 'red')
    }   else {
        msg = "trivial"
        $("#col-sign").css('color', 'white')
    }
        $("#col-sign").html(msg)

     if (met_check > 1.3) {
        msg = "&#10008; met > 1.3"
        $("#met-sign").css('color', 'red')
    }   else {
        msg = "trivial"
        $("#met-sign").css('color', 'white')
    }
        $("#met-sign").html(msg)
}
