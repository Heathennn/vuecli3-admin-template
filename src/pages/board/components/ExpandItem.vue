<template>
  <div class="expandItem" v-if="item" @click="expand(isExpand)">
    <div class="lockerIdBox">
      <div class="lockerId">{{item.doorNo}}</div>
    </div>
    <div class="state">
      <span style="">状态:</span> {{item.doorStatus == 1 ? '使用中' : '空置'}}
    </div>
    <div class="lockerUser">
      <span style="">用户:</span> {{item.nickName ? item.nickName : '无'}}
    </div>
    <div style=" font-size: 12px; line-height: 26px; cursor: pointer;text-align: center;" @click="showUseHistory" v-permission="'7a5dac1f-547b-4b04-8340-e934f2dd688b'">
      查看使用记录>>>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isExpand: false,
      dialogVisible: false,
      orderTable: []
    };
  },
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  methods: {
    expand(val) {
      this.isExpand = !val;
    },
    showUseHistory() {
      this.$emit('showUseHistory', this.item)
    },
    handleClose() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.expandItem {
  width: 100%;
  transition: all 1s;
  overflow: hidden;
  box-sizing: border-box;
}

.state {
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  padding: {
    top: 20px;
    bottom: 10px;
  }
}
.lockerUser {
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  padding: {
    top: 5px;
    bottom: 10px;
  }
}

.lockerIdBox {
  width: 100%;
  @include flexbox;
  @include justify-content(center);
  .lockerId {
    width: 50px;
    height: 50px;
    color: RGBA(0, 102, 255, 1);
    background-color: #ffffff;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid RGBA(0, 102, 255, 1);
  }
}
</style>
