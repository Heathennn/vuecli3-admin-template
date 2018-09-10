<template>
  <div class="personnelPage">
    <sub-title title="人员管理"></sub-title>
    <div class="sportOrderTop">
      <el-input v-model="userAccount" placeholder="搜索用户账号" style="width: 200px; margin-right: 20px"></el-input>
      <el-button type="primary" @click="fetchPersonnel" style="margin-right: 20px">搜索</el-button>
      <div style="margin-right: 10px;">角色</div>
      <el-select v-model="role" placeholder="请选择" style="margin-right: 20px;" v-loading="isFetchingRoles"
      element-loading-spinner="el-icon-loading">
        <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" v-permission="'932b9acc-fbda-4c88-93b4-ce263e389ee6'" @click="addPersonnel">新增</el-button>
    </div>
    <!-- 表格部分 -->
    <div style="width: 100%" v-loading="isFetchingPersonnel" v-permission="'9c9c9979-2500-469d-86af-b4ffad364cfc'">
      <el-table :data="personnelList" style="width: 100%">
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="username" label="账号">
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch v-permission="'e5c19f40-a544-4273-873a-a6f4319ab2b8'" v-if="$store.state.auth.userInformation.isAdmin == 1" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="switchChange(scope.row)" >
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button v-if="$store.state.auth.userInformation.isAdmin && $store.state.auth.userInformation.isAdmin == 1" v-permission="'9a45107e-22a2-4a5f-adf9-96f8a42b6c40'" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="paging" v-permission="'9c9c9979-2500-469d-86af-b4ffad364cfc'">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getPersonnelList, getRoles, updatePersonnel } from './personnel';

export default {
  components: {
    SubTitle
  },
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      curTotal: 0,
      userAccount: '',
      role: 'all',
      personnelList: [],
      roles: [],
      isFetchingRoles: false,
      isFetchingPersonnel: false,
    };
  },
  watch: {
    role() {
      this.fetchPersonnel();
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchPersonnel();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchPersonnel();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentSize = res.pageSize;
      this.curTotal = res.total;
    },
    // 修改状态
    switchChange(row) {
      // console.log(row)
      updatePersonnel({
        id: row.id,
        status: row.status
      }).then( (res) => {
        if(res.data.code == 200) {
          this.$notify.success('修改状态成功');
          this.fetchPersonnel();
        } else {
          this.$notify.error(res.data.message || '修改状态成功失败');
          this.fetchPersonnel();
        }
      }).catch( () => {
        this.$notify.error('修改状态成功失败')
        this.fetchPersonnel();
      })
    },
    addPersonnel() {
      this.$router.push({path: `/system/personnelConfig`})
    },  
    edit(row) {
      this.$router.push({path: `/system/personnelConfig?id=${row.id}`})
    },
    fetchRoles() {
      this.isFetchingRoles = true;
      getRoles({ page: 1, size: 1000}).then( (res) => {
        res.data.data.list.unshift({
          id: 'all',
          roleName: '全部'
        })
        this.roles = res.data.data.list;
        this.isFetchingRoles = false;
      }).catch( () => {
        this.isFetchingRoles = false;
      })
    },
    yieldParams() {
      let params = {};
      if(this.userAccount || this.role != 'all') {
        params.username = this.userAccount;
        params.page = 1;
      } else {
        params.page = this.currentPage;
      }
      if (this.role != 'all') {
        params.roleId = this.role;
      }
      params.size = this.currentSize;
      return params;
    },
    fetchPersonnel() {
      this.isFetchingPersonnel = true;
      getPersonnelList(this.yieldParams()).then( (res) => {
        this.personnelList = res.data.data.list;
        this.mapPagination(res.data.data);
        this.isFetchingPersonnel = false;
      }).catch( () => {
        this.isFetchingPersonnel = true;
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next( (vm) => {
      vm.fetchPersonnel();
      vm.fetchRoles();
    })
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchRoles();
      this.fetchPersonnel();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.sportOrderTop {
  width: 100%;
  padding: {
    top: 20px;
    bottom: 20px;
  }
  @include flexbox;
  @include align-items(center);
}

.personnelPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
</style>
