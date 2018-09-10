<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        用户押金
      </div>
      <!-- 日期选择 -->
      <div class="time">
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已交押金" name="first" v-premission="'80c9e349-8673-4155-9f38-fc7072f900a0'">
            <already-PayMoney :tableData="depositList" v-if="depositList && depositList.length > 0" v-loading="isFetchingUserDepositData" v-permission="'0231aed8-21c5-4e54-83b4-ac873b43d6f7'"></already-PayMoney>
          </el-tab-pane>
          <el-tab-pane label="已退押金" name="second" v-permission="'5afdfd18-fb5e-46fb-8f61-a63b0f27fc6b'">
            <!-- <already-Refund :tableData="depositRefundList"></already-Refund> -->
            <span v-permission="'5afdfd18-fb5e-46fb-8f61-a63b0f27fc6b'">暂无</span>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <deposit-Page v-else :subPageInfo="routeQuery"></deposit-Page>
</template>
<script>
import alreadyPayMoney from './components/alreadyPayMoney';

import alreadyRefund from './components/alreadyRefund';

import depositPage from './components/depositPage';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  components: {
    alreadyPayMoney,
    alreadyRefund,
    depositPage
  },
  watch: {
    time() {
      this.fetchData1();
    }
  },
  methods: {
    ...mapActions(['getDepositList', 'getDepositRefundList']),
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams1() {
      let obj = {};
      if (this.time.length > 0) {
        obj.beginTime = this.time[0] + ' 00:00:00';
        obj.endTime = this.time[1] + ' 23:59:59';
      }
      obj.actionType = 2;
      return obj;
    },
    fetchData1() {
      this.getDepositList(this.createParams1());
      this.getDepositRefundList(this.createParams1());
    }
  },
  computed: {
    ...mapState({
      depositList: state => state.userDeposit.depositList,
      depositRefundList: state => state.userDeposit.depositRefundList,
      isFetchingUserDepositData: state => state.userDeposit.isFetchingUserDepositData
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
  data() {
    return {
      activeName: 'first',
      currentPage4: 4,
      time: [],
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
      value4: ''
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData1();
    });
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData1();
      });
    })
  },
};
</script>
<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
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
