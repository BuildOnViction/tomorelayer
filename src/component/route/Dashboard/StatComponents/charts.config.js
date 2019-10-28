import { bilformat } from 'service/helper'

export const VOLUME_CHART = (data, bgFill, lineFill) => ({
  type: 'line',
  data: {
    labels: data.map((t) => t.date),
    datasets: [
      {
        backgroundColor: bgFill,
        borderColor: lineFill,
        borderWidth: 2,
        data: data.map((t) => t.volume),
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
        label: tooltipItem => bilformat(tooltipItem.value, '$')
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
            maxTicksLimit: 5,
            padding: 20,
            fontColor: '#7473A6',
            callback: value => bilformat(value, '$')
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
    labels: data.map((t) => t.symbol),
    datasets: [
      {
        borderColor: 'transparent',
        backgroundColor: fills,
        data: data.map((t) => t.percent),
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
          type: 'category',
          categoryPercentage: 1,
          barPercentage: 0.4,
          gridLines: {
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            padding: 20,
            fontColor: '#7473A6',
          },
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
            beginAtZero: true,
            padding: 0,
            display: false,
            suggestedMax: data[0].percent * 1.1,
          }
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
