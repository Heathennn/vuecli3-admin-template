<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">运动订单</div>
      <div class="sportOrderTop">
        <!-- 门店下拉列表 -->
        <div>
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!-- 选择时间和日期 -->
        <div style="margin-left: 20px; margin-right: 20px">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
        <div class="searchBar">
          <el-input placeholder="请输入完整订单号" v-model="orderSn" @keyup.enter.native="fetchData1" :autofocus="true">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBottom" v-permission="'626c9a54-2bd5-4129-9acf-1d9227caae00'">
        <div style="width: 100%" v-loading="isFetchingUserWalletData">
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="全部" name="-1">
              <all :tableData="sportOrderList"></all>
            </el-tab-pane>
            <el-tab-pane label="待使用" name="1">
              <all :tableData="sportOrderList"></all>
            </el-tab-pane>
            <el-tab-pane label="使用中" name="2">
              <all :tableData="sportOrderList"></all>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="3">
              <all :tableData="sportOrderList"></all>
            </el-tab-pane>
            <el-tab-pane label="已取消" name="4">
              <all :tableData="sportOrderList"></all>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 分页 -->
        <div class="paging"  v-permission="'626c9a54-2bd5-4129-9acf-1d9227caae00'">
          <el-pagination :current-page="currentPage"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :page-size="curPageSize"
                         :page-sizes="pageSizes"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
import all from './components/all';

import { deepCopy } from 'common/utils';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

// const today = moment().format('YYYY-MM-DD');
// 1：待下场，2：使用中，3：已完成，4：已取消
export default {
  watch: {
    time() {
      this.fetchData1();
    },
    store() {
      this.fetchData1();
    },
    $route(val) {
      if (val.query.orderSn) {
        this.orderSn = val.query.orderSn;
      }
    },
    orderSn() {
      this.fetchData1();
    }
  },
  components: {
    all,
  },
  methods: {
    ...mapActions([
      'getSportOrderList',
      'getErrorDropDownStoreList'
    ]),
    handleClick(tab, event) {
      //console.log(tab, event);
      this.fetchData1();
    },
    fetchData1() {
      this.getSportOrderList(this.createParams()).then(() => {
        this.mapPagination();
      });
    },
    createParams() {
      let params = {};
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.activeName2 !== '-1') {
        params.orderStatus = this.activeName2;
      }
      params.page = this.currentPage;
      params.size = this.curPageSize;
      // console.log(params);
      return params;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData1();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData1();
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    }
  },
  data() {
    return {
      activeName2: '-1',
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
      time: [],
      value1: '',
      orderSn: '',
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      store: 'all'
    };
  },
  beforeRouteEnter(to, from, next) {
      next( vm => {
        vm.$nextTick( () => {
          vm.fetchData1();
        });
      })
    },
  computed: {
    ...mapState({
      sportOrderList: state => state.sportOrder.sportOrderList,
      storeNameList: state => state.sportOrder.storeNameList,
      pageSize: state => state.sportOrder.pageSize,
      pageNum: state => state.sportOrder.pageNum,
      total: state => state.sportOrder.total,
      isFetchingUserWalletData: state =>
        state.userWallet.isFetchingUserWalletData,
      errorDropdownStoreList: state => state.sportOrder.errorDropdownStoreList
    }),
    storeList() {
      // let list = [];
      let list = deepCopy(this.errorDropdownStoreList);
      list.unshift({
        storeName: '全部门店',
        id: 'all'
      });
      return list;
    },
  },
  mounted() {
    this.getErrorDropDownStoreList();
    this.$nextTick(() => {
      this.fetchData1();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.wraper {
  background: white;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .sportOrderTop {
    @include flexbox;
    @include align-items(center);
    margin: 20px 0;
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
  .sportOrderBottom {
    width: 100%;
    .paging {
      margin-top: 30px;
      width: 100%;
    }
  }
}
</style>
