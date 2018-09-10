<template>
  <div class="account">
    <div class="wraper">
      <div class="title">
        收入明细
      </div>
      <div class="selects">
        <div class="time">
          选择时间：
          <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <!-- 第一个表 和收入首页重复-->
        <div class="searchBar" style="width: 300px;margin-left: 20px">
          <el-input placeholder="输入订单号, 按回车搜索" suffix-icon="el-icon-search" v-model="orderSn" @keyup.enter.native="fetchIncomDetailList">
          </el-input>
        </div>
        <div style="margin-left: 10px; margin-right: 20px">
          消费类型：
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 第二个表 -->
      <total-Table :tableData="detailDatas"></total-Table>
      <div class="paging">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 第三个表 -->
      <div class="totalData" style="margin-top: 30px">
        <el-table :data="datas" style="width: 100%">
          <el-table-column prop="orderTotal" label="订单总量">
          </el-table-column>
          <el-table-column prop="storeTotal" label="门店(间)">
          </el-table-column>
          <el-table-column prop="userTotal" label="用户总量">
          </el-table-column>
          <el-table-column prop="consumeType" label="消费类型(种)">
          </el-table-column>
          <el-table-column prop="orderMoney" label="累加发生额">
          </el-table-column>
          <el-table-column prop="discountMoney" label="累加优惠额">
          </el-table-column>
          <el-table-column prop="payMoney" label="累加实收额">
          </el-table-column>
          <el-table-column prop="consumeChannel" label="支付方式(种)">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import consumptionType from './consumptionType';

import totalTable from './totalTable';

import { deepCopy } from 'common/utils';

import consumptionTypeVue from './consumptionType.vue';

import accountBalanceTab from './accountBalanceTab';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      incomeList: state => state.income.incomeList,
      incomeDetailList: state => state.income.incomeDetailList,
      incomeTotalList: state => state.income.incomeTotalList
    }),
    detailDatas() {
      let list = deepCopy(this.incomeDetailList);
      // list.forEach((item, index) => {
      //   item.orderMoney = (item.orderMoney / 100).toFixed(2);
      //   item.discountMoney = (item.discountMoney / 100).toFixed(2);
      //   item.payMoney = (item.payMoney / 100).toFixed(2);
      // });
      return list;
    },
    datas() {
      let list = deepCopy(this.incomeTotalList);
      list.forEach((item, index) => {
        item.orderMoney = (item.orderMoney / 100).toFixed(2);
        item.discountMoney = (item.discountMoney / 100).toFixed(2);
        item.payMoney = (item.payMoney / 100).toFixed(2);
      });
      return list;
    },
    id() {
      return this.$route.query.account;
    },
  },
  watch: {
    time() {
      this.fetchIncomDetailList();
    },
    value() {
      this.fetchIncomDetailList();
    }
  },
  components: {
    consumptionType,
    totalTable,
    accountBalanceTab
  },
  methods: {
    ...mapActions(['getIncomeTotalList', 'getIncomeDetailList']),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchIncomDetailList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchIncomDetailList();
    },
    createParams() {
      let params = {};
      params.page = this.currentPage;
      params.size = this.curPageSize;
      if (this.time.length > 0) {
        params.beginTime = this.time[0];
        params.endTime = this.time[1];
      }
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      if (this.value !== 'all') {
        params.consumeType = this.value;
      }
      params.storeId = this.id;
      return params;
    },
    fetchIncomDetailList() {
      this.getIncomeDetailList(this.createParams()).then(res => {
        this.curTotal = res.total;
        this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
        this.curPageSize = res.pageSize;
      });
    }
  },
  data() {
    return {
      value: 'all', // 消费类型
      options: [ // 
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '预约运动'
        },
        {
          value: '2',
          label: '商品销售'
        }
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      time: [],
      orderSn: '',
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getIncomeTotalList({
        storeId: this.id
      });
      this.fetchIncomDetailList();
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';

.selects {
  @include flexbox;
  @include align-items(center);
}
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