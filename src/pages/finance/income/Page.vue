<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        收入
      </div>
      <!-- 日期选择 -->
      <div class="time">
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <!-- 表格 -->
      <div class="incomeTable" v-loading="isFetchingIncomeData" v-permission="'5cda2f6c-0bb8-48be-a0b9-4ee70bd4100c'">
        <income-table :tableData="incomeList"></income-table>
      </div>
      <div class="paging" v-permission="'5cda2f6c-0bb8-48be-a0b9-4ee70bd4100c'">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <income-page v-else :subPageType="routeQuery"></income-page>
</template>
<script>
import incomePage from './components/incomePage';

import incomeTable from './components/incomeTable';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  components: {
    incomePage,
    incomeTable
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0,
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
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      time: []
    };
  },
  watch: {
    time() {
      this.fetchData();
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  computed: {
    ...mapState({
      incomeList: state => state.income.incomeList,
      pageSize: state => state.income.pageSize,
      pageNum: state => state.income.pageNum,
      total: state => state.income.total,
      isFetchingIncomeData: state => state.income.isFetchingIncomeData,
    }),
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
    ...mapActions(['getIncomeList']),
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00'
        params.endTime = this.time[1] + ' 23:59:59'
      }
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
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
    mapPagination() {
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    fetchData() {
      this.getIncomeList(this.createParams()).then( () => {
        this.mapPagination();
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData();
    });
  }
};
</script>
<style lang="scss" scoped>
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
