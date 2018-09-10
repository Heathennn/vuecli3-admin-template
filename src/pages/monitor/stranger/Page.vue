<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        陌生人闯入记录
      </div>
      <div class="sportOrderTop">
        <div>
          门店：
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!-- 类型选择框 -->
        <div style="margin-left: 10px; margin-right: 20px">
          状态：
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom" v-permission="'2b89c3d6-0675-4507-8415-357823b95e4a'">
        <div v-loading="strangereIsFetchingData">
          <stranger-tab :tableData="strangerList"></stranger-tab>
        </div>
        <!-- 分页 -->
        <div class="paging">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <stranger-Page v-else :subPageType="routeQuery"></stranger-Page>
</template>

<script>
import { deepCopy } from 'common/utils';

import strangerTab from './components/strangerTab';

import strangerPage from './components/strangerPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    strangerTab,
    strangerPage
  },
  watch: {
    store() {
      this.fetchData();
    },
    value() {
      this.getStrangerList(this.computeParams()).then(() => {
        this.mapPagination();
      });
    },
    time(val) {
      // console.log(val)
      this.fetchData();
    }
  },
  computed: {
    ...mapState({
      strangerList: state => state.stranger.strangerList,
      strangerDetailList: state => state.stranger.strangerDetailList, //详情页接口,
      errorDropdownStoreList: state => state.error.errorDropdownStoreList,
      pageSize: state => state.stranger.pageSize,
      pageNum: state => state.stranger.pageNum,
      total: state => state.stranger.total,
      strangereIsFetchingData: state =>
        state.stranger.strangereIsFetchingData
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
      'getStrangerList',
      'getStrangerDetailList',
      'getErrorDropDownStoreList'
    ]),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
      this.fetchData();
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
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    computeParams() {
      let params = {};
      if (this.value !== 'all') {
        params.dealStatus = this.value;
      }
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getStrangerList(this.computeParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
        vm.getStrangerList({
          page: 1,
          size: 10
        })
      });
    })
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
          label: '待处理'
        },
        {
          value: '2',
          label: '已处理'
        }
      ],
      value: 'all',
      store: 'all',
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      value11: '',
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
      value1: '',
      value2: '',
      input21: '',
      time: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getStrangerList({
        page: 1,
        size: 10
      });
    });
    this.getErrorDropDownStoreList();
    this.fetchData();
    // this.getErrorDropDownStoreList().then(() => {
    //   this.fetchData();
    // });
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
  overflow-y: scroll;
  padding: 20px;
  .sportOrderTop {
    @include flexbox;
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
