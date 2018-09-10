<template>
  <div class="personnelConfigPage">
    <sub-title title="人员管理配置"></sub-title>
    <div class="config_content">
      <div class="config_item">
        <div class="config_item_subtitle">角色分类</div>
        <div>
          <el-select v-model="role" placeholder="请选择" style="margin-right: 20px;" v-loading="isFetchingRoles" element-loading-spinner="el-icon-loading">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="config_item">
        <div class="config_item_subtitle">登录账号</div>
        <div>
          <el-input v-model="username" style="width: 500px"></el-input>
        </div>
      </div>

      <div class="config_item">
        <div class="config_item_subtitle">真实姓名</div>
        <div>
          <el-input v-model="realName" style="width: 500px"></el-input>
        </div>
      </div>

      <div class="config_item">
        <div class="config_item_subtitle">手机号码</div>
        <div>
          <el-input v-model="mobile" style="width: 500px"></el-input>
        </div>
      </div>

      <div class="config_item">
        <div class="config_item_subtitle">邮箱</div>
        <div>
          <el-input v-model="email" style="width: 500px"></el-input>
        </div>
      </div>

      <!-- <div class="config_item">
        <div class="config_item_subtitle">密码</div>
        <div>
          <el-input v-model="password" style="width: 500px"></el-input>
        </div>
      </div> -->

      <div class="config_item">
        <div class="config_item_subtitle">新密码</div>
        <div>
          <el-input v-model="newPassword" style="width: 500px" type="password"></el-input>
        </div>
      </div>

      <div class="config_item" v-if="newPassword">
        <div class="config_item_subtitle">确认密码</div>
        <div>
          <el-input v-model="newPassword_repeat" style="width: 500px" type="password"></el-input>
        </div>
      </div>

      <div class="config_item">
        <div class="config_item_subtitle">是否启用</div>
        <div>
          <el-switch v-model="displayStatus" :active-value="1" :inactive-value="0" @change="switchChange">
          </el-switch>
        </div>
      </div>

    </div>

    <div class="button_bottom">
      <el-button type="primary" v-if="id" @click="confirmEdit">确认修改</el-button>
      <el-button type="primary" v-else @click="addConfig">确认新增</el-button>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getRoles, getPersonnelDetail, updatePersonnel, addPersonnel } from './personnel';

export default {
  name: 'personnelConfig',
  data() {
    return {
      id: null,
      role: '',
      roles: [],
      username: '',
      realName: '',
      mobile: '',
      email: '',
      password: '',
      newPassword: '',
      newPassword_repeat: '',
      displayStatus: 1,
      isFetchingRoles: false
    };
  },
  computed: {
    roleName() {
      let item = this.roles.find(item => item.id == this.role)
      if (!item) return '';
      return item.roleName;
    }
  },
  components: {
    SubTitle
  },
  methods: {
    fetchRoles() {
      getRoles({ page: 1, size: 1000, isAdmin: 0 }).then(res => {
        // res.data.data.list.unshift({
        //   id: 'all',
        //   roleName: '全部'
        // })
        let list = res.data.data.list;
        if (!this.$route.query.id) {
          list = list.filter( (item) => {
            return item.isAdmin != 1
          })
        }
        this.roles = list;
      });
    },
    isPhoneAvailable(pone) {
      var myreg = /^[1][3,4,5,7,8,6,9][0-9]{9}$/;
      if (!myreg.test(pone)) {
       return false;
      } else {
       return true;
      }
    },
    addConfig() {
      if (!this.role) {
        return this.$notify.warning('请选择角色分类');
      }
      if (!this.username) {
        return this.$notify.warning('登录账号不能为空');
      }
      if (!this.newPassword) {
        return this.$notify.warning('登录密码不能为空');
      }
      if (!this.email) {
        return this.$notify.warning('邮箱不能为空');
      }
      if (!this.realName) {
        return this.$notify.warning('真实姓名不能为空');
      }
      if (!this.mobile) {
        return this.$notify.warning('手机号不能为空');
      }
      if (this.email) {
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(this.email)) {
          return this.$notify.warning('请输入合法的邮箱');
        }
      }
      if (this.mobile) {
        if (!this.isPhoneAvailable(this.mobile)) {
          return this.$notify.warning('请输入有效的手机号');
        }
      }
      if (this.realName) {
        if (!/[\u4e00-\u9fa5]{2,6}/.test(this.realName)) {
          return this.$notify.warning('请输入2-6个汉字');
        }
      }
      if (this.newPassword !== this.newPassword_repeat) {
        return this.$notify.warning('新旧密码不一致');
      }
      this.$router.push({ path: '/system/personnel' });
      addPersonnel({
        roleId: this.role,
        roleName: this.roleName,
        username: this.username,
        email: this.email,
        password: this.newPassword,
        status: this.displayStatus,
        mobile: this.mobile,
        realName: this.realName,
        renew: this.$store.state.auth.userInformation.username,
        adminId: this.$store.state.auth.userInformation.id
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('创建人员成功');
        } else {
          this.$notify.error(res.data.message || '创建人员失败');
        }
      }).catch( () => {
        this.$notify.error('创建人员失败');
      })
    },
    confirmEdit() { 
      let params;
      if (!this.role) {
        return this.$notify.warning('请选择角色分类');
      }
      if (!this.username) {
        return this.$notify.warning('登录账号不能为空');
      }
      if (!this.email) {
        return this.$notify.warning('邮箱不能为空');
      }
      if (!this.realName) {
        return this.$notify.warning('真实姓名不能为空');
      }
      if (!this.mobile) {
        return this.$notify.warning('手机号不能为空');
      }
      if (this.email) {
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(this.email)) {
          return this.$notify.warning('请输入合法的邮箱');
        }
      }
      if (this.mobile) {
        if (!this.isPhoneAvailable(this.mobile)) {
          return this.$notify.warning('请输入有效的手机号');
        }
      }
      if (this.realName) {
        if (!/[\u4e00-\u9fa5]{2,6}/.test(this.realName)) {
          return this.$notify.warning('请输入2-6个汉字');
        }
      }
      if (this.newPassword) {
        if (this.newPassword === this.newPassword_repeat) {
          params = {
            id: this.id,
            roleId: this.role,
            username: this.username,
            email: this.email,
            mobile: this.mobile,
            password: this.newPassword,
            status: this.displayStatus,
            realName: this.realName
          };
        } else {
          this.$notify.warning('新旧密码不一致');
          return;
        }
      } else {
        params = {
          id: this.id,
          roleId: this.role,
          username: this.username,
          email: this.email,
          mobile: this.mobile,
          // password: this.password,
          status: this.displayStatus,
          realName: this.realName
        };
      }
      this.$router.push({ path: '/system/personnel' });
      updatePersonnel(params)
        .then(res => {
          if (res.data.code == 200) {
            this.$notify.success('修改成功');

          } else {
            this.$notify.error(res.data.message || `修改失败`);
          }
        })
        .catch(() => {
          this.$notify.error('修改失败, 请重试');
        });
    },
    switchChange() {},
    resetInfo() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.realName = '';
      this.mobile = '';
      this.displayStatus = 1;
      this.id = null
    },
    fetchDetail() {
      getPersonnelDetail({ id: this.$route.query.id }).then(res => {
        let data = res.data.data;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.realName = data.realName;
        this.role = data.roleId;
        this.mobile = data.mobile;
        this.displayStatus = data.isValid;
        this.id = data.id;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.fetchDetail();
      } else {
        this.resetInfo();
      }
      this.fetchRoles();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.personnelConfigPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.config_content {
  width: 100%;
  margin: {
    top: 20px;
  }
}

.config_item_subtitle {
  width: 100px;
}
.config_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
</style>
