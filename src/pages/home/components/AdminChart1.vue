<template>
    <div id="ordercharts">

    </div>
</template>

<script>
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
        this.myChart = echarts.init(document.getElementById('ordercharts'));
        this.myChart.setOption(this.options);
        window.onresize = this.myChart.resize;
      },
      resetChart(data) {
        this.myChart.clear();
        this.setChartOptions(data);
        this.myChart.setOption(this.options);
      },
      setChartOptions(chartData) {
        let chartOptions = {
          title: {
            text: '营业额&订单'
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
              boundaryGap: false,
              scale: false,
              nameLocation: 'center',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 1,
                formatter: function(value) {
                  var str = value.substr(4);
                  var mon = str.substr(0, 2);
                  var date = str.substr(2);
                  var format = mon + '/' + date;
                  return format;
                }
              },
              data: ['20180101', '20180102', '20180103', '20180104', '20180105', '20180106', '20180107'] // 横坐标
              // data: chartData.dateStr // 横坐标
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '营业额',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            {
              type: 'value',
              name: '订单量',
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
              name: '营业额',
              type: 'line',
              yAxisIndex: 0, // 表示第几根折线
              smooth: true,
              tooltip: {
                trigger: 'axis'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'red' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'white' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
              data: [10, 20, 30, 40, 50, 60, 20]
              // data: JSON.parse(chartData.orderMoney)
            },
            {
              name: '订单量',
              type: 'line',
              yAxisIndex: 1, // 表示第几根折线
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'blue' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'white' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
              data: [123, 123, 342, 123, 234, 567, 212]
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
    #ordercharts {
        width: 100%;
        height: 500px;
    }
</style>
