export const VOLUME_CHART = (data, fills) => ({
  type: 'line',
  data: {
    labels: data.map((t) => t.label),
    datasets: [
      {
        backgroundColor: fills,
        borderColor: '#707070',
        borderWidth: 2,
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
          },
        },
      ],
    },
  },
})
