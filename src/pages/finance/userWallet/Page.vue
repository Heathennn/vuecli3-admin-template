<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="wraper">
      <div class="title">
        用户钱包
      </div>
      <!-- 搜索框 -->
      <!-- <div class="Input">
        <el-input placeholder="请输入用户昵称" prefix-icon="el-icon-search" v-model="input21">
        </el-input>
      </div> -->
      <div class="table" v-loading="isFetchingUserWalletData" v-permission="'a38f380b-9510-408f-b2e0-0c18ee70d430'">
        <wallet-tab :tableData="userWalletList"></wallet-tab>
        <div class="paging">
          <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 分页 -->
    </div>
  </div>
  <wallet-page v-else :subPageInfo="routeQuery"></wallet-page>
</template>

<script>
import walletTab from './conpoments/walletTab';

import walletPage from './conpoments/walletPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    walletTab,
    walletPage
  },
  methods: {
    ...mapActions(['getUserWalletList']),
    handleClick(tab, event) {
      //console.log(tab, event);
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
    createParams() {
      let params = {};
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchData() {
      this.getUserWalletList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  computed: {
    ...mapState({
      userWalletList: state => state.userWallet.userWalletList,
      walletRechargeList: state => state.userWallet.walletRechargeList, //充值
      pageSize: state => state.userWallet.pageSize,
      pageNum: state => state.userWallet.pageNum,
      total: state => state.userWallet.total,
      isFetchingUserWalletData: state => state.userWallet.isFetchingUserWalletData
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
  data() {
    return {
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      input21: '',
      activeName2: 'second'
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
  .Input {
    width: 30%;
    margin: 20px;
  }
  .table {
    margin: 20px 0;
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>
