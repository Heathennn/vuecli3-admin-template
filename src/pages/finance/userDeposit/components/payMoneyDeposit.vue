<template>
  <div class="wraper">
    <div class="title">
      已交押金明细
    </div>
    <div class="payMoney">
      <div class="paySelect">
        支付方式：
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="time" style="margin-left: 20px">
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div v-loading="isFetchingUserDepositData">
      <depost-tab :tableData="depositDetailList"></depost-tab>
    </div>
    <div class="paging">
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import depostTab from './depostTab';

import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

// import moment from 'moment';

export default {
  components: {
    depostTab
  },
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      time: [],
      pageSizes: [10, 20, 30, 40],
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
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0,
      activeName: 'first',
      options: [
        {
          value: 1,
          label: '支付宝'
        },
        {
          value: 2,
          label: '微信'
        }
      ],
      value: 2
    };
  },
  computed: {
    ...mapState({
      depositDetailList: state => state.userDeposit.depositDetailList, //充值
      pageSize: state => state.userDeposit.pageSize,
      pageNum: state => state.userDeposit.pageNum,
      total: state => state.userDeposit.total,
      isFetchingUserDepositData: state => state.userDeposit.isFetchingUserDepositData
    })
  },
  watch: {
    value(curVal) {
      this.fetchDetailData();
    },
    time() {
      this.fetchDetailData();
    }
  },
  methods: {
    ...mapActions(['getDepositDetailList']),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchDetailData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchDetailData();
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
      // console.log(this.curTotal);
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      params.payChannel = this.value;
      params.actionType = 1;
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchDetailData() {
      this.getDepositDetailList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  created() {
    let id = this.$route.query.payChannel == '微信' ? 1 : 2;
    this.value = Number(this.$route.query.depositDetail1);
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchDetailData();
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';

.wraper {
  // overflow-y: scroll;
  background: white;
  width: 100%;
  min-height: 100%;
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
  .paySelect {
    margin: 20px 0;
  }
  .time {
    margin: 20px 0;
  }
  .payMoney {
    @include flexbox;
    @include align-items(center);
  }
}
</style>
