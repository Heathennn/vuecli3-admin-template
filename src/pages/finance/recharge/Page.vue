<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        充值
      </div>
      <!-- 日期选择 -->
      <div class="time">
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div class="table" v-loading="isFetchingRechargeData" v-permission="'b30b928e-fdc1-4a2a-8f87-7dcf7497dddb'">
        <recharge-table :tableData="rechargeList"></recharge-table>
      </div>
    </div>
  </div>
  <recharge-sub-page v-else :subPageInfo="routeQuery"></recharge-sub-page>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import rechargeTable from './components/rechargeTable';

import RechargeSubPage from './components/RechargeSubPage';

// import moment from 'moment';

export default {
  watch: {
    time() {
      this.fetchData();
    }
  },
  components: {
    rechargeTable,
    // rechargeDetail,
    RechargeSubPage
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      // 1 支付宝 2 微信 确认
      rechargeList: state => state.recharge.rechargeList,
      rechargeDetailList: state => state.recharge.rechargeDetailList,
      isFetchingRechargeData: state => state.recharge.isFetchingRechargeData,
    }),
    routeQuery() {
      return Object.keys(this.$route.query)[0];
    },
    isLoadSubPage() {
      if (Object.keys(this.$route.query)[0]) {
        return false;
      } else {
        return true;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  methods: {
    ...mapActions(['getRechargeList', 'getRechargeDetailList']),
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00'
        params.endTime = this.time[1] + ' 23:59:59'
      }
      return params;
    },
    fetchData() {
      this.getRechargeList(this.createParams()).then( () => {
      })
    }
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '本周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      time: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData();
    });
  }
};
</script>
<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .sportOrderTop {
    display: -webkit-flex;
    justify-content: space-between;
    margin: 20px;
    width: 100%;
  }
  .table {
    width: 100%;
  }
  .title {
    width: 100%;
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .sportOrderBotom {
    width: 100%;
    .paging {
      margin-top: 30px;
      margin-left: 800px;
    }
  }
  .time {
    margin: 20px 0;
  }
  .paging {
    margin-top: 30px;
  }
}
</style>
