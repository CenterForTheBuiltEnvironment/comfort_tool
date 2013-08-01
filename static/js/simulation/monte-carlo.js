var mc = mc || {}

mc.pmvMonteCarlo = function(ta, tr, vel, rh, met, clo, wme, numSims, bins) {
    // returns [pmv, ppd]
    // ta, air temperature (�C)
    // tr, mean radiant temperature (�C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)
    // numSims: number of times we run the simulation
    // bins: number of bins to divide the pmv range into
    // Each input will either be 'number' or 'jStat' object
    //
    // IMPORTANT:
    // a jStat object input will only work when the distribution
    // is already defined. For example, passing just 'jStat.normal'
    // as an argument will not work; it must be in the format
    // 'jStat.normal(mean, std)'.
    // comf.pmvMonteCarlo(25, 25, 0.1, 50, 1.2, 0.5, 0, 100, 8)

    // Initialize the bins
    var result = {};
    var pmvTotal = 0;
    var ppdTotal = 0;
    result.pmvCounts = [];
    result.pmvValues = [];
    for (var i = 0; i < bins; i++) {
        result.pmvCounts[i] = 0;
    }
    var distArgs = new Object();
    taIsDist = mc.isDist(ta);
    trIsDist = mc.isDist(tr);
    velIsDist = mc.isDist(vel);
    rhIsDist = mc.isDist(rh);
    metIsDist = mc.isDist(met);
    cloIsDist = mc.isDist(clo);
    wmeIsDist = mc.isDist(wme);
    // Start the simulation: repeat numSims times
    for (var n = 0; n < numSims; n++) {
        // Calculate the pmv using either the supplied arguments or sampled values
        var pmvOutput = comf.pmvElevatedAirspeed(
                mc.sampleOrPass(ta, taIsDist),
                mc.sampleOrPass(tr, trIsDist),
                mc.sampleOrPass(vel, velIsDist),
                mc.sampleOrPass(rh, rhIsDist),
                mc.sampleOrPass(met, metIsDist),
                mc.sampleOrPass(clo, cloIsDist),
                mc.sampleOrPass(wme, wmeIsDist));
        if (isNaN(pmvOutput.pmv)) {
            console.log("comf.pmvElevatedAirspeed returned NaN values");
            console.log(pmvOutput);
        } else if (pmvOutput.pmv < -4) {
            console.log("comf.pmvElevatedAirSpeed returned pmv < -4");
        } else if (pmvOutput.pmv > 4) {
            console.log("comf.pmvElevatedAirspeed returned pmv > 4");
        } else {
            result.pmvCounts[mc.pmvBinIndex(pmvOutput.pmv, bins)] += 1;
            result.pmvValues.push(pmvOutput.pmv);
            pmvTotal += pmvOutput.pmv;
            ppdTotal += pmvOutput.ppd;
        }
    }
    result.pmvAvg = pmvTotal / numSims;
    result.ppdAvg = ppdTotal / numSims;
    return result
}

mc.isDist = function(dist) {
    //TODO: A better way to check type?
    if (typeof dist === 'object') {
        return true;
    } else {
        if (typeof dist !== 'number') {
            console.log("Input 'dist' is of type: " + typeof dist);
            console.log("Input 'dist' in mc.isDist is not a jStat object or number");
        }
        return false;
    }
}

mc.pmvBinIndex = function(pmv, bins) {
    // Given the pmv range [-4, 4] divided into 'bins' number of bins in an array, find
    // the index in the array that 'pmv' belongs to
    // TODO: binary search??
    var pmvRange = 8;
    var pmvMin = -4;
    var binSize = pmvRange / bins;
    // binBound is the right bound
    var binBound = pmvMin + binSize;
    var index;
    for (index = 0; index < bins; index++) {
        if (pmv <= binBound) {
            return index;
        }
        binBound += binSize;
    }
    // It should never return from here
    return index
}

mc.sampleOrPass = function(val, sample) {
    if (sample) {
        //TODO: Add function to sample correctly based on type of distribution
        //For now, everything is assumed to be jStat.normal
        return val.sample();
    } else {
        return val;
    }
}
