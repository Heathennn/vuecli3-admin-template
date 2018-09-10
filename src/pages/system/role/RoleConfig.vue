<template>
  <div class="permissionConfigPage">
    <sub-title title="角色配置"></sub-title>

    <div class="config_role_name">
      <div>
        <span>角色名</span>
        <el-input v-model="role_name" style="width: 300px;"></el-input>

        <el-button @click="_addRole" type="primary" v-if="isCreate" v-loading="isSetting" element-loading-spinner="el-icon-loading">新增角色</el-button>
        <el-button @click="changePermission" type="primary" v-else v-loading="isSetting" element-loading-spinner="el-icon-loading">修改配置</el-button>
      </div>
    </div>

    <div class="permission_tree" element-loading-text="正在生成权限树" element-loading-spinner="el-icon-loading" v-loading="isFetchingPermission">
      <el-tree ref="tree" :data="list" show-checkbox :check-strictly="true" node-key="id" :props="defaultProps" accordion :render-after-expand="false" @node-click="handleClick">
      </el-tree>
    </div>
  </div>
</template>

<script>
import { config } from './config';

import SubTitle from 'components/SubTitle';

import {
  getPermissionList,
  updateRole,
  addRole,
  getAllPermission
} from './role';

export default {
  name: 'roleConfig',
  data() {
    return {
      role_name: '',
      list: [],
      permissionIds: [],
      strictly: false,
      isSetting: false,
      isFetchingPermission: false,
      defaultProps: {
        children: 'menuList',
        label: 'menuName'
      }
    };
  },
  components: {
    SubTitle
  },
  computed: {
    isCreate() {
      return this.roleId ? false : true;
    },
    roleId() {
      return this.$route.query.id;
    }
  },
  methods: {
    handleClick(vm,node,component ) {
      // console.log(vm, node, component);
    },
    verifyIds() {
      let ids = this.$refs.tree.getCheckedKeys();
      if (!ids.find((item) => item == 1)) {
        ids.unshift(1);
      }
      return JSON.stringify(ids);
    },
    _addRole() {
      if (confirm('确认添加此角色吗?')) {
        this.isSetting = true;
        addRole({
          ids: this.verifyIds(),
          roleName: this.role_name,
          adminId: this.$store.state.auth.userInformation.id
        })
          .then(res => {
            if (res.data.code == 200) {
              this.isSetting = false;
              this.$notify.success('添加角色成功');
              this.$router.push({ path: '/system/role' });
            } else {
              this.$notify.error(res.date.message || '添加角色失败');
            }
          })
          .catch(() => {
            this.isSetting = false;
            this.$notify.error('添加角色失败');
          });
      }
    },
    changePermission() {
      if (confirm('确认修改角色权限吗?')) {
        this.isSetting = true;
        updateRole({
          id: this.roleId,
          ids: this.verifyIds(),
          roleName: this.role_name,
          adminId: this.$store.state.auth.userInformation.id,
          type: 1
        })
          .then(res => {
            if (res.data.code == 200) {
              setTimeout( () => {
                this.$notify.success('修改角色权限成功');
                this.isSetting = false;
                this.$router.push({ path: '/system/role' });
              }, 2000)
            } else {
              this.$notify.error(res.data.message || '修改角色权限失败');
            }
          })
          .catch(() => {
            this.isSetting = false;
            this.$notify.error('修改角色权限失败');
          });
      }
    },
    setCheckedKeys(ids) {
      this.$refs.tree.setCheckedKeys(ids);
    },
    steamroller(arr) {
      while (arr.some(item => Array.isArray(item.menuList))) {
        arr = [].concat(...arr);
      }
      return arr;
    },
    getPermissionIds(permissionList) {
      permissionList.forEach(item => {
        if (item.isPermission == 1) {
          this.permissionIds.push(item.id);
          if (item.menuList) {
            this.getPermissionIds(item.menuList);
          }
        }
      });
    },
    fetchPermission() {
      this.isFetchingPermission = true;
      getPermissionList({
        roleId: this.roleId
      })
        .then(res => {
          let list = res.data.data ? res.data.data : [];
          list.forEach(item => {
            if (item.id === 1) {
              item.disabled = true;
              return;
            }
          });
          this.list = list;
          this.strictly = true;
          this.$nextTick(() => {
           this.getPermissionIds(list)
          //  console.log(this.permissionIds)
           
            // this.setCheckedKeys([1])
            this.strictly = true;
            this.setCheckedKeys(this.permissionIds, true);
            this.isFetchingPermission = false;
          });
          this.strictly = false;
        })
        .catch(() => {
          this.isFetchingPermission = false;
        });
    },
    fetchAllPermission() {
      this.isFetchingPermission = true;
      getAllPermission()
        .then(res => {
          this.list = res.data.data;
          this.setCheckedKeys([1]);
          this.list.forEach(item => {
            if (item.id === 1) {
              item.disabled = true;
              return;
            }
          });
          this.isFetchingPermission = false;
        })
        .catch(() => {
          this.isFetchingPermission = false;
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isCreate) {
        this.fetchAllPermission();
      } else {
        this.role_name = this.$route.query.roleName;
        this.fetchPermission();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.permissionConfigPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.config_role_name {
  margin: {
    top: 20px;
    bottom: 20px;
  }
}
</style>
