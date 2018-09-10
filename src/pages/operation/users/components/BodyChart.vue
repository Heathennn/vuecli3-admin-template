<template>
  <div id="bodyChart"></div>
</template>

<script>
// var echarts = require('echarts/lib/echarts'); // 主模块

// require('echarts/lib/chart/line'); // 折线图
// require('echarts/lib/component/tooltip');  // 提示框
// require('echarts/lib/component/title'); // 标题
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    active: {
      type: String,
      default: '胸围'
    }
  },
  data() {
    let _this = this;
    return {
      payChart: null,
      options: {}
    };
  },
  computed: {
    yDatas() {
      return this.chartData.data;
    },
    xDatas() {
      return this.chartData.time;
    }
  },
  methods: {
    initChart() {
      // this.setChartOptions(this.chartData);
      this.setChartOptions(this.chartData);
      this.payChart = echarts.init(document.getElementById('bodyChart'));
      this.payChart.setOption(this.options);
    },
    resetChart(data) {
      this.payChart.clear();
      this.setChartOptions(data);
      this.payChart.setOption(this.options);
    },
    setChartOptions(chartData) {
      let _this = this;
      let curoptions = {
        title: {
          text: '',
          top: 20,
          left: 10
        },
        grid: {
          left: '5%',
          top: '5%',
          right: '4%',
          bottom: '5%'
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
        xAxis: {
          type: 'category',
          // data: JSON.parse(chartData.getStatisticsRechargedateStr),
          data: _this.xDatas,
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var str = value.substr(4);
              var mon = str.substr(0, 2);
              var date = str.substr(2);
              var format = mon + '/' + date;
              return format;
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: _this.active,
            // data: JSON.parse(chartData.getStatisticsRechargeorderNum),
            data: _this.yDatas,
            type: 'line',
            // areaStyle: {
              // color: {
              //   type: 'linear',
              //   x: 0,
              //   y: 0,
              //   x2: 0,
              //   y2: 1,
              //   // colorStops: [
              //   //   {
              //   //     offset: 0,
              //   //     color: 'red' // 0% 处的颜色
              //   //   },
              //   //   {
              //   //     offset: 1,
              //   //     color: 'white' // 100% 处的颜色
              //   //   }
              //   // ],
              //   globalCoord: false // 缺省为 false
              // }
            // }
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
      this.options = curoptions;
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
#bodyChart {
  width: 100%;
  height: 100%;
}
</style>
