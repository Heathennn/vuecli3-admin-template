<template>
  <div class="homePage protalPage">
    <div class="homeHeader">
      <div class="cards">
        <card title="Card组件1"
              unity="(单位1)"
              :value="6666"></card>
        <card title="Card组件2"
              unity="(单位2)"
              :value="6666"></card>
        <card title="Card组件3"
              unity="(单位3)"
              :value="6666"></card>
        <card title="Card组件4"
              unity="(单位4)"
              :value="6666"></card>
      </div>
      <admin-tips>
        悬浮效果的卡片组件:  hover浮起, 内嵌vue-count-to组件, 路径: /src/pages/home/components/Card.vue
      </admin-tips>
    </div>

    <div class="echarts_demo1">
      <admin-chart1></admin-chart1>
      <admin-tips>
        Echarts折线图:  两条折线公用一条指示线, 双y轴, 格式化x轴坐标内容, 自适应屏幕缩放, 路径: /src/pages/home/components/AdminChart1.vue
      </admin-tips>
    </div>
  </div>
</template>

<script>
import Card from './components/Card';

import AdminChart1 from './components/AdminChart1';

import AdminTips from 'components/AdminTips';

export default {
  data() {
    return {
      title1: '营业额(元)',
      value1: '6666'
    };
  },
  computed: {

  },
  components: {
    Card,
    AdminChart1,
    AdminTips
  },
  methods: {

  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        // vm.getHomeOverview();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.homePage {
  box-sizing: border-box;
  padding: 20px;
}
.homeHeader {
  // background-color: #ffffff;
  box-sizing: border-box;
  padding: {
    top: 15px;
    bottom: 15px;
  }
  margin: {
    bottom: 20px;
  }
  .title {
    font-size: 30px;
  }
  .cards {
    @include flexbox;
    @include justify-content(space-between);
    width: 100%;
  }
}
.orderChart {
  box-sizing: border-box;
  padding: 10px;
  background-color: #ffffff;
  margin: {
    bottom: 20px;
  }
}

.twoCharts {
  width: 100%;
  height: 500px;
  // box-sizing: border-box;
  @include flexbox;
  @include justify-content(space-around);
  .chart-left, .chart-right {
    width: 45%;
    height: 100%;
    background-color: #ffffff;
  }
}
</style>
