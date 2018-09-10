<template>
  <div class="historyBulletinPage">
    <div class="title">历史公告</div>
    <div class="storeInfo">
      <div class="info_item">门店: {{storeName}} </div>
      <div class="info_item">ID: {{storeId}}</div>
      <el-button type="primary" @click="jumpToAddBulletin">发布公告</el-button>
    </div>

    <el-table :data="datas" style="width: 100%">
      <el-table-column label="发布时间" prop="createTime">
      </el-table-column>
      <el-table-column label="公告标题" prop="topic">
      </el-table-column>
      <el-table-column label="公告内容" prop="topicContent">
      </el-table-column>
      <el-table-column label="发布人" prop="adminName">
      </el-table-column>
      <el-table-column label="显示时间" prop="time" width="300">
      </el-table-column>
      <el-table-column label="状态" prop="status">
      </el-table-column>
    </el-table>
    <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { getStoreBulletinList } from 'api/storePart/storeBulletin';

export default {
  name: 'historyBulletin',
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 0,
      storeName: '',
      storeId: '',
      bulletins: [],
    };
  },
  computed: {
    datas() {
      let list  = this.bulletins.concat();
      list.forEach( (item, index) => {
        item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.time = this.moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') + '至' + this.moment(item.endTime).format('YYYY-MM-DD HH:mm:ss');
        item.status = item.status == 1 ? '进行中' : item.status == 2 ? '未到期' : item.status == 3 ? '已过期' : item.status == 4 ? '已终止' : '';
      })
      return list;
    }
  },
  watch: {
    $route() {
      this.setStoreInfo();
    }
  },
  methods: {
    setStoreInfo() {
      this.storeName = this.$route.query.storeName;
      this.storeId = this.$route.query.storeId;
    },
    jumpToAddBulletin() {
      this.$router.push({path: '/storePart/addBulletin'})
    },
    fetchData() {
      this.isLoading = true;
      getStoreBulletinList(this.createParams())
        .then(res => {
          this.bulletins = res.data.data.list;
          this.mapPaganition(res.data.data);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    createParams() {
      let params = {};
      // if (this.storeName) {
        params.name = this.storeName;
      // }
      // if (this.storeId) {
         params.storeId = this.storeId;
      // }
      params.page = this.currentPage;
      params.size = this.currentSize;
      return params;
    },
    mapPaganition(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentSize = res.pageSize;
      this.curTotal = res.total;
    },
    handleSizeChange(size) {
      this.currentSize = size;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setStoreInfo();
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.historyBulletinPage {
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

.storeInfo {
  padding: {
    top: 20px;
  }
  @include flexbox;
  @include align-items(center);
  .info_item {
    margin: {
      right: 20px;
    }
  }
}
</style>
