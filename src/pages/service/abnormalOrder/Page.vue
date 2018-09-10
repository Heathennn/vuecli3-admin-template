<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="abnormalOrderPage">
      <div class="title">
        异常订单
      </div>
      <div class="selects">
        <div class="subTitle">门店</div>
        <div class="statusSelect">
          <el-select v-model="store" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>

        <div class="subTitle">状态</div>
        <div class="statusSelect">
          <el-select v-model="status" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in overtimePayStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="subTitle">申请</div>
        <div class="statusSelect">
          <el-select v-model="result" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="subTitle">日期</div>
        <div class="timeSelect">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>

        <div>
          <el-input placeholder="请输入订单ID, 按回车搜索" v-model="orderSn" @keyup.enter.native="getData">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div class="messageTableBox" v-loading="isFetchingAbnormalOrderData" v-permission="'07d449a4-10fa-4c2b-b9dd-ca69a1554cd3'">
        <abnormal-order-table :tableData="abnormalOrderList"></abnormal-order-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <abnormal-order-sub-page v-else :subPageInfo="routeQuery"></abnormal-order-sub-page>
</template>

<script>
import AbnormalOrderTable from './components/AbnormalOrderTable';

import AbnormalOrderSubPage from './components/AbnormalOrderSubPage';

import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  components: {
    AbnormalOrderTable,
    AbnormalOrderSubPage
  },
  computed: {
    ...mapState({
      abnormalOrderList: state => state.abnormalOrder.abnormalOrderList,
      abnormalOrderDropDownList: state =>
        state.abnormalOrder.abnormalOrderDropDownList,
      isFetchingAbnormalOrderData: state =>
        state.abnormalOrder.isFetchingAbnormalOrderData,
      total: state => state.abnormalOrder.total,
      pageSize: state => state.abnormalOrder.pageSize,
      pageNum: state => state.abnormalOrder.pageNum
    }),
    storeList() {
      // let list = [];
      let list = deepCopy(this.abnormalOrderDropDownList);
      list.unshift({
        storeName: '全部门店',
        id: 'all'
      });
      return list;
    },
    routeQuery() {
      return (
        Object.keys(this.$route.query)[0] +
        '=' +
        this.$route.query[Object.keys(this.$route.query)[0]]
      );
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
      time: [],
      currentPage: 1,
      curPageSize: 10,
      curTotal: 0,
      deviceStatus: '已绑设备',
      input: '',
      orderSn: '',
      overtimePayStatusOptions: [
        {
          value: 'all',
          label: '全部类型'
        },
        {
          value: '1',
          label: '未支付'
        },
        {
          value: '2',
          label: '已支付'
        }
      ],
      resultOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '无'
        },
        {
          value: '2',
          label: '提交'
        },
        {
          value: '3',
          label: '通过'
        },
        {
          value: '4',
          label: '未通过'
        }
      ],
      result: 'all',
      status: 'all',
      store: 'all'
    };
  },
  watch: {
    time() {
      this.fetchData();
    },
    result() {
      this.fetchData();
    },
    store() {
      this.fetchData();
    },
    status() {
      this.fetchData();
    }
  },
  methods: {
    ...mapActions([
      'getAbnormalOrderList',
      'getAbnormalOrderDropDownStoreList'
    ]),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData();
    },
    getData() {
      this.fetchData();
    },
    createParams() {
      let params = {};
      params.page = this.currentPage;
      params.size = this.curPageSize;
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0]+ ' 00:00:00';
        params.endTime = this.time[1]+ ' 23:59:59';
      }
      if (this.status !== 'all') {
        params.overtimePayStatus = this.status;
      }
      /**
       * 全部：appealSign、appealResult 什么都不传
          无：appealSign=2、appealResult 不传
          申诉：appealSign=1、appealResult 不传
          通过：appealSign=1、appealResult =1
          未通过：appealSign=1、appealResult =2
       */
      if (this.result !== 'all') {
        if (this.result == '1') {
          params.appealSign = 2;
        }
        if (this.result == '2') {
          params.appealSign = 1;
        }
        if (this.result == '3') {
          params.appealSign = 1;
          params.appealResult = 1;
        }
        if (this.result == '4') {
          params.appealSign = 1;
          params.appealResult = 2;
        }
      }
      return params;
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    fetchData() {
      this.getAbnormalOrderList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
      this.getAbnormalOrderDropDownStoreList();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.abnormalOrderPage {
  background-color: #ffffff;
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
  .selects {
    @include flexbox;
    @include align-items(center);
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .subTitle {
    width: 40px;
  }
  .selectTitle {
    line-height: 40px;
    margin: {
      right: 10px;
    }
  }
  .statusSelect {
    margin: {
      right: 20px;
    }
  }
  .timeSelect {
    margin: {
      right: 10px;
    }
  }
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
}
</style>
