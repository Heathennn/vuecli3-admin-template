<template>
  <div class="shopTab">
    <div class="wraper">
      <div class="title">
        充值明细
      </div>
      <div class="orderTop">
        <!-- 支付方式 -->
        <div>
          支付方式：
          <el-select v-model="payWay" placeholder="请选择">
            <el-option v-for="item in payWayOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 时间选择 -->
        <div>
          日期：
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
        <!-- <div>
          <el-input placeholder="订单号" prefix-icon="el-icon-search" v-model="input21">
          </el-input>
        </div> -->
      </div>
      <div class="rechargeDetailTable" v-loading="isFetchingRechargeDetailData">
        <detail-table :tableData="rechargeDetailList"></detail-table>
      </div>
      <div class="paging">
        <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
      <!--  汇总 -->
      <el-table :data="rechargeTotal" style="width: 100%" align="center">
      <el-table-column label="起止时间">
        <template slot-scope="scope">
          {{time[0] + '至' + time[1]}}
        </template>
      </el-table-column>
      <el-table-column prop="totalType" label="充值方式">
      </el-table-column>
      <el-table-column prop="totalTimes" label="充值总笔数">
      </el-table-column>
      <el-table-column prop="totalUser" label="用户总量">
      </el-table-column>
      <el-table-column prop="totalMoney" label="累加充值额">
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
import detailTable from './DetailTable';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  components: {
    detailTable
  },
  computed: {
    ...mapState({
      rechargeDetailList: state => state.recharge.rechargeDetailList,
      rechargeTotal: state => state.recharge.rechargeTotal,
      isFetchingRechargeDetailData: state => state.recharge.isFetchingRechargeDetailData,
      pageSize: state => state.recharge.pageSize,
      pageNum: state => state.recharge.pageNum,
      total: state => state.recharge.total,
    })
  },
  data() {
    return {
      rechargeChannel: 2,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 1,
      payWayOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '支付宝'
        },
        {
          value: '2',
          label: '微信'
        }
      ],
      payWay: 'all',
      input21: '',
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      time: []
    };
  },
  watch: {
    time() {
      this.fetchDetailData();
      this.fetchData();
    },
    payWay() {
      this.fetchDetailData();
    }
  },
  methods: {
    ...mapActions(['getRechargeDetailList', 'getRechargeList']),
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
      // console.log(this.curTotal)
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
      if (this.payWay !== 'all') {
        params.rechargeChannel = this.payWay; // 支付方式
      }
      params.rechargeType = 2;
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    createParams1() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00'
        params.endTime = this.time[1] + ' 23:59:59'
      }
      return params;
    },
    fetchData() {
      this.getRechargeList(this.createParams1()).then( () => {
      })
    },
    fetchDetailData() {
      this.getRechargeDetailList(this.createParams()).then( () => {
        this.mapPagination();
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.payWay = this.$route.query.rechargeDetail;
      this.setDefaultDate();
      this.fetchDetailData();
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';

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
  .orderTop {
    @include flexbox;
    @include align-items(center);
    margin: 20px 0;
    // justify-content: space-between;
  }
}
</style>
