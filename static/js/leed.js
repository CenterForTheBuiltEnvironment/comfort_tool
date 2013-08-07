//goog.require('psy')
var LEED = {}

function setDataSeason(space, ctype, season) {
    if (!LEED[space]) LEED[space] = {
        "clo": {
            "spring": "",
            "summer": "",
            "fall": "",
            "winter": ""
        },
        "met": {
            "spring": "",
            "summer": "",
            "fall": "",
            "winter": ""
        },
        "top": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "rh": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "vel": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "pmv": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "ppd": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "comply": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "psychart": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "temphumchart": {
            "heating": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            },
            "cooling": {
                "spring": "",
                "summer": "",
                "fall": "",
                "winter": ""
            }
        },
        "adaptchart": {
            "spring": "",
            "summer": "",
            "fall": "",
            "winter": ""
        }
    }

    var t_op = (d.ta + d.tr) / 2;

    if (model == "pmvElevatedAirspeed") {
        LEED[space].clo[season] = d.clo;
        LEED[space].met[season] = d.met;
        LEED[space].top[ctype][season] = !isCelsius ? util.CtoF(t_op).toFixed(1) : t_op.toFixed(1);
        LEED[space].vel[ctype][season] = !isCelsius ? (d.vel * 196.9).toFixed(1) : d.vel.toFixed(1);
        LEED[space].rh[ctype][season] = d.rh.toFixed(1);
        LEED[space].pmv[ctype][season] = $("#pmv-res").html();
        LEED[space].ppd[ctype][season] = $("#ppd-res").html();
        LEED[space].comply[ctype][season] = comply ? "Yes" : "No";
        LEED[space].psychart[ctype][season] = document.getElementById('chart-div').innerHTML;
        LEED[space].temphumchart[ctype][season] = document.getElementById('temphumchart-div').innerHTML;
    } else {
        LEED[space]["adaptchart"][season] = document.getElementById('chart-div-adaptive').innerHTML;
    }
}

function writeRowClo(spacetype, windowref) {

    var space = LEED[spacetype];
    var newcell = "</td><td class='value-cell'>"

    var table = windowref.document.getElementById('clo-table');
    var newRow = windowref.document.createElement('tr');
    newRow.innerHTML = "<td class='value-cell'>" + spacetype + newcell 
      + space.clo.spring + newcell + space.clo.summer + newcell 
      + space.clo.fall + newcell + space.clo.winter + newcell 
      + space.met.spring + newcell + space.met.summer + newcell 
      + space.met.fall + newcell + space.met.winter + "</td>";

    table.appendChild(newRow)
}

function writeRowAmb(spacetype, hc, windowref) {

    var space = LEED[spacetype];
    var newcell = "</td><td class='value-cell'>"

    var table = windowref.document.getElementById(hc + "-table");
    var newRow = windowref.document.createElement('tr');
    newRow.innerHTML = "<td class='value-cell'>" + spacetype + newcell 
      + space.top[hc].spring + newcell + space.top[hc].summer + newcell 
      + space.top[hc].fall + newcell + space.top[hc].winter + newcell 
      + space.rh[hc].spring + newcell + space.rh[hc].summer + newcell 
      + space.rh[hc].fall + newcell + space.rh[hc].winter + newcell 
      + space.vel[hc].spring + newcell + space.vel[hc].summer + newcell 
      + space.vel[hc].fall + newcell + space.vel[hc].winter + "</td>";

    table.appendChild(newRow)
}

function writeRowPmv(spacetype, hc, windowref) {
    var space = LEED[spacetype]
    var newcell = "</td><td class='value-cell'>"

    var table = windowref.document.getElementById(hc + "-pmv-table")
    var newRow = windowref.document.createElement('tr')
    newRow.innerHTML = "<td class='value-cell'>" + spacetype + newcell 
      + space.pmv[hc].spring + newcell + space.pmv[hc].summer + newcell 
      + space.pmv[hc].fall + newcell + space.pmv[hc].winter + newcell 
      + space.ppd[hc].spring + newcell + space.ppd[hc].summer + newcell 
      + space.ppd[hc].fall + newcell + space.ppd[hc].winter + newcell 
      + space.comply[hc].spring + newcell + space.comply[hc].summer + newcell 
      + space.comply[hc].fall + newcell + space.comply[hc].winter + "</td>";

    table.appendChild(newRow)
}

function insertCharts(spacetype, hc, windowref) {
    var space = LEED[spacetype]
    var table = windowref.document.getElementById(hc + "-charts-table")
    var seasons = ["spring", "summer", "fall", "winter"]

    if ($('#chart-div').is(':visible')) {
        seasons.forEach(function(key) {
            var newDiv = windowref.document.createElement("div")
            var div_id = (spacetype + "-" + hc + "-" + key + "-chart").toString()
            newDiv.id = div_id

            var chart = space.psychart[hc][key]

            if (chart != "") {
                newDiv.innerHTML = "<div align='center' style='font-size:10'>" + spacetype + ", " + key + "</div>" + chart
                newDiv.children[1].setAttribute("viewBox", "0 0 640 552")
                newDiv.children[1].setAttribute("width", "320")
                newDiv.children[1].setAttribute("height", "276")
                newDiv.style.cssFloat = "left"
                newDiv.style.border = "thin dotted grey"
                newDiv.style.marginRight = "15"
                newDiv.style.marginBottom = "15"
                newDiv.setAttribute("align", "left")
                table.appendChild(newDiv)
            }
        })
    } else if ($('#temphumchart-div').is(':visible')) {
        seasons.forEach(function(key) {
            var newDiv = windowref.document.createElement("div")
            var div_id = (spacetype + "-" + hc + "-" + key + "-chart").toString()
            newDiv.id = div_id

            var chart = space.temphumchart[hc][key]

            if (chart != "") {
                newDiv.innerHTML = "<div align='center' style='font-size:10'>" + spacetype + ", " + key + "</div>" + chart
                newDiv.children[1].setAttribute("viewBox", "0 0 580 500")
                newDiv.children[1].setAttribute("width", "290")
                newDiv.children[1].setAttribute("height", "250")
                newDiv.style.cssFloat = "left"
                newDiv.style.border = "thin dotted grey"
                newDiv.setAttribute("align", "left")
                table.appendChild(newDiv)
            }
        })
    }
}

function insertAdaptCharts(spacetype, windowref) {
    var space = LEED[spacetype]
    var table = windowref.document.getElementById("LEED-adapt-charts")
    var seasons = ["spring", "summer", "fall", "winter"]

    seasons.forEach(function(key) {
        var newDiv = windowref.document.createElement("div")
        var div_id = (spacetype + "-" + key + "-adaptchart").toString()
        newDiv.id = div_id

        var chart = space.adaptchart[key]

        if (chart != "") {
            newDiv.innerHTML = "<div align='center' style='font-size:10'>" + spacetype + ", " + key + "</div>" + chart
            newDiv.children[1].setAttribute("viewBox", "0 0 580 500")
            newDiv.children[1].setAttribute("width", "290")
            newDiv.children[1].setAttribute("height", "250")
            newDiv.style.cssFloat = "left"
            newDiv.style.border = "thin dotted grey"
            newDiv.setAttribute("align", "left")
            table.appendChild(newDiv)
        }
    })
}

function generateTables(windowref) {
    for (var key in LEED) {
        var chart = LEED[key].psychart
        var temphumchart = LEED[key].temphumchart
        var adaptchart = LEED[key].adaptchart

            function psyTest(hc) {
                for (var x in chart[hc]) {
                    return (x != "")
                }
            }

            function temphumTest(hc) {
                for (var x in temphumchart[hc]) {
                    return (x != "")
                }
            }

            function adaptTest() {
                for (var x in adaptchart) {
                    return (x != "")
                }
            }

        var cool_test = psyTest("cooling")
        var heat_test = psyTest("heating")
        var temphum_cool_test = psyTest("cooling")
        var temphum_heat_test = psyTest("heating")
        var adapt_test = adaptTest()

        if (cool_test || heat_test || temphum_cool_test || temphum_heat_test) {
            writeRowClo(key, windowref);
        }

        if (cool_test || temphum_cool_test) {
            writeRowAmb(key, "cooling", windowref);
            writeRowPmv(key, "cooling", windowref);
            insertCharts(key, "cooling", windowref);
        }
        if (heat_test || temphum_heat_test) {
            writeRowAmb(key, "heating", windowref);
            writeRowPmv(key, "heating", windowref);
            insertCharts(key, "heating", windowref);
        }
        if (adapt_test) {
            insertAdaptCharts(key, windowref);
        }
    }
}

function createDocument(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = html;
    return doc
}

function openDocument(doc) {
    var openwindow = window.open()
    openwindow.document.write(doc.documentElement.innerHTML);
    return openwindow
}
