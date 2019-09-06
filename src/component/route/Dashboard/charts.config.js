export const VOLUME_CHART = (data, bgFill, lineFill) => ({
  type: 'line',
  data: {
    labels: data.map((t) => t.label),
    datasets: [
      {
        backgroundColor: bgFill,
        borderColor: lineFill,
        borderWidth: 2,
        data: data.map((t) => t.value),
        fill: 'start',
        lineTension: 0,
        radius: 0,
        hitRadius: 8,
        steppedLine: 'before',
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    tooltips: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, .8)',
      mode: 'nearest',
      displayColors: false,
      callbacks: {
        label: tooltipItem => `$ ${tooltipItem.value}`
      }
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
            maxTicksLimit: 6,
            beginAtZero: false,
            maxRotation: 0,
            padding: 10,
            labelOffset: 15,
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
