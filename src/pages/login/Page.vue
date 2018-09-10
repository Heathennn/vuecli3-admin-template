<template>
  <fade>
    <div class="loginPage">
        <div class="loginInputBox shadow">
          <div class="loginTitle">登录</div>
          <div class="loginUserName">
            <el-input prefix-icon="el-icon-goods" v-model="userNameInput" placeholder="图标随便放的" clearable @keyup.enter.native="userLogin" :autofocus="true"></el-input>
          </div>
          <div class="loginPassword">
            <el-input prefix-icon="el-icon-mobile-phone" v-model="passwordInput" type="password" placeholder="图标随便放的" clearable @keyup.enter.native="userLogin"></el-input>
          </div>
          <div class="loginInfo">
            <admin-tips>
              账号: admin, 密码: 123456
            </admin-tips>
          </div>
          <div class="loginButton">
            <el-button type="primary" @click="userLogin">登录</el-button>
          </div>
        </div>
      </div>
  </fade>
</template>

<script>
import Fade from 'components/transitions/Fade';

import Logo from 'components/Logo';

import { setToken } from 'common/utils';

import AdminTips from 'components/AdminTips';

export default { 
  data() {
    return {
      userNameInput: '',
      passwordInput: '',
    };
  },
  components: {
    Fade,
    Logo,
    AdminTips
  },
  methods: {
    userLogin() {
      let params = {
        username: this.userNameInput,
        password: this.passwordInput
      };
      // this.$message.warning('正在登陆...');
      this.$store.dispatch('login', params)
        .then(res => {
          // 本地存储
          localStorage.setItem('userInformation', JSON.stringify(res.userManager));
          this.loginSuccess();
          this.$router.push({ path: '/home', replace: true });
          window.location.reload();
          // window.location.href = window.location.href;
        })
        .catch(error => {
          this.loginFail(error);
        });
    },
    loginSuccess() {
      this.$message({
        message: '登录成功',
        type: 'success'
      });
    },
    loginFail(error) {
      this.$message.error(
        error ? error : '您输入的账号或密码不正确, 请重新输入'
      );
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.loginPage {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: $blue;
  padding: {
    top: 100px;
  }
}
.loginCard {
  width: 70%;
  height: 300px;
  background-color: $blue;
  position: absolute;
  top: 200px;
  left: 15%;
  opacity: 0.8;
  color: #ffffff;
  box-sizing: border-box;
  padding: {
    top: 30px;
    left: 30px;
    right: 25px;
    bottom: 20px;
  }
}
.loginLogo {
  width: 60px;
  height: 40px;
}
.adminName {
  font-size: 40px;
}
.enName {
  font-weight: 100;
  padding: {
    top: 70px;
  }
}
.loginTitle {
  text-align: center;
  font-size: 30px;
  line-height: 50px;
  font-weight: 200;
}
.loginInputBox {
  width: 400px;
  height: 400px;
  box-sizing: border-box;
  // border: 1px solid black;
  margin: 0 auto;
  padding: {
    top: 40px;
  }
  background-color: #ffffff;
  @include flexbox;
  // @include justify-content(center);
  // @include align-items(center);
  @include flex-direction(column);
}

.loginUserName,
.loginPassword {
  margin: {
    top: 10px;
    bottom: 5px;
  }
  padding: {
    left: 20px;
    right: 20px;
  }
}
.loginButton {
  margin: 0 auto;
  margin: {
    top: 40px;
  }
}
  .loginInfo {
    padding: {
      left: 20px;
      right: 20px;
    }
  }
</style>
