export const VOLUME_CHART = (data, backgroundFill, lineFill) => ({
  type: 'line',
  data: {
    labels: data.map((t) => t.label),
    datasets: [
      {
        backgroundColor: backgroundFill,
        borderColor: lineFill,
        borderWidth: 1.5,
        data: data.map((t) => t.value),
        fill: 'start',
        steppedLine: false,
        lineTension: 0,
        radius: 0,
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      yAxes: [
        {
          type: 'linear',
          gridLines: {
            drawOnChartArea: false,
            drawBorder: true,
            zeroLineWidth: 2,
            zeroLineColor: 'red',
            color: '#494770',
            drawTicks: false,
          },
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 4,
            stepSize: 10,
            padding: 20,
            fontColor: '#7473A6',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            drawBorder: true,
            zeroLineWidth: 2,
            zeroLineColor: 'red',
            color: '#494770',
            drawTicks: false,
          },
          ticks: {
            fontColor: '#7473A6',
            padding: 20,
            stepSize: 10,
            maxRotation: 0,
          },
        },
      ],
    },
  },
})

export const TOKEN_CHART = (data, fills) => ({
  type: 'horizontalBar',
  data: {
    labels: data.map((t) => t.label),
    datasets: [
      {
        borderColor: 'transparent',
        backgroundColor: fills,
        data: data.map((t) => t.value),
        yAxisID: 'yAxis1',
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    scales: {
      yAxes: [
        {
          id: 'yAxis1',
          type: 'category',
          categoryPercentage: 1,
          barPercentage: 0.2,
          gridLines: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            padding: 20,
            fontColor: '#7473A6',
          },
          position: 'left',
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: false,
            max: data[0].value * 1.1,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        color: '#7473A6',
        anchor: 'end',
        align: 'end',
        clamp: false,
        textAlign: 'end',
        formatter: (v) => `${v}%`,
      },
    },
  },
})
