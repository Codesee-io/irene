import Component from '@glimmer/component';
import {
  tracked
} from '@glimmer/tracking';
import {
  bb
} from 'billboard.js/dist/billboard.min.js';
import {
  action
} from '@ember/object'
import {
  task
} from 'ember-concurrency';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import {
  inject as service
} from '@ember/service';
import ENV from 'irene/config/environment';

import moment from 'moment';
export default class ChartsClientUploadsComponent extends Component {

  // Dependencies
  @service store;

  @service ajax;
  @service me;

  constructor() {
    super(...arguments)
    dayjs.extend(advancedFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(weekday);
  }

  // Properties
  @tracked isHideLegend = true;

  @tracked chartData = [];

  @tracked isRedrawChart = false;

  @tracked timelinePlaceholders = [{
      key: "month",
      axisKey: 'month',
      format: 'MMM/YY',
      tooltipFormat(d) {
        return new dayjs(d).format('MMM/YYYY');
      }
    },
    {
      key: "week",
      axisKey: 'week',
      format: 'wo',
      tooltipFormat(d) {
        return `${dayjs(d).format('DD-MM-YYYY')} - ${dayjs(d).add(7, 'day').format('DD-MM-YYYY')}`;
      }
    }, {
      key: "day",
      axisKey: 'date',
      format: 'DD/MMM',
      tooltipFormat(d) {
        return new dayjs(d).format('DD-MM-YYYY');
      }
    }
  ];

  @tracked currentTimeline = this.timelinePlaceholders[0];

  @tracked chartContainer = null;

  @tracked startDate = dayjs().startOf('year').format('YYYY-MM-DD');

  maxDate = dayjs(Date.now());

  @tracked endDate = dayjs(Date.now()).format('YYYY-MM-DD');

  dateRange = [moment().startOf('year'), moment()];


  // Actions
  async drawChart(element) {
    const component = this;
    component.chartContainer = await bb.generate({
      data: {
        x: "x",
        columns: this.chartData,
        type: "area", // for ESM specify as: bar()
      },
      grid: {
        focus: {
          show: false
        }
      },
      axis: {
        x: {
          padding: {
            right: 1000 * 60 * 60 * 12
          },
          type: "timeseries",
          tick: {
            format: function (val) {
              return new dayjs(val).format(component.currentTimeline.format);
              // return 'MM'
            }
          },
          label: {
            text: `${component.currentTimeline.key.toUpperCase()}`,
            position: "outer-center"
          }

        },
        y: {
          default: [0, 5],
          tick: {
            stepSize: 1,
          },
          label: {
            text: "UPLOAD COUNT",
            position: "outer-middle"
          }
        }
      },
      legend: {
        show: false
      },

      tooltip: {
        contents: function (d) {
          return component.tooltipTemplate(component, d[0].x, d[0].value); // formatted html as you want
        }
      },
      transition: {
        duration: 500
      },
      bindto: element
    });
    component.isRedrawChart = false;
    return;
  }

  @action
  onChangeTimeline(option) {
    if (this.currentTimeline !== option.key) {
      this.currentTimeline = option;
      this.isRedrawChart = true;
      this.loadChart.perform();
      // yield this.updateChart.perform();
    }
  }

  @action
  updateDateRange(dateRange) {
    this.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
    this.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    this.isRedrawChart = true;
    this.loadChart.perform();
  }

  // Functions

  /**
   * Method to get custom tooltip body
   * @param {Object} component
   * @param {Date} x
   * @param {Number} y
   */
  tooltipTemplate(component = this, x, y) {
    return `${component.currentTimeline.key.toUpperCase()}:
            ${component.currentTimeline.tooltipFormat(x)} <br>
            Scans: ${y}`
  }

  /**
   * @function loadChart
   * Method to load chart data and inject chart into the DOM
   */
  @task(function* (element) {
    const filter = {
      timelines: this.currentTimeline.key,
      start_date: this.startDate,
      end_date: this.endDate
    }
    const url = `${this.me.partner.id}${this.args.clientId ? '/clients/'+this.args.clientId : ''}/${ENV.endpoints.partnerOverallScansCount}`;
    const rawChartData = yield this.ajax.request(url, {
      namespace: 'api/v2/partner',
      type: 'GET',
      data: filter
    });
    yield this.parseChart.perform(rawChartData);
    if (!this.isRedrawChart) {
      yield this.drawChart(element);
    } else {
      yield this.redrawChart.perform();
    }

  }) loadChart;

  @task(function* (rawData) {
    const chartData = rawData.statistics[this.currentTimeline.key];
    const xAxisData = ['x'];
    const yAxisData = ['y'];
    console.log('chartData', chartData)
    chartData.map((data) => {
      xAxisData.push(data.start_date);
      yAxisData.push(data.count)
    })
    this.chartData = yield [xAxisData, yAxisData];
    return this.chartData;
  }) parseChart;

  @task(function* () {
    yield this.chartContainer.axis.labels({
      x: this.currentTimeline.key.toUpperCase()
    })
    yield this.chartContainer.load({
      columns: this.chartData
    });
    return;
  })
  redrawChart;

}
