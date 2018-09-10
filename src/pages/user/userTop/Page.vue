<template>
  <div class="protalPage">
    <div class="userTopPage">
      <div class="title">
        运动排行榜
      </div>
      <div class="selector" style="padding-top: 30px;">
        <span>门店</span>
        <el-select v-model="store" placeholder="请选择">
          <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
          </el-option>
        </el-select>

        <el-input v-model="userName" placeholder="搜索用户昵称" style="width: 180px"></el-input>
        <el-input v-model="userId" placeholder="搜索用户ID" style="width: 180px"></el-input>
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </div>
      <div class="userTop" v-permission="'aaf5510a-7394-4071-9b82-8ad85ecd04af'">
        <el-table :data="datas" style="width: 100%" v-loading="isLoading">
          <el-table-column label="排名" prop="sortNum" width="100">
          </el-table-column>
          <el-table-column label="用户ID" prop="userId" width="100">
          </el-table-column>
          <el-table-column label="用户" prop="username" width="120">
            <template slot-scope="scope">
              <a href="javascript:;" @click="jumpToUserDetail(scope.row.userId)">{{scope.row.username}}</a>
            </template>
          </el-table-column>
          <el-table-column label="门店" prop="storeName">
          </el-table-column>
          <el-table-column label="运动总时长" prop="sportLength">
            <template slot-scope="scope">
              <span>{{scope.row.sportLength + '分钟'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="被点赞总数">
             <template slot-scope="scope">
              <span>{{scope.row.favorNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
             <template slot-scope="scope">
              <el-button @click="checkout(scope.row)" v-permission="'6ed99d9e-d1d9-4c95-b9bc-67e61acff7ca'">查看被点赞详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- follower list -->
      <el-dialog title="被点赞记录" center :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
        <div class="followerHeader">
          <div class="rank"><div style="text-align: center; font-size: 30px">{{currentItem.sortNum}}</div><div>排名</div></div>
          <div class="username" style="text-align: center; font-size: 30px">{{currentItem.username}}</div>
          <div class="sportLength"><div style="text-align: center; font-size: 30px">{{currentItem.sportLength}}</div><div style="text-align: center;" >运动分钟</div></div>
        </div>
        <el-table :data="followers" style="width: 100%">
          <el-table-column label="序号" prop="number" >
          </el-table-column>
          <el-table-column label="日期" prop="createTime">
          </el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <a href="javascript:;" @click="jumpToUserDetail(scope.row.userId)">{{scope.row.userName}}</a>
            </template>
          </el-table-column>
          <el-table-column label="为ta点赞">
             <template slot-scope="scope">
               第{{scope.row.sortNum}}个
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize2" layout="total, sizes, prev, pager, next, jumper" :total="curTotal2">
          </el-pagination>
      </el-dialog>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>

    </div>
  </div>
</template>

<script>
  import { getFollowerUsers } from "api/user/userTop";

  import { mapState, mapActions } from "vuex";

  import { deepCopy } from "common/utils";

  export default {
    data() {
      return {
        userName: "",
        userId: "",
        store: "all",
        dialogVisible: false,
        isLoading: false,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        curPageSize: 10,
        curTotal: 0,
        currentSize2: 10,
        currentPage2: 1,
        curTotal2: 0,
        userTopList: [],
        followers: [],
        currentItem: {}
      };
    },
    computed: {
      ...mapState({
        dropdownStoreList: state => state.userTop.dropdownStoreList
      }),
      storeList() {
        let list = deepCopy(this.dropdownStoreList);
        list.unshift({
          storeName: "全部门店",
          id: "all"
        });
        return list;
      },
      datas() {
        if (!this.userTopList) return [];
        let list = deepCopy(this.userTopList);
        list.forEach((item, index) => {
          item.username = item.userInfo.nickname;
          item.sportLength = (item.sportLength / 60).toFixed(2);
          item.favorNum = item.favorNum + "次";
        });
        return list;
      }
    },
    watch: {
      store(val) {
        this.fetchData();
      }
    },
    methods: {
      ...mapActions(["getUserTopList", "getDropDownStoreList"]),
      checkout(row) {
        this.currentItem = row;
        // console.log(row)
        this.dialogVisible = true;
        this.currentPage2 = 1;
        this.currentSize2 = 10;
        this.getFollowers(row);
      },
      getFollowers(row) {
        getFollowerUsers({
          page: this.currentPage2,
          size: this.currentSize2,
          byUserId: row.userId
        }).then(res => {
          res.data.data.list.forEach((item, index) => {
            item.createTime = this.moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.followers = res.data.data.list;
          this.mapPagination2(res.data.data);
        });
      },
      handleClose(done) {
        done();
      },
      jumpToUserDetail(id) {
        this.$router.push({ path: `/user/userList?userDetail=${id}` });
      },
      createParams() {
        let params = {};
        if (this.store !== "all") params.storeId = this.store;
        if (this.userName) params.userName = this.userName;
        if (this.userId) params.userId = this.userId;
        if (this.userName || this.userId) {
          params.page = 1;
        } else {
          params.page = this.currentPage;
        }
        params.size = this.curPageSize;
        return params;
      },
      mapPagination2(data) {
        this.currentPage = data.pageNum < 1 ? 1 : data.pageNum;
        this.currentSize2 = data.pageSize;
        this.curTotal2 = data.total;
      },
      mapPagination(data) {
        this.currentPage2 = data.pageNum < 1 ? 1 : data.pageNum;
        this.curPageSize = data.pageSize;
        this.curTotal = data.total;
      },
      fetchData() {
        this.isLoading = true;
        this.getUserTopList(this.createParams())
          .then(res => {
            this.isLoading = false;
            this.userTopList = res.list;
            this.mapPagination(res);
          })
          .catch(() => {
            this.isLoading = false;
          });
      },
      handleSizeChange(val) {
        this.curPageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchData();
      },
      handleCurrentChange2(val) {
        this.currentPage2 = val;
        this.getFollowers(this.currentItem);
      },
      handleSizeChange2(val) {
        this.currentSize2 = val;
        this.getFollowers(this.currentItem);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          vm.fetchData();
        });
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.getDropDownStoreList({ page: 1, size: 100 });
        this.fetchData();
      });
    }
  };
</script>

<style lang="scss" scoped>
@import "~assets/style/utils";

.userTopPage {
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

.followerHeader {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  @include flexbox;
  @include align-items(center);
  background-color: #e5e5e5;
  .username {
    flex: 1;
    text-align: center;
  }
}
</style>
