<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="appVersionPage">
      <div class="title">
        APP版本配置
      </div>

      <div class="selector" v-permission="'47132837-f28b-406d-9a4d-0c1b8b90c8e1'">
        <el-radio-group v-model="activeSide">
          <el-radio-button label="用户端"></el-radio-button>
          <el-radio-button label="店长端"></el-radio-button>
        </el-radio-group>
        <el-button @click="addVersionConfig" v-permission="'e9341fd0-492c-4f07-9499-400de8671ffc'">新增</el-button>
      </div>
      <el-table :data="datas" style="width: 100%" v-loading="isLoading"  v-permission="'47132837-f28b-406d-9a4d-0c1b8b90c8e1'">
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <div>{{scope.row.createTime.split(' ')[0]}}</div>
            <div>{{scope.row.createTime.split(' ')[1]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="发布时间">
          <template slot-scope="scope">
            <div>{{scope.row.updateTime.split(' ')[0]}}</div>
            <div>{{scope.row.updateTime.split(' ')[1]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="side" label="客户端" width="80"> </el-table-column>
        <el-table-column prop="appType" label="平台"></el-table-column>
        <el-table-column prop="versionCode" label="版本号" width="80"></el-table-column>
        <el-table-column prop="isForce" label="更新类型" width="120"></el-table-column>
        <el-table-column prop="apkUrl" label="链接地址">
          <template slot-scope="scope">
            <a :href="scope.row.apkUrl" target="_blank">{{scope.row.apkUrl}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="更新说明">
          <template slot-scope="scope">
            <!-- scope.row.upgradePoint -->
            <el-input type="textarea" :autosize="{ minRows: 4}" :value="scope.row.upgradePoint" resize="none" disabled/>
          </template>
        </el-table-column>
        <el-table-column prop="appRelease" label="状态" width="80"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.appRelease !== '已发布'" class="table_button">
              <el-button @click="showDialog('发布', scope.row)" type="success" plain v-permission="'4190f81a-cd2e-4024-8b93-009f4fb380c4'">发布</el-button><el-button @click="editVersion(scope.row)" type="primary" plain v-permission="'1032b656-0fba-4048-b743-68af4dfdeab1'">编辑</el-button><el-button @click="showDialog('删除', scope.row)" type="danger" plain v-permission="'3bd3e29d-c51d-4980-832e-4826cc447a86'">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>


      <div class="paginationBox" v-permission="'47132837-f28b-406d-9a4d-0c1b8b90c8e1'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" center :before-close="handleClose">
        <div class="subTitle" style="text-align: center">确认要{{dialogTitle}}吗?</div>
        <div class="dialogContent" style="text-align: center">{{dialogContent}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
  <version-sub-page v-else :subPageInfo="routeQuery"></version-sub-page>
</template>

<script>
import VersionSubPage from './components/VersionSubPage';

import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      curPageSize: 10,
      pageSizes: [10, 20 ,30, 40],
      curTotal: 0,
      currentPage: 0,
      activeSide: '用户端',
      userSide: [],
      managerSide: [],
      isLoading: false,
      editingItem: {},
      dialogTitle: '',
      dialogContent: '',
      dialogVisible: false
    };
  },
  components: {
    VersionSubPage
  },
  beforeRouteEnter(to, from, next) {
      next( vm => {
        vm.$nextTick( () => {
          vm.fetchUserSideData();
          vm.fetchManagerSideData();
        });
      })
    },
  computed: {
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
    },
    datas() {
      if ( this.activeSide === '用户端') {
        return this.userSide;
      } else {
        return this.managerSide;
      }
    }
  },
  // beforeRouteEnter(to, from, next) {
  //    next( vm => {
  //      vm.$nextTick( () => {
  //        vm.refreshData();
  //      });
  //    })
  //  },
 watch: {
    $route(val) {
      this.refreshData();
    },
    activeSide(val) {
      if (val === '用户端') {
        this.fetchUserSideData();
      } else {
        this.fetchManagerSideData();
      }
    }
 },
  methods: {
    // appKind 1 用户端 2 店长端
    ...mapActions(['getAppVersionList', 'updateAppVersion']),
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeSide === '用户端') {
        this.fetchUserSideData(val,this.curPageSize);
      } else {
        this.fetchManagerSideData();
      }
    },
    handleSizeChange(val) {
      this.curPageSize = val;
      if (this.activeSide === '用户端') {
        this.fetchUserSideData(this.currentPage,val);
      } else {
        this.fetchManagerSideData();
      }
    },
    handleClose(done) {
      this.editingItem = {};
      this.dialogTitle = '';
      this.dialogContent = '';
      done();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal = res.total;
      this.curPageSize = res.pageSize;
    },
    showDialog(operation, row) {
      this.dialogTitle = operation;
      this.editingItem = row;
      if (operation === '发布') {
        this.dialogContent = '一经确认发布后会立即生效到APP端，且不可取消';
      } else {
        this.dialogContent = '一经确认删除后此条信息会清空，且不可恢复';
      }
      this.dialogVisible = true;
    },
    editVersion(row) {
      this.$router.push({ path: `/system/appVersion?version=${row.id}` });
    },
    addVersionConfig() {
      this.$router.push({ path: '/system/appVersion?version=' });
    },
    removeAppVersion() {
      this.updateAppVersion({
        id: this.editingItem.id,
        status: 2
      }).then( () => {
        this.$notify.success('删除成功');
        this.refreshData();
      }).catch( () => {
        this.$notify.error('删除失败');
      })
    },
    publishAppVersion() {
      this.updateAppVersion({
        id: this.editingItem.id,
        appRelease: 1
      }).then( () => {
        this.$notify.success('发布成功');
        this.refreshData();
      }).catch( () => {
        this.$notify.error('发布失败');
      })
    },
    update() {
      if (this.dialogTitle === '发布') {
        this.publishAppVersion();
      } else {
        this.removeAppVersion();
      }
      this.dialogVisible = false;
    },
    refreshData() {
      this.fetchUserSideData();
      this.fetchManagerSideData();
    },
    mapUserSide(list) {
      let target = [];
      list.forEach( (item, index) => {
        let obj = {};
        obj.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        obj.updateTime = item.releaseTime ? this.moment(item.releaseTime).format('YYYY-MM-DD HH:mm:ss'): ''
        obj.side = '用户端';
        obj.id = item.id;
        obj.versionCode = item.versionCode;
        obj.upgradePoint = item.upgradePoint.replace(/\\n\\r/g,"\n\r");
        // console.log(obj.upgradePoint);
        obj.appType = item.appType == 1 ? 'ios' : item.appType == 2 ? 'android' : '';
        obj.apkUrl = item.apkUrl;
        obj.isForce = item.isForce == 1 ? '强制更新' : item.isForce == 2 ? '提示更新' : '';
        obj.appRelease = item.appRelease == 1  ? '已发布' : item.appRelease == 2  ? '未发布' : '';
        target.push(obj);
      })
      return target;
    },
    mapManagerSide(list) {
      let target = [];
      list.forEach( (item, index) => {
        let obj = {};
        obj.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        obj.updateTime = item.releaseTime ? this.moment(item.releaseTime).format('YYYY-MM-DD HH:mm:ss'): ''
        obj.side = '店长端';
        obj.id = item.id;
        obj.versionCode = item.versionCode;
        obj.upgradePoint = item.upgradePoint.replace(/\\n\\r/g,"\n\r");
        obj.appType = item.appType == 3 ? 'ios' : item.appType == 4 ? 'android' : '';
        obj.apkUrl = item.apkUrl;
        obj.isForce = item.isForce == 1 ? '强制更新' : item.isForce == 2 ? '提示更新' : '';
        obj.appRelease = item.appRelease == 1  ? '已发布' : item.appRelease == 2  ? '未发布' : '';
        target.push(obj);
      })
      return target;
    },
    fetchUserSideData(page=1,size=10) {
      this.isLoading = true;
      this.getAppVersionList({
        appKind: 1,
        page: page,
        size: size
      }).then( (res) => {
        this.isLoading = false;
        this.userSide = this.mapUserSide(res.list);
        if (this.activeSide==='用户端') {
          this.mapPagination(res);
        }
      }).catch( () => {
        this.isLoading = false;
      })
    },
    fetchManagerSideData(page=1,size=10) {
      this.isLoading = true;
      this.getAppVersionList({
        appKind: 2,
        page: page,
        size: size
      }).then( (res) => {
        this.isLoading = false;
        this.managerSide = this.mapManagerSide(res.list);
          if (this.activeSide==='店长端') {
            this.mapPagination(res);
          }
      }).catch( () => {
        this.isLoading = false;
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchUserSideData();
      this.fetchManagerSideData()
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.appVersionPage {
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
.selector {
  padding: {
    top: 20px;
    bottom: 20px;
  }
}

.table_button {
  @include flexbox;
  @include flex-direction(column);
  @include justify-content(center);
  @include align-items(center);
  .el-button {
    margin:0
  }
}
</style>
