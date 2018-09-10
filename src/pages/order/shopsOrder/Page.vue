<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">售货机商品订单</div>
      <div class="sportOrderTop">
        <!-- 门店下拉列表 -->
        <div>
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
        <div>
          <el-input placeholder="请输入完整订单号" suffix-icon="el-icon-search" v-model="orderSn" @keyup.enter.native="getData" :autofocus="true">
          </el-input>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBottom" style="width: 100%" v-permission="'d2ca4e88-7f95-4fa1-a7d3-4e8efb25a98e'">
        <div v-loading="shopsOrderIsFetchingData">
          <shops-tab :tableData="shopsOrderList"></shops-tab>
        </div>
        <!-- 分页 -->
        <div class="paging" v-permission="'d2ca4e88-7f95-4fa1-a7d3-4e8efb25a98e'">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shopsTab from './components/shopsTab';

import { deepCopy } from 'common/utils';

import { mapState, mapActions } from 'vuex';
export default {
  watch: {
    time(val) {
      // console.log(val)
      this.fetchData();
    },
    store() {
      this.fetchData();
    },
    $route(val) {
      if(val.query.orderSn) {
        this.orderSn = val.query.orderSn;
      }
    },
    orderSn() {
      this.getData();
    }
  },
  components: {
    shopsTab
  },
  methods: {
    ...mapActions(['getShopsOrderList', 'getErrorDropDownStoreList']),
    handleClick(tab, event) {
      //console.log(tab, event);
      this.tabIndex = tab.label;
      this.fetchData();
    },
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
    handleEdit1(index, row) {
      this.$router.push({ path: '/storePart/store?baseInfo' });
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    computeParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getShopsOrderList(this.computeParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  computed: {
    ...mapState({
      shopsOrderList: state => state.shopsOrder.shopsOrderList,
      pageSize: state => state.shopsOrder.pageSize,
      pageNum: state => state.shopsOrder.pageNum,
      total: state => state.shopsOrder.total,
      shopsOrderIsFetchingData: state =>
        state.shopsOrder.shopsOrderIsFetchingData,
      errorDropdownStoreList: state => state.shopsOrder.errorDropdownStoreList
    }),
    storeList() {
      // let list = [];
      let list = deepCopy(this.errorDropdownStoreList);
      list.unshift({
        storeName: '全部门店',
        id: 'all'
      });
      return list;
    }
  },
  data() {
    return {
      store: 'all',
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      value11: '',
      value1: '',
      input21: '',
      orderSn: '',
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
      }
    };
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
      this.getErrorDropDownStoreList();
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .sportOrderTop {
    display: -webkit-flex;
    justify-content: space-between;
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
