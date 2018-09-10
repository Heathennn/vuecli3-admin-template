<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="activityPage">
      <div class="title">
        设备异常
      </div>
      <div class="searchBar" style="width: 300px; margin-top: 20px">
        <el-input placeholder="输入设备ID,回车搜索" v-model="input" @keyup.enter.native="fetchData">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="selects">
        <div class="statusSelect">
          <span>门店</span>
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="statusSelect">

        <span>状态</span>
        <el-select v-model="status" placeholder="请选择" style="width: 100px;margin-right: 15px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <span>路径</span>
        <el-select v-model="source" placeholder="请选择" style="width: 100px">
          <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
        <div class="timeSelect" style="margin-left: 15px; margin-right: 15px">
          <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>



      </div>
      <div class="messageTableBox" v-loading="isFetchingData" v-permission="'9629f07f-25e0-486f-ac7d-838270172dfc'">
        <error-table :tableData="errorList"></error-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <error-sub-page v-else :subPageInfo="routeQuery"></error-sub-page>
</template>

<script>
import ErrorTable from './components/ErrorTable';

import ErrorSubPage from './components/ErrorSubPage';

import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  name: 'error',
  components: {
    ErrorTable,
    ErrorSubPage
  },
  data() {
    return {
      time: [],
      currentPage4: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      deviceStatus: '已绑设备',
      input: '',
      store: 'all',
      statusOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '待处理'
        },
        {
          value: 2,
          label: '处理中'
        },
        {
          value: 3,
          label: '已处理'
        }
      ],
      status: 'all',
      source: 'all',
      sourceOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '系统'
        },
        {
          value: 2,
          label: '店长'
        },
        {
          value: 3,
          label: '用户'
        }
      ]
    };
  },
  watch: {
    store() {
      this.fetchData();
    },
    status() {
      this.fetchData();
    },
    time() {
      this.fetchData();
    },
    source() {
      this.fetchData();
    }
  },
  computed: {
    ...mapState({
      errorList: state => state.error.errorList,
      isFetchingData: state => state.error.isFetchingData,
      pageSize: state => state.error.pageSize,
      pageNum: state => state.error.pageNum,
      total: state => state.error.total,
      errorDropdownStoreList: state => state.error.errorDropdownStoreList
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
  methods: {
    ...mapActions(['getErrorList', 'getErrorDropDownStoreList']),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetchData();
    },
    mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    computeParams() {
      let params = {};
      if (this.status !== 'all') {
        params.handleStatus = this.status;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0];
        params.endTime = this.time[1];
      }
      if (this.input) {
        params.facilityId = this.input;
      }
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.source !== 'all') {
        params.source = this.source;
      }
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getErrorList(this.computeParams()).then(() => {
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
      this.getErrorDropDownStoreList().then(() => {
        this.fetchData();
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.activityPage {
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
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
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
      // right: 100px;
    }
  }
}
</style>
