<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">

      <div class="title">
        退款
      </div>
      <!-- 日期选择 -->
      <div class="time">
        <div class="block">
          <el-date-picker v-model="value4" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </div>
      </div>
      <!-- 表格 -->
      <div>
        <refund-table :tableData="refundList"></refund-table>
      </div>
      <!-- <div class="paging">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[20, 40, 60, 80]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="3">
          </el-pagination>
        </div>
      </div> -->
    </div>
  </div>
  <refund-page v-else :subPageType="routeQuery"></refund-page>
</template>
<script>
import refundPage from './components/refundPage';

import refundTable from './components/refundTable';

import { mapState, mapActions } from 'vuex';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    refundPage,
    refundTable
  },
  data() {
    return {
      currentPage4: 4,
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
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value4: ''
    };
  },
  computed: {
    ...mapState({
      refundList: state => state.refund.refundList
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
  watch: {
    $route(to, from) {
      // console.log(to)
    }
  },
  methods: {
    ...mapActions(['getRefundList']),
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
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
    // handleEdit(index, row) {
    //   this.$router.push({ path: '/refund?particulars' });
    // }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.getRefundList();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(Object.keys(this.$route.query)[0]);
      this.getRefundList();
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
