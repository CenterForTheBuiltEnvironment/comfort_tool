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
    t_skin,
    t_core,
    t_clo,
    q_lat_skin,
    q_tot_skin,
    q_resp,
    skin_wet,
    xLabelF;

  ta = this.range(10, 40);

  // function that calculate the heat losses
  this.getData = function () {
    t_skin = [];
    t_core = [];
    t_clo = [];
    q_lat_skin = [];
    q_tot_skin = [];
    q_resp = [];
    skin_wet = [];

    for (i = 0; i < ta.length; i++) {
      results = comf.pierceSET(ta[i], d.tr, d.vel, d.rh, d.met, d.clo, d.wme);
      t_skin.push(results.t_skin.toFixed(1));
      t_core.push(results.t_core.toFixed(1));
      t_clo.push(results.t_clo.toFixed(1));
      q_lat_skin.push(results.q_lat_skin.toFixed(1));
      q_tot_skin.push(results.q_tot_skin.toFixed(1));
      q_resp.push(results.q_resp.toFixed(1));
      skin_wet.push(results.skin_wet.toFixed(1));
    }
  };

  // function that updates the chart whenever user selects a different input
  this.update = function () {
    this.getData();

    chartInstance.data.datasets[0].data = t_skin;
    chartInstance.data.datasets[1].data = t_core;
    chartInstance.data.datasets[2].data = t_clo;
    chartInstance.data.datasets[3].data = q_lat_skin;
    chartInstance.data.datasets[4].data = q_tot_skin;
    chartInstance.data.datasets[5].data = q_resp;
    chartInstance.data.datasets[6].data = skin_wet;

    if (isCelsius) {
      chartInstance.data.labels = ta;
      chartInstance.options.scales.xAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°C]";
    } else {
      xLabelF = [];
      for (i = 0; i < ta.length; i++) {
        xLabelF.push(util.CtoF(ta[i]));
      }
      chartInstance.data.labels = xLabelF;
      chartInstance.options.scales.xAxes[0].scaleLabel.labelString =
        "Dry-bulb air temperature [°F]";
    }

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
            label: "Skin temperature",
            data: t_skin,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#5e60ce",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Core temperature",
            data: t_core,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#4ea8de",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Clothing temperature",
            data: t_clo,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#56cfe1",
            hidden: false,
            yAxisID: "y",
          },
          {
            label: "Latent heat loss skin",
            data: q_lat_skin,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#d6cfcb",
            hidden: false,
            yAxisID: "y2",
          },
          {
            label: "Total skin heat loss",
            data: q_tot_skin,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#ccb7ae",
            hidden: false,
            yAxisID: "y2",
          },
          {
            label: "Heat loss respiration",
            data: q_resp,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#a6808c",
            hidden: false,
            yAxisID: "y2",
          },
          {
            label: "Skin wetness",
            data: skin_wet,
            backgroundColor: "rgba(255, 159, 64, 0)",
            borderColor: "#696969",
            hidden: false,
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
              ticks: {
                beginAtZero: true,
              },
            },
            {
              id: "y2",
              position: "right",
              scaleLabel: {
                display: true,
                labelString: "Heat Loss [W]",
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Dry-bulb air temperature [°C]",
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
