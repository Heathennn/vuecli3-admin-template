<template>
  <div id="sportcharts">
  </div>
</template>

<script>
// var echarts = require('echarts/lib/echarts'); // 主模块

// require('echarts/lib/chart/bar'); // 柱状图
// require('echarts/lib/component/tooltip');  // 提示框
// require('echarts/lib/component/title'); // 标题

export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let _this = this;
    return {
      myChart: null,
      options: {}
    };
  },
  methods: {
    setWidth() {
      let parent = document.getElementById('sportcharts').parentNode;
      let chart = document.getElementById('sportcharts');
      chart.style.width = parent.style.width;
    },
    initChart() {
      this.setChartOptions(this.chartData);
      this.setWidth();
      this.myChart = echarts.init(document.getElementById('sportcharts'));
      this.myChart.setOption(this.options);
    },
    resetChart(data) { 
      // if (!this.myChart) return;
      this.myChart.clear();
      this.setChartOptions(data);
      this.myChart.setOption(this.options);
    },
    setChartOptions(chartData) {
      let chartOptions = {
        title: {
          text: '运动记录'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        axisPointer: {
          link: { xAxisIndex: 'all' },
          label: {
            backgroundColor: '#777'
          }
        },
        grid: {
          left: '7%',
          right: '10%',
          bottom: '7%'
        },
        xAxis: [
          {
            type: 'category',
            // boundaryGap: false,
            // scale: false,
            // nameLocation: 'center',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                var str = value.substr(4);
                var mon = str.substr(0, 2);
                var date = str.substr(2);
                var format = mon + '/' + date;
                return format;
              }
            },
            // data: [20180424] // 横坐标
            data: chartData.statisticDate // 横坐标
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '运动时长(秒)',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          },
          {
            type: 'value',
            name: '消耗卡路里(kcal)',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          }
        ],
        series: [
          {
            name: '运动时长',
            type: 'bar',
            yAxisIndex: 0, // 表示第几根折线
            // smooth: true,
            barWidth: 30,
            tooltip: {
              trigger: 'axis'
            },
            data: chartData.sportLength
          },
          {
            name: '消耗卡路里',
            type: 'bar',
            barWidth: 30,
            tooltip: {
              trigger: 'axis'
            },
            yAxisIndex: 1, // 表示第几根折线
            data: chartData.sportCalorie
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'empty',
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            filterMode: 'empty',
            start: 0,
            end: 100
          }
        ]
      };
      this.options = chartOptions;
    }
  },
  watch: {
    chartData(value) {
      this.resetChart(value);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }
};
</script>

<style lang="scss" scoped>
#sportcharts {
  width: 1100px;
  height: 500px;
}
</style>
