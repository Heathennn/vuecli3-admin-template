<template>
  <div class="noticeBox">
    <div class="noticeTitle">
      <div class="titleBox" @click="moveTo(0, 'operatorSystemMessages')">
        <el-badge :value="Number(operatorMessageNum) == 0 ? '' : Number(operatorMessageNum)" class="item" :max="99">
          <div class="title">运营</div>
        </el-badge>
      </div>
      <div class="titleBox" @click="moveTo(80, 'seviceSystemMessages')">
        <el-badge :value="Number(seviceMessageNum) == 0 ? '' : Number(seviceMessageNum)" class="item" :max="99">
          <div class="title">客服</div>
        </el-badge>
      </div>
      <div class="titleBox" @click="moveTo(155, 'noticeSystemMessages')">
        <el-badge :value="Number(noticeMessageNum) == 0 ? '' : Number(noticeMessageNum) " class="item" :max="99">
          <div class="title">通知</div>
        </el-badge>
      </div>
      <div class="underline" ref="underline"></div>
      <div class="markallasread" @click="_markAllAsRead">全部已阅</div>
    </div>
    <div class="noticeContent">
      <operation-message :currentMessage="operatorSystemMessages" v-if="activeName === 'operatorSystemMessages'" @refresh="refresh"></operation-message>
      <notice-message :currentMessage="noticeSystemMessages" v-if="activeName === 'noticeSystemMessages'" @refresh="refresh"></notice-message>
      <sevice-message :currentMessage="seviceSystemMessages" v-if="activeName === 'seviceSystemMessages'" @refresh="refresh"></sevice-message>
    </div>
    <div class="history" style="text-align: center" @click="jumpToHistory" v-if="currentMessage && currentMessage.length > 0">点击查看更多消息</div>
  </div>
</template>

<script>
import OperationMessage from './OperationMessage';

import NoticeMessage from './NoticeMessage';

import SeviceMessage from './SeviceMessage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    OperationMessage,
    NoticeMessage,
    SeviceMessage
  },
  props: {
    seviceSystemMessages: {
      type: Array,
      default: () => []
    },
    operatorSystemMessages: {
      type: Array,
      default: () => []
    },
    noticeSystemMessages: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    currentMessage(val) {
      // console.log(val);
    }
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation
    }),
    seviceMessageNum() {
      return this.seviceSystemMessages.length == 0 ? 0 : this.seviceSystemMessages[0].needReadNum
    },
    operatorMessageNum() {
      return this.operatorSystemMessages.length == 0 ? 0 : this.operatorSystemMessages[0].needReadNum;
    },
    noticeMessageNum() {
      try {
        return this.noticeSystemMessages.length.length == 0 ? 0 : this.noticeSystemMessages[0].needReadNum;
      } catch(error) {
        return 0
      }
    },
    currentMessage() {
      return this[this.activeName];
    }
  },
  data() {
    return {
      activeName: 'operatorSystemMessages',
      isLoading: false,
      mapActiveName: {
        operatorSystemMessages: 3,
        seviceSystemMessages: 2,
        noticeSystemMessages: 1
      }
    };
  },
  methods: {
    ...mapActions(['getSystemMessages', 'markAllAsRead']),
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    moveTo(value, name) {
      this.activeName = name;
      this.$refs.underline.style.left = value + 'px';
    },
    jumpToHistory() {
      this.$router.push({path: '/historyMessage/index'});
    },
    _markAllAsRead() {
      this.markAllAsRead({
        userId: this.userInformation.id,
        noticeType: this.mapActiveName[this.activeName]
      }).then(() => {
        this.getSystemMessages({
          userId: this.userInformation.id,
          noticeType: 3
        }).then( () => {}).catch( (error) => {
          this.$notify.error(error)
        })
        this.getSystemMessages({
          userId: this.userInformation.id,
          noticeType: 2
        }).then( () => {}).catch( (error) => {
          this.$notify.error(error)
        })
        this.getSystemMessages({
          userId: this.userInformation.id,
          noticeType: 1
        }).then( () => {}).catch( (error) => {
          this.$notify.error(error)
        })
      });
    },
    refresh() {
      this.$emit('refreshData')
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.noticeBox {
  box-sizing: border-box;
  padding: 10px;
  height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: {
    bottom: 20px;
  }
  padding: {
    bottom: 20px;
  }
}
.noticeTitle {
  @include flexbox;
  position: relative;
  padding: {
    bottom: 5px;
  }
  border: {
    bottom: 1px solid #e5e5e5;
  }
  .title {
    text-align: center;
    cursor: pointer;
    padding: {
      right: 10px;
    }
  }
  .titleBox {
    width: 60px;
    @include flexbox;
    @include justify-content(center);
    @include align-items(center);
    cursor: pointer;
    margin: {
      right: 20px;
    }
  }
  .underline {
    position: absolute;
    transition: all 0.5s;
    bottom: 0px;
    left: 0px;
    width: 60px;
    height: 2px;
    background-color: blue;
  }
  .markallasread {
    cursor: pointer;
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 10px;
  }
}
.noticeContent {
  min-height: 50px;
}
.noticeFooter {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 100%;
  border: {
    top: 1px solid #e5e5e5;
  }
}
  .history {
    color: #999999;
    font-size: 10px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }

.empty {
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
