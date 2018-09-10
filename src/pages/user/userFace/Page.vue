<template>
  <div class="userFacePage">
    <div class="title">
      用户人脸采集
    </div>

    <div class="selectors">
      <div class="facesign">
        <div class="subTitle">用户人脸</div>
        <el-select v-model="faceSign" placeholder="请选择">
          <el-option v-for="item in faceSignOptions" :key="item.id" :label="item.label" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <el-input placeholder="搜索用户昵称" style="width: 200px; margin-right: 10px" v-model="nickname"></el-input>
      <el-input placeholder="搜索用户手机号" style="width: 200px; margin-right: 10px" v-model="usermobile"></el-input>
      <el-input placeholder="搜索用户ID" style="width: 200px; margin-right: 10px" v-model="userId"></el-input>

      <el-button type="primary" @click="fetchData">搜索</el-button>
    </div>

    <el-dialog title="图片" center :visible.sync="dialogVisible" width="60%">
      <img :src="curImg" alt="">
    </el-dialog>

    <el-table :data="datas" style="width: 100%" v-loading="isFetchingFaceList" v-permission="'e1806150-a740-4f6e-8531-8082a17cfdd8'">
      <el-table-column label="采集时间" prop="createTime" width="100">
      </el-table-column>
      <el-table-column label="用户ID" prop="userId">
      </el-table-column>
      <el-table-column label="用户昵称" prop="nickname">
      </el-table-column>
      <el-table-column label="手机号" prop="mobile">
      </el-table-column>
      <el-table-column label="用户人脸图片" prop="faceImg">
        <template slot-scope="scope">
          <!-- <drop-down-image :source="scope.row.faceImg" v-if="scope.row.faceImg"></drop-down-image> -->
          <img v-if="scope.row.faceImg" :src="scope.row.faceImg" alt="" style="max-width: 100px" @click="showImg(scope.row.faceImg)">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="remove" @click="remove(scope.row)" v-permission="'e561930b-ce8f-4a8b-88c8-ae62d1ec0b43'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal" v-permission="'e1806150-a740-4f6e-8531-8082a17cfdd8'">
    </el-pagination>
  </div>
</template>

<script>
import { getUserFaceList, removeUserFace } from 'api/user/userFace';

import DropDownImage from 'components/DropDownImage';

export default {
  data() {
    return {
      curImg: '',
      dialogVisible: false,
      currentPage: 1,
      currentSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 0,
      faceSign: 3,
      nickname: '',
      userId: '',
      usermobile: '',
      faceSignOptions: [
        {
          id: 3,
          label: '全部'
        },
        {
          id: 1,
          label: '已采集'
        },
        {
          id: 2,
          label: '未采集'
        }
      ],
      datas: [],
      isFetchingFaceList: false
    };
  },
  components: {
    DropDownImage
  },
  watch: {
    faceSign() {
      this.fetchData();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchData();
      });
    });
  },
  computed: {
    isExactSearch() {
      return this.userId || this.usermobile || this.nickname;
    }
  },
  methods: {
    showImg(img) {
      this.curImg = img ? img : '';
      this.dialogVisible = true;
    },
    remove(row) {
      if (confirm('确认删除吗?')) {
        removeUserFace({ userId: row.userId })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('删除人脸成功');
              this.fetchData();
              return;
            } else {
              this.$notify.error('删除人脸失败');
            }
          })
          .catch(() => {
            this.$notify.error('删除人脸失败');
          });
      }
    },
    createParams() {
      let params = {};
      if (this.isExactSearch) {
        // 精确搜索
        if (this.nickname) {
          params.nickname = this.nickname;
        }
        if (this.usermobile) {
          params.mobile = this.usermobile;
        }
        if (this.userId) {
          params.userId = this.userId;
        }
        params.page = 1;
        params.size = 10;
      } else {
        // 列表筛选
        params.page = this.currentPage;
        params.size = this.currentSize;
        params.faceSign = this.faceSign;
      }
      return params;
    },
    fetchData() {
      this.isFetchingFaceList = true;
      getUserFaceList(this.createParams())
        .then(res => {
          res.data.data.list.forEach((item, index) => {
            item.createTime = this.moment(item.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          });
          this.datas = res.data.data.list;
          this.mapPagination(res.data.data);
          this.isFetchingFaceList = false;
        })
        .catch(() => {
          this.isFetchingFaceList = false;
        });
    },
    mapPagination(data) {
      this.currentPage = data.pageNum < 1 ? 1 : data.pageNum;
      this.curPageSize = data.pageSize;
      this.curTotal = data.total;
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
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.userFacePage {
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

.selectors {
  padding: {
    top: 20px;
  }
  @include flexbox;
  @include align-items(center);
  .facesign {
    margin: {
      right: 20px;
    }
    @include flexbox;
    @include align-items(center);
    .subTitle {
      width: 80px;
    }
  }
}
</style>
