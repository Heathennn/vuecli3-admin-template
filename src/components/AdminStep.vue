<template>
  <div class="stepContent" :style="stepNum == 1 || currentNum == 0 ? successStatusStyle : ''">
    <div class="step_time">{{stepTime}}</div>
    <div class="step_status">
      <div class="step_icon" :style="stepNum == 1 || currentNum == 0 ? stepIconStyle : ''"></div>
      <div class="step_line" v-if="stepNum > 1 && currentNum !== stepNum - 1"></div>
    </div>
    <div class="step_content">
      <div class="step_userInfo">{{stepHandleUserInfo}}</div>
      <div class="step_description">{{stepHandleRemark}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentNum: {
      type: Number,
      default: 0
    },
    stepNum: {
      type: Number,
      default: 0
    },
    stepTime: {
      type: String,
      default: '2018-01-01'
    },
    stepHandleUserInfo: {
      type: String,
      default: '处理人'
    },
    stepHandleRemark: {
      type: String,
      default: '处理说明'
    }
  },
  data() {
    return {
      successStatusStyle: {
        color: '#1f52f1'
      },
      stepIconStyle: {
        backgroundColor: '#1f52f1'
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.stepContent {
  @include flexbox;
  @include align-items(center);
  font-size: 12px;
  color: gray;
  .step_time {
    height: 100px;
    width: 100px;
    box-sizing: border-box;
    padding: {
      right: 15px;
    }
  }
  .step_content {
    height: 100px;
    box-sizing: border-box;
    padding: {
      left: 15px;
    }
  }
  .step_status {
    @include flexbox;
    @include flex-direction(column);
    @include align-items(center);
    height: 100px;
  }
  .step_icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: gray;
  }
  .step_line {
    width: 2px;
    height: 80px;
    background-color: #666666;
  }
}
</style>
