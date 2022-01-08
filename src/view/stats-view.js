import SmartView from './smart-view';
import {createSortedArray, sumTotalCostByType, countEventsByType, sumTotalTimeByType, renderDuration} from '../utils/point.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const chartType = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
};

const createNewChart = (currentChartType, ctx, labels, data) => {
  let currentText;
  let currentFormatter;

  switch (currentChartType) {
    case (chartType.MONEY):
      currentText = 'MONEY';
      currentFormatter = (val) => `€ ${val}`;
      break;
    case (chartType.TYPE):
      currentText = 'TYPE';
      currentFormatter = (val) => `${val}x`;
      break;
    case (chartType.TIME):
      currentText = 'TIME';
      currentFormatter = (val) => `${renderDuration(val)}`;
      break;
  }

  const sortedArrayOfObj = createSortedArray(labels, data);
  const sortedLabelsArray = [];
  const sortedDataArray = [];
  sortedArrayOfObj.forEach((d) => {
    sortedLabelsArray.push(d.label);
    sortedDataArray.push(d.data);
  });

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedLabelsArray,
      datasets: [{
        data: sortedDataArray,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: currentFormatter,
        },
      },
      title: {
        display: true,
        text: currentText,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderMoneyChart = (moneyCtx, points, eventsTypes, eventsTypesTitles) => {
  const eventsTypesTotalCosts = eventsTypes.map((type) => sumTotalCostByType(type, points));

  createNewChart(chartType.MONEY, moneyCtx, eventsTypesTitles, eventsTypesTotalCosts);
};

const renderTypeChart = (typeCtx, points, eventsTypes, eventsTypesTitles) => {
  const eventsTypesTotalCounts = eventsTypes.map((type) => countEventsByType(type, points));

  createNewChart(chartType.TYPE, typeCtx, eventsTypesTitles, eventsTypesTotalCounts);
};

const renderTimeChart = (timeCtx, points, eventsTypes, eventsTypesTitles) => {
  const eventsTypesTotalTime = eventsTypes.map((type) => sumTotalTimeByType(type, points));

  createNewChart(chartType.TIME, timeCtx, eventsTypesTitles, eventsTypesTotalTime);
};

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`);

export default class StatsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;
  #eventsTypes = null;
  #eventsTypesTitles = null;


  constructor(points, eventsTypes) {
    super();

    this._data = {
      points,
    };

    this.#eventsTypes = eventsTypes;
    this.#eventsTypesTitles = this.#eventsTypes.map((type) => type.toUpperCase());

    this.#setCharts();
  }

  get template() {
    return createStatsTemplate();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }

    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }

    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const {points} = this._data;

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    this.#moneyChart = renderMoneyChart(moneyCtx, points, this.#eventsTypes, this.#eventsTypesTitles);
    this.#typeChart = renderTypeChart(typeCtx, points, this.#eventsTypes, this.#eventsTypesTitles);
    this.#timeChart = renderTimeChart(timeCtx, points, this.#eventsTypes, this.#eventsTypesTitles);
  }
}

