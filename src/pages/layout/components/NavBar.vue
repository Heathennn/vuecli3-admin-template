<template>
  <div class="navbar">
    <div class="protalHead">
      <Breadcrumb></Breadcrumb>
      <div class="headControl">
        <div class="headImg">
          <img :src="headIcon" alt="" style="width: 100%; height: 100%; border-radius: 50%;">
        </div>
        <div class="usernamebox">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{userInformation? userInformation.username : ''}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix" @click.native="toLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="tips">
          <el-popover ref="popover5" placement="bottom" width="400" trigger="click">
            <div class="popoverContent">
              <notice :noticeSystemMessages="noticeSystemMessages" :operatorSystemMessages="operatorSystemMessages" :seviceSystemMessages="seviceSystemMessages" @refreshData="getMessages"></notice>
              <div class="noticeFooter">
                <div class="history" @click="jumpToHistory">历史消息</div>
              </div>
            </div>
          </el-popover>
          <el-badge :value="Number(allMessagesLengh) == 0 ? '' : Number(allMessagesLengh) " class="item" v-popover:popover5 :max="99">
            <i class="el-icon-bell headIcon"></i>
          </el-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SlideFade from 'components/transitions/SlideFade';

import Notice from './Notice';

import Breadcrumb from 'components/Breadcrumb';

import { mapState, mapActions } from 'vuex';

import headIcon from 'assets/ruozhi.png';

export default {
  data() {
    return {
      headIcon: headIcon,
      timer: null
    };
  },
  components: {
    SlideFade,
    Notice,
    Breadcrumb
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation,
      allSystemMessages: state => state.auth.allSystemMessages,
      noticeSystemMessages: state => state.auth.noticeSystemMessages,
      operatorSystemMessages: state => state.auth.operatorSystemMessages,
      seviceSystemMessages: state => state.auth.seviceSystemMessages
    }),
    allMessagesLengh() {
      let num2;
      let num1;
      let num3;
      try {
        num1 = this.seviceSystemMessages[0]
          ? this.seviceSystemMessages[0].needReadNum
          : 0;
        num2 = this.operatorSystemMessages[0]
          ? this.operatorSystemMessages[0].needReadNum
          : 0;
        num3 = this.noticeSystemMessages[0]
          ? this.noticeSystemMessages[0].needReadNum
          : 0;
      } catch (error) {
        return 0;
      } finally {
        return num1 + num2 + num3;
      }
    }
  },
  methods: {
    ...mapActions(['Fedout', 'getSystemMessages']),
    toLogout() {
      this.Fedout().then(() => {
        this.$router.push({ path: '/login' });
      });
    },
    getMessages() {
      this.getSystemMessages({
        userId: this.userInformation.id,
        noticeType: 1
      }).then(() => []);
      this.getSystemMessages({
        userId: this.userInformation.id,
        noticeType: 2
      }).then(() => []);
      this.getSystemMessages({
        userId: this.userInformation.id,
        noticeType: 3
      }).then(() => []);
    },
    jumpToHistory() {
      this.$router.push({path: '/historyMessage/index'});
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getMessages();
      this.timer = window.setInterval(this.getMessages, 30000);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.navbar {
  height: 50px;
  background-color: #ffffff;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}

.usernamebox {
  margin: {
    right: 5px;
  }
}

.popoverContent {
  position: relative;
  padding-bottom: 10px;
}
.noticeFooter {
  width: 100%;
  background-color: #ffffff;
  position: absolute;
  bottom: 0px;
  left: 10px;
}
.history {
  color: #999999;
  font-size: 10px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
} 
.protalHead {
  position: relative;
  width: 100%;
  height: 100%;
}
.headControl {
  height: 50px;
  // background-color: white;
  position: absolute;
  top: 0;
  right: 10%;
  @include flexbox;
  @include justify-content(center);
  @include align-items(center);
  .headImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #777777;
    margin: {
      right: 5px;
    }
  }
  .headIcon {
    font-size: 25px;
  }
}
</style>
