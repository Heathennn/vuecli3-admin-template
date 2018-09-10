<template>
  <div id="devicecharts">
  </div>
</template>

<script>
// var echarts = require('echarts/lib/echarts'); // 主模块

// require('echarts/lib/chart/bar'); // 折线图
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
    initChart() {
      this.setChartOptions(this.chartData);
      this.myChart = echarts.init(document.getElementById('devicecharts'));
      this.myChart.setOption(this.options);
    },
    resetChart(data) {
      this.myChart.clear();
      this.setChartOptions(data);
      this.myChart.setOption(this.options);
    },
    setChartOptions(chartData) {
      let chartOptions = {
        title: {
          text: '设备运动时长'
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
            // data: ['跑步机'] // 横坐标
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                return value
              }
            },
            data: chartData.facilityTypeName // 横坐标
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '运动时长',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          },
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          },
          // {
          //   type: 'value',
          //   name: '次数',
          //   axisLine: {
          //     show: false
          //   },
          //   axisTick: {
          //     show: false
          //   },
          // }
        ],
        series: [
          {
            name: '运动时长',
            type: 'bar',
            yAxisIndex: 0, // 表示第几根折线
            // smooth: true,
            barWidth: 20,
            tooltip: {
              trigger: 'axis'
            },
            data: chartData.sportLength
          },
          {
            name: '平均时长',
            type: 'bar',
            yAxisIndex: 1, // 表示第几根折线
            // smooth: true,
            barWidth: 20,
            tooltip: {
              trigger: 'axis'
            },
            data: chartData.averageLength
          },
          {
            name: '次数',
            type: 'bar',
            // yAxisIndex: 2, // 表示第几根折线
            // smooth: true,
            barWidth: 20,
            tooltip: {
              trigger: 'axis'
            },
            data: chartData.times
          }
        ],
        dataZoom: [
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
#devicecharts {
  width: 1180px;
  height: 500px;
}
</style>
