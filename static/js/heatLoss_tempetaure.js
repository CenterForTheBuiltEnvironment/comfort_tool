let heatLoss_chart = new function () {

    // generate range of integers
    this.range = function(start, end) {
        let ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    };

    let ctx;
    let chartInstance;

    let ta, i, heatLosses, h1, h2, h3, h4, h5, h6, xLabelF;

    ta = this.range(envVarLimits.ta.si.min, envVarLimits.ta.si.max);

    // function that calculate the heat losses
    this.getData = function () {

        h1 = [];
        h2 = [];
        h3 = [];
        h4 = [];
        h5 = [];
        h6 = [];

        for (i = 0; i < ta.length; i++) {
            heatLosses = comf.pmv(ta[i], d.tr, d.vel, d.rh, d.met, d.clo, d.wme);
            h1.push(heatLosses.hl1.toFixed(1));
            h2.push(heatLosses.hl2.toFixed(1));
            h3.push(heatLosses.hl3.toFixed(1));
            h4.push(heatLosses.hl4.toFixed(1));
            h5.push(heatLosses.hl5.toFixed(1));
            h6.push(heatLosses.hl6.toFixed(1));
        }

    };

    // function that updates the chart whenever user selects a different input
    this.update = function () {

        this.getData();

        chartInstance.data.datasets[0].data = h1;
        chartInstance.data.datasets[1].data = h2;
        chartInstance.data.datasets[2].data = h3;
        chartInstance.data.datasets[3].data = h4;
        chartInstance.data.datasets[4].data = h5;
        chartInstance.data.datasets[5].data = h6;

        if (isCelsius) {
            chartInstance.data.labels = ta;
        } else {
            xLabelF = [];
            for (i = 0; i < ta.length; i++) {
                xLabelF.push(util.CtoF(ta[i]));
            }
            chartInstance.data.labels = xLabelF;
        }

        chartInstance.update();
    };

    // function that draws the chart
    this.draw = function () {
        Chart.defaults.global.defaultFontFamily = "sans-serif";

        this.getData();

        ctx = document.getElementById('chart_heatLoss_div').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ta,
                datasets: [{
                    label: 'Skin',
                    data: h1,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                }, {
                    label: 'Sweating',
                    data: h2,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                }, {
                    label: 'Respiration Lat',
                    data: h3,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                }, {
                    label: 'Respiration Sens',
                    data: h4,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                }, {
                    label: 'Radiation',
                    data: h5,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                }, {
                    label: 'Convection',
                    data: h6,
                    backgroundColor: 'rgba(255, 159, 64, 0)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                }],
            },
            options: {
                title: {
                    display: true,
                    text: 'Heat Loss Components'
                },
                legend: {
                    position: 'bottom',
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Heat Loss, W",
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Dry-bulb air temperature, °C",
                        },
                    }]
                },
                layout: {
                    padding: 5
                },
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0 // disables bezier curves
                    }
                }
            }
        });

    };
};



