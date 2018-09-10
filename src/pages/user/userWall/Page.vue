<template>
  <div class="userWallPage">
    <sub-title title="用户上墙"></sub-title>
    <div class="selectors" style="margin-top: 20px">
      <div style="width: 50px">状态</div>
      <el-select v-model="status" placeholder="请选择">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-input placeholder="搜索用户昵称" v-model="nickname" style="width: 220px;margin-left: 20px;"></el-input>
      <el-input placeholder="搜索用户手机号" v-model="userMobile" style="width: 220px;margin-left: 10px;margin-right: 20px"></el-input>

      <el-button type="primary" @click="fetchUserWallList">搜索</el-button>
    </div>

    <div class="userWallTable" v-loading="isLoadingData" v-permission="'aa7b69b4-7280-4a06-b07d-3c3b95a54cc9'">
      <el-table :data="userWallList" style="width: 100%">
        <el-table-column label="时间" prop="createTime" width="100">
        </el-table-column>
        <el-table-column label="用户" prop="nickname" width="120">
          <template slot-scope="scope">
            <a href="javascript:;" @click="jumpToUserDetail(scope.row.userId)">{{scope.row.nickname}}</a>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile">
        </el-table-column>
        <el-table-column label="上墙门店" prop="storeName">
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <!-- <drop-down-image :source="scope.row.picUrl"></drop-down-image> -->
            <img :src="scope.row.picUrl" alt="" style="max-width: 100px">
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="uploadDesc">
        </el-table-column>
        <el-table-column label="状态" prop="canPush">
          <template slot-scope="scope">
            {{scope.row.canPush == 1 ? '正常' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="editUserWall(scope.row)" v-permission="'c3617cda-c19a-46f9-8b43-3cb9bb243aa4'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="操作" center :visible.sync="dialogVisible" width="50%">
        <div style="margin-bottom: 15px;"><span style="display:inline-block;width:80px;">上墙时间</span>{{editingUserInfo.createTime}}</div>
        <div style="margin-bottom: 15px;"><span style="display:inline-block;width:80px;">上墙用户</span>{{editingUserInfo.nickname}}</div>
        <div style="margin-bottom: 15px;"><span style="display:inline-block;width:80px;">手机号码</span>{{editingUserInfo.mobile}}</div>
        <div>上墙内容: 如下</div>
        <div class="dialog_userDesc" style="border: 1px solid #e5e5e5;margin-bottom: 15px">
          <div class="dialog_dropDownImage">
            <drop-down-image :source="editingUserInfo.picUrl" v-if="editingUserInfo.picUrl" :imageStyle="{width: '100px', height: '100px'}"></drop-down-image>
          </div>
          <div style="padding-left: 20px">{{editingUserInfo.uploadDesc}}</div>
        </div>
        <div style="margin-bottom: 15px;">上墙时间:{{editingUserInfo.createTime}}</div>
        <div  style="margin-bottom: 10px;">
          <el-radio-group v-model="editingUserInfo.canPush">
            <el-radio :label="'1'">正常</el-radio>
            <el-radio :label="'2'">禁用</el-radio>
          </el-radio-group>
        </div>
        <el-input placeholder="请输入理由" v-model="dialog_reseaon"></el-input>
        <div slot="footer">
          <el-button type="primary" plain @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpdate">确认</el-button>
        </div>
      </el-dialog>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getUserWallList,
  getUserWallDetail,
  updateUserWallDetail
} from 'api/user/userWall';

import DropDownImage from 'components/DropDownImage';

import SubTitle from 'components/SubTitle';

export default {
  data() {
    return {
      isLoadingData: false,
      dialogVisible: false,
      dialog_reseaon: '',
      confirm_reseaon: '',
      currentPage: 1,
      curPageSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 0,
      userWallList: [],
      status: 'all',
      nickname: '',
      userMobile: '',
      editingUserInfo: {},
      statusOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '禁用'
        }
      ]
    };
  },
  components: {
    DropDownImage,
    SubTitle
  },
  computed: {
    // 是否精确搜索
    isExact() {
      return this.nickname || this.userMobile;
    },
    exactSearchKey() {
      let params = {};
      if (this.nickname) {
        params.nickname = this.nickname;
      }
      if (this.userMobile) {
        params.mobile = this.userMobile;
      }

      params.page = 1;
      params.size = this.curPageSize;
      return params;
    },
    searchKey() {
      if (this.isExact) {
        return this.exactSearchKey;
      } else {
        let params = {};
        if (this.status !== 'all') {
          params.canPush = this.status;
        }
        params.page = this.currentPage;
        params.size = this.curPageSize;
        return params;
      }
    }
  },
  
  methods: {
    jumpToUserDetail() {

    },
    editUserWall(row) {
      this.editingUserInfo = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    confirmUpdate() {
      if (!this.dialog_reseaon) {
        return this.$notify.warning('请输入理由');
      }
      this.dialogVisible = false;
      this.confirm_reseaon = this.dialog_reseaon;
      updateUserWallDetail({
        id: this.editingUserInfo.id,
        manageReviewResult: this.editingUserInfo.canPush,
        manageReviewId: this.$store.state.auth.userInformation.id,
        manageReviewDesc: this.confirm_reseaon
      }).then( (res) => {
        if ( res.data.code == 200) {
          this.$notify.success('修改审核成功');
          this.fetchUserWallList();
          return;
        } else {
          this.$notify.error('修改审核失败');
        }
      }).catch( () => {
        this.$notify.error('修改审核失败');
      })
    },
    handleSizeChange(size) {
      this.curPageSize = size;
      this.fetchUserWallList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchUserWallList();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curPageSize = res.pageSize;
      this.curTotal = res.total;
    },
    fetchUserWallList() {
      this.isLoadingData = true;
      // console.log(this.searchKey)
      getUserWallList(this.searchKey).then(res => {
        res.data.data.list.forEach((item, index) => {
          item.createTime = this.moment(item.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          );
        });
        this.userWallList = res.data.data.list;
        this.mapPagination(res.data.data);
        this.isLoadingData = false;
      }).catch( () => {
        this.isLoadingData = false;
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchUserWallList();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchUserWallList();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userWallPage {
  box-sizing: border-box;
  padding: 20px;
}
.userWallTable {
  padding: {
    top: 20px;
  }
}
.selectors {
  width: 100%;
  @include flexbox;
  @include align-items(center);
}
.dialog_userDesc {
  box-sizing: border-box;
  padding: 10px;
  @include flexbox;
  // @include
}

.dialog_dropDownImage {
  width: 60%;
  border: {
    right: 1px solid #e5e5e5;
  }
  padding: {
    right: 20px;
  }
}
</style>
