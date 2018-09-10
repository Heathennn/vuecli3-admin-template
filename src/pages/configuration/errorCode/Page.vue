<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">异常代码管理</div>
      <div class="Btn">
        <el-button type="primary" @click="exceptionSync" v-permission="'742f2779-af2f-4e92-b748-da5f1255076e'">一键同步</el-button>
      </div>
      <div>
        <el-tabs v-model="activeType" @tab-click="handleClick">
          <el-tab-pane label="已分类异常" name="2" v-loading="isFetchingErrorCodeData" v-permission="'7f9d169b-a028-4886-bb21-e7b2c4bd0fd9'">
            <classify-tab :tableData="errorCodeList"
                          @refreshData="fetchData" v-permission="'88315bda-a9d4-4b22-9bb9-7ba7a26d46c2'"></classify-tab>
          </el-tab-pane>
          <el-tab-pane label="待分类异常" name="1" v-loading="isFetchingErrorCodeData" v-permission="'cedde8db-6e4b-4bd0-a030-0108849c1717'">
            <not-class-tab :tableData="unclassifiedErrorCodeList" v-permission="'2a72a1d8-9505-4da7-876d-fda7c87f99da'"></not-class-tab>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="paging" v-if="activeType == 2">
        <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import classifyTab from './components/classifyTab';

import notClassTab from './components/notClassifyTab';

import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      errorCodeList: state => state.errorCode.errorCodeList,
      unclassifiedErrorCodeList: state => state.errorCode.unclassifiedErrorCodeList,
      pageSize: state => state.errorCode.pageSize,
      pageNum: state => state.errorCode.pageNum,
      total: state => state.errorCode.total,
      isFetchingErrorCodeData: state => state.errorCode.isFetchingErrorCodeData, 
    })
  },
  components: {
    classifyTab,
    notClassTab
  },
  data() {
    return {
      activeType: '2',
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      currentPage: 1,
      curTotal: 0,
      classifySign: 2, //2 已分类  1 未分类
    };
  },
  watch: {
    activeType(val) {
      this.fetchData();
    }
  },
  methods: {
    ...mapActions(['getErrorCodeList', 'getExceptionSync']),
    exceptionSync() {
      this.getExceptionSync().then( () => {
        this.fetchData();
        this.$notify.success('一键同步成功');
      }).catch( () => {
        this.$notify.error('一键同步失败');
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
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
      // console.log(this.total);
      this.currentPage = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    computeParams() {
      let params = {};
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      // console.log(params);
      return params;
    },
    createParams() {
      let params = {};
      params.classifySign = this.activeType;
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getErrorCodeList(this.createParams()).then( () => {
        this.mapPagination();
      }) 
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
  .Btn {
    margin: 20px 0;
  }
}
</style>
