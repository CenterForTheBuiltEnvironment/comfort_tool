let set_output_chart = new (function () {
  // generate range of integers
  this.range = function (start, end) {
    let ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  };

  let ctx;
  let chartInstance;

  let ta,
    i,
    results,
    t_set,
    t_mean_body,
    t_skin,
    t_core,
    t_clo,
    q_tot_evap,
    q_sweat_evap,
    q_vap_diff,
    q_tot_sensible,
    q_tot_skin,
    q_resp,
    skin_wet,
    xLabelF;

  ta = this.range(10, 40);

  // function that calculate the heat losses
  this.getData = function () {
    t_set = [];
    t_skin = [];
    t_core = [];
    t_clo = [];
    t_mean_body = [];
    q_tot_evap = [];
    q_sweat_evap = [];
    q_vap_diff = [];
    q_tot_sensible = [];
    q_tot_skin = [];
    q_resp = [];
    skin_wet = [];

    for (i = 0; i < ta.length; i++) {
      results = comf.pierceSET(ta[i], d.tr, d.vel, d.rh, d.met, d.clo, d.wme);
      t_set.push(results.set.toFixed(1));
      t_skin.push(results.t_skin.toFixed(1));
      t_core.push(results.t_core.toFixed(1));
      t_clo.push(results.t_clo.toFixed(1));
      t_mean_body.push(results.t_mean_body.toFixed(1));
      q_tot_evap.push(results.q_tot_evap.toFixed(1));
      q_sweat_evap.push(results.q_sweat_evap.toFixed(1));
      q_vap_diff.push(results.q_vap_diff.toFixed(1));
      q_tot_sensible.push(results.q_tot_sensible.toFixed(1));
      q_tot_skin.push(results.q_tot_skin.toFixed(1));
      q_resp.push(results.q_resp.toFixed(1));
      skin_wet.push(results.skin_wet.toFixed(1));
    }
  };

  // function that updates the chart whenever user selects a different input
  this.update = function () {
    this.getData();

    chartInstance.data.datasets[0].data = t_set;
    chartInstance.data.datasets[1].data = t_skin;
    chartInstance.data.datasets[2].data = t_core;
    chartInstance.data.datasets[3].data = t_clo;
    chartInstance.data.datasets[4].data = t_mean_body;
    chartInstance.data.datasets[5].data = q_tot_evap;
    chartInstance.data.datasets[6].data = q_sweat_evap;
    chartInstance.data.datasets[7].data = q_vap_diff;
    chartInstance.data.datasets[8].data = q_tot_sensible;
    chartInstance.data.datasets[9].data = q_tot_skin;
    chartInstance.data.datasets[10].data = q_resp;
    chartInstance.data.datasets[11].data = skin_wet;

    if (isCelsius) {
      chartInstance.data.labels = ta;
      chartInstance.options.scales.xAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°C]";
      chartInstance.options.scales.yAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°C]";

      // leftYMax = 40;
      // leftYMin = 0;
    } else {
      xLabelF = [];
      let t_set_F = [];
      let t_skin_F = [];
      let t_core_F = [];
      let t_clo_F = [];
      let t_mean_body_F = [];
      for (i = 0; i < ta.length; i++) {
        xLabelF.push(util.CtoF(ta[i]));
        t_set_F.push(util.CtoF(chartInstance.data.datasets[0].data[i]));
        t_skin_F.push(util.CtoF(chartInstance.data.datasets[1].data[i]));
        t_core_F.push(util.CtoF(chartInstance.data.datasets[2].data[i]));
        t_clo_F.push(util.CtoF(chartInstance.data.datasets[3].data[i]));
        t_mean_body_F.push(util.CtoF(chartInstance.data.datasets[4].data[i]));
      }
      chartInstance.data.labels = xLabelF;
      chartInstance.data.datasets[0].data = t_set_F;
      chartInstance.data.datasets[1].data = t_skin_F;
      chartInstance.data.datasets[2].data = t_core_F;
      chartInstance.data.datasets[3].data = t_clo_F;
      chartInstance.data.datasets[4].data = t_mean_body_F;
      chartInstance.options.scales.xAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°F]";
      chartInstance.options.scales.yAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°F]";

      // leftYMax = 100;
      // leftYMin = 50;
    }

    // newLeftYMax = calculateMax(amountOfLabels, leftYMax);
    // leftYStep = newLeftYMax / amountOfLabels;
    // chartInstance.options.scales.yAxes[0].ticks.max = newLeftYMax;
    // chartInstance.options.scales.yAxes[0].ticks.min = leftYMin;
    // chartInstance.options.scales.yAxes[0].ticks.stepSize = leftYStep;

    chartInstance.update();
  };

  // function that draws the chart
  this.draw = function () {
    Chart.defaults.global.defaultFontFamily = "sans-serif";

    this.getData();

    ctx = document.getElementById("set_chart_div").getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: ta,
        datasets: [
          {
            label: "SET temperature",
            data: t_set,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#0D6EFC",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Skin temperature",
            data: t_skin,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#0BBAD9",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Core temperature",
            data: t_core,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#00F0A4",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Clothing temperature",
            data: t_clo,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#0BD935",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Mean body temperature",
            data: t_mean_body,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#55FA01",
            hidden: true,
            yAxisID: "y",
          },
          {
            label: "Total skin evaporative heat loss",
            data: q_tot_evap,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#999999",
            hidden: true,
            yAxisID: "y2",
          },
          {
            label: "Sweat evaporation skin heat loss",
            data: q_sweat_evap,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#FF9905",
            hidden: true,
            yAxisID: "y2",
          },
          {
            label: "Vapour diffusion skin heat loss",
            data: q_vap_diff,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#DB5200",
            hidden: true,
            yAxisID: "y2",
          },
          {
            label: "Total skin sensible heat loss",
            data: q_tot_sensible,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#505050",
            hidden: true,
            yAxisID: "y2",
          },
          {
            label: "Total skin heat loss",
            data: q_tot_skin,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#000000",
            hidden: false,
            yAxisID: "y2",
          },
          {
            label: "Heat loss respiration",
            data: q_resp,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#000000",
            hidden: false,
            yAxisID: "y2",
            borderDash: [10, 5],
          },
          {
            label: "Skin wettedness",
            data: skin_wet,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#ffcc00",
            hidden: true,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "",
        },
        legend: {
          position: "bottom",
        },
        scales: {
          yAxes: [
            {
              id: "y",
              position: "left",
              scaleLabel: {
                display: true,
                labelString: "Temperature [°C]",
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              },
              ticks: {
                beginAtZero: false,
                // max: newLeftYMax,
                // stepSize: leftYStep,
              },
            },
            {
              id: "y2",
              position: "right",
              scaleLabel: {
                display: true,
                labelString: "Heat Loss [W], Skin wettedness [%]",
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              },
              ticks: {
                beginAtZero: false,
                // max: newRightYMax,
                // stepSize: rightYStep,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Dry-bulb air temperature [°C]",
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: 20,
              },
            },
          ],
        },
        layout: {
          padding: 5,
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0, // disables bezier curves
          },
          point: { radius: 0 },
        },
      },
    });
  };
})();
