<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="storePage">
      <div class="title">
        店长管理
      </div>
      <div class="selects">
        <div class="addManager">
          <el-button type="primary" @click="createManager" v-permission="'53c5f0a0-ca11-4d0f-9b82-49b29a21310c'">新建店长</el-button>
        </div>
      </div>
      <div class="tableBox" v-permission="'0ff407d-8e9a-45f6-9f04-27272d0222c4'">
        <manager-table :tableData="managerList"></manager-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <manager-sub-page v-else :subPageInfo="routeQuery" @fetchMangerList="fetchData"></manager-sub-page>
</template>

<script>
import ManagerTable from './components/ManagerTable';

import ManagerSubPage from './components/ManagerSubPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    ManagerTable,
    ManagerSubPage
  },
  data() {
    return {
      currentPage4: 1,
      curPageSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 10,
      value: '',
      input23: ''
    };
  },
  computed: {
    ...mapState({
      managerList: state => state.manager.managerList,
      total: state => state.manager.total,
      pageSize: state => state.manager.pageSize,
      pageNum: state => state.manager.pageNum
    }),
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
    ...mapActions(['getManagerTable']),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.getManagerTable({
        page: this.currentPage4,
        size: this.curPageSize
      }).then(() => {
        this.mapPagination();
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.getManagerTable({
        page: this.currentPage4,
        size: this.curPageSize
      }).then(() => {
        this.mapPagination();
      });
    },
    createManager() {
      this.$router.push({ path: '/storePart/manager?editManager=null' });
    },
    fetchData() {
      this.getManagerTable({
        page: this.currentPage4,
        size: this.curPageSize
      }).then(() => {
        this.mapPagination();
      });
    },
    mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      if (!this.pageSizes.includes(this.pageSize)) {
        this.pageSizes.unshift(this.pageSize);
      }
      this.curPageSize = this.pageSize;
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.getManagerTable({
          page: 1,
          size: 10
        })
          .then(() => {
            // console.log(111);
            this.mapPagination();
          })
          .catch(err => {
            // console.log(err);
          });
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.getManagerTable({
        page: 1,
        size: 10
      })
        .then(() => {
          // console.log(111);
          this.mapPagination();
        })
        .catch(err => {
          // console.log(err);
        });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.storePage {
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
    padding: {
      top: 20px;
    }
  }
  .tableBox {
    width: 100%;
  }
}
</style>
