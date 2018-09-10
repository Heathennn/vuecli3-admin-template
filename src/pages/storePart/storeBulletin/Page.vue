<template>
  <div class="protalPage">
    <div class="storeBulletinPage">
      <div class="title">
        门店公告
      </div>

      <div class="selecters">
        <div class="searchBar"> 
          <el-input placeholder="门店名称" v-model="storeName"></el-input>
        </div>
        <div class="searchBar">
          <el-input placeholder="门店ID" v-model="storeId"></el-input>
        </div>
        <el-button type="primary" @click="fetchData">搜索</el-button>

        <el-button type="primary" @click="addBulletin" v-permission="'0f72e95d-382e-4577-8afb-d375275a7d79'">发布公告</el-button>
      </div>

      <div class="tableBox" v-loading="isLoading" v-permission="'ed1388d5-174a-4b93-8c94-c7fba874dfaf'">
        <store-bulletin-table :tableData="bulletins"></store-bulletin-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoreBulletinTable from './components/StoreBulletinTable';

import { getStoreBulletinList } from 'api/storePart/storeBulletin';

export default {
  data() {
    return {
      currentPage:  1,
      currentSize: 10,
      curTotal: 0,
      isLoading: false,
      storeName: '',
      storeId: '',
      bulletins: []
    }
  },
  components: {
    StoreBulletinTable
  },
  methods: {
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    mapPagination(res) {
      this.currentSize = res.pageSize;
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal = res.total;
    },
    fetchData() {
      if (this.storeId.trim()) {
        if (Number.isNaN(Number(this.storeId))) {
          this.$notify.error('请输入正常的门店id')
          return;
        }
      }
      this.isLoading = true;
      getStoreBulletinList(this.createParams()).then( (res) => {
        this.bulletins = res.data.data.list;
        this.mapPagination(res.data.data);
        this.isLoading = false;
      }).catch( () => {
        this.isLoading = false;
      })
    },
    createParams() {
      let params = {};
      if (this.storeName) {
        params.name = this.storeName;
      }
      if (this.storeId.trim()) {
         params.storeId = this.storeId.trim();
      }
      params.isLatest = 1;
      params.page = this.currentPage;
      params.size = this.currentSize;
      return params;
    },
    addBulletin() {
      this.$router.push({path: '/storePart/addBulletin'})
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchData();
    })
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.storeBulletinPage {
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
}

.selecters {
  @include flexbox;
  box-sizing: border-box;
  padding: {
    top: 20px;
  }
  .searchBar {
    width: 200px;
    margin: {
      right: 10px;
    }
  }
}

.tableBox {
  width: 100%;
  box-sizing: border-box;
  padding: {
    top: 20px;
  }

}
</style>
