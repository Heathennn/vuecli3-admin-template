<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">信用分体系</div>
      <div class="sportOrderTop">
        <!-- 排序选择框 -->
        <div>
          排序：
          <el-select v-model="curSortRule" placeholder="请选择">
            <el-option v-for="item in sortRule" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 表格 -->
        <div class="creditTable" v-loading="isFetchingCreditList" v-permission="'9e62a51f-233e-4e7d-ab54-40852af4d1fe'">
          <credit-tab :tableData="creditList"
                      @refreshData="fetchData"></credit-tab>
        </div>
      </div>
      <div class="paging" v-permission="'9e62a51f-233e-4e7d-ab54-40852af4d1fe'">
        <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import creditTab from './components/creditTab';

import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      curSortRule: 'all',
      orderField: 'plus_or_minus', // 排序规则 : 按加分减分 必传
      sortRule: [
        {
          value: 'all',
          label: '默认'
        },
        {
          value: 'asc', // 正序
          label: '加分-减分'
        },
        {
          value: 'desc', // 倒序
          label: '减分-加分'
        }
      ],
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0
    };
  },
  computed: {
    ...mapState({
      creditList: state => state.credit.creditList,
      creditInfoList: state => state.credit.creditInfoList, //编辑
      pageSize: state => state.credit.pageSize,
      pageNum: state => state.credit.pageNum,
      total: state => state.credit.total,
      isFetchingCreditList: state => state.credit.isFetchingCreditList
    })
  },
  methods: {
    ...mapActions(['getCreditList', 'getCreditInfoList']),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    mapPagination() {
      this.currentPage = this.pageNum;
      // console.log(this.total);
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    createParams() {
      let params = {};
      if (this.curSortRule === 'all') {
        // 默认正序
        params.orderWay = 'asc';
      } else {
        params.orderWay = this.curSortRule;
      }
      params.orderField = this.orderField; // 排序规则
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getCreditList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  components: {
    creditTab
  },
  watch: {
    curSortRule() {
      this.fetchData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
    });
  }
};
</script>
<style lang="scss" scoped>
.wraper {
  overflow-y: scroll;
  background: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    width: 100%;
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .sportOrderTop {
    margin: 20px 0;
  }
}

.creditTable {
  width: 100%;
}
</style>
