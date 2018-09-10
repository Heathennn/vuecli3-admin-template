<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        安全画面
      </div>
      <div class="sportOrderTop">
        <!-- 门店选择框 -->
        <div>
          门店：
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!-- 类型选择框 -->
        <div>
          类型：
          <el-select v-model="type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom" v-permission="'85c36449-4f88-4255-a3eb-a520a46d6bac'">
        <div>
          <securezoom-tab :tableData="monitorList"></securezoom-tab>
        </div>
        <!-- 分页 -->
        <div class="paging">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <secure-page v-else :subPageType="routeQuery"></secure-page>
</template>

<script>
import securezoomTab from './components/securezoomTab';

import SecurePage from './components/securePage';

import { mapState, mapActions } from 'vuex';

import secureDetail from './components/secureDetail';

import { deepCopy } from 'common/utils';
export default {
  components: {
    securezoomTab,
    SecurePage
  },
  watch: {
    store() {
      this.fetchData();
    },
    time(val) {
      // console.log(val)
      this.fetchData();
    },
    type() {
      this.fetchData();
    }
  },
  computed: {
    ...mapState({
      monitorList: state => state.securezoom.monitorList,
      monitorDetailList: state => state.securezoom.monitorDetailList, //详情页接口
      pageSize: state => state.securezoom.pageSize,
      pageNum: state => state.securezoom.pageNum,
      total: state => state.securezoom.total,
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
  methods: {
    ...mapActions([
      'getMonitorList',
      'getMonitorDetailList',
      'getErrorDropDownStoreList'
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
    createParams() {
      let params = {};
      params.page = this.currentPage;
      params.size = this.curPageSize;
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.type !== 'all') {
        params.alarmType = this.type;
      }
      return params;
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      // console.log('zongyeshu', this.total);
      this.curPageSize = this.pageSize;
    },
    fetchData() {
      this.getMonitorList(this.createParams()).then(() => {
        this.mapPagination();
      });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  data() {
    return {
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '陌生人闯入'
        },
        {
          value: '2',
          label: '安全画面'
        }
      ],
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0,
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value7: '',
      pickerOptions1: {},
      input21: '',
      store: 'all',
      type: 'all',
      time: []
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
      // this.getMonitorList();
      this.fetchData();
      this.getErrorDropDownStoreList();
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
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>
