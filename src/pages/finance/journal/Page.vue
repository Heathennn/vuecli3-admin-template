<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">
        平台流水
      </div>
      <div class="sportOrderTop">
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
          <el-input placeholder="搜索用户昵称" suffix-icon="el-icon-search" v-model="username" style="width: 180px; margin-right: 20px; margin-left: 20px;">
          </el-input>
          <el-button type="primary" @click="fetchData">搜索</el-button>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom" v-loading="isFetchingJournalData" v-permission="'172a887f-de65-48a3-aa6f-90b36dac1636'">
        <div style="width: 100%">
          <journal-tab :tableData="journalList"></journal-tab>
        </div>
        <!-- 分页 -->
        <div class="paging">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
            </el-pagination>
          </div>
        </div>
        <div>
          <journal-collect :tableData="CollectList"></journal-collect>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import journalTab from './components/journalTab';

import journalCollect from './components/journalCollect';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  data() {
    return {
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
      // input21: '',
      username: '',
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0,
    };
  },
  watch: {
    time() {
      this.fetchData();
    }
  },
  components: {
    journalTab,
    journalCollect
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
        vm.getCollectList();
      });
    })
  },
  methods: {
    ...mapActions(['getJournalList', 'getCollectList']),
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
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams() {
      let params = {};
      if (this.username) {
        params.page = 1;
        params.userName = this.username;
      } else {
        params.page = this.currentPage;
      }
      params.size = this.curPageSize;
      params.beginTime = this.time[0] + ' 00:00:00';
      params.endTime = this.time[1] + ' 23:59:59';
      return params;
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    fetchData() {
      this.getJournalList(this.createParams()).then( () => {
        this.mapPagination();
      })
    }
  },
  computed: {
    ...mapState({
      journalList: state => state.journal.journalList,
      CollectList: state => state.journal.CollectList,
      pageSize: state => state.journal.pageSize,
      pageNum: state => state.journal.pageNum,
      total: state => state.journal.total,
      isFetchingJournalData: state => state.journal.isFetchingJournalData
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData();
      // this.getJournalList();
      this.getCollectList();
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
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }

  .sportOrderTop {
    @include flexbox;
    margin: 20px 0;
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>
