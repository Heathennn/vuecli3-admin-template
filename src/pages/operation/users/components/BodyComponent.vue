<template>
  <div id="bodyComponentChart"></div>
</template>

<script>
// var echarts = require('echarts');
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    active: {
      type: String,
      default: '体重'
    }
  },
  computed: {
    yDatas() {
      return this.chartData.data
    },
    xDatas() {
      return this.chartData.time
    }
  },
  data() {
    return {
      bodyComponent: null,
      options: {}
    };
  },
  methods: {
    initChart() {
      // this.setChartOptions(this.chartData);
      this.$nextTick( () => {
        this.setChartOptions(this.chartData);
        this.bodyComponent = echarts.init(
          document.getElementById('bodyComponentChart')
        );
        this.bodyComponent.setOption(this.options);
      })
    },
    resetChart(data) {
      if (!this.bodyComponent) return;
      this.bodyComponent.clear();
      this.setChartOptions(data);
      this.bodyComponent.setOption(this.options);
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
          top: '10%',
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
          data: _this.xDatas,
          // data: [10, 10, 10],
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
            data: _this.yDatas,
            // data: [8, 9, 10],
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
    'chartData.data'(value) {
      this.resetChart(value);
    }
  },
  mounted() {
    // console.log(this.chartData)
    this.$nextTick(() => {
      // this.bodyComponent = echarts.init(document.getElementById('bodyComponentChart'));
      this.initChart();
    });
  }
};
</script>

<style lang="scss" scoped>
#bodyComponentChart {
  width: 100%;
  height: 100%;
}
</style>
