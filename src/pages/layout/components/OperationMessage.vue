<template>
  <div class="currentMessage">
    <div class="messageItem" v-for="(item, index) in currentMessage" :key="index">
      <div class="messageHead">
        <div :class="item.iconSign == 2 ? item.readStatus == 1 ? ['title', 'fire']: ['fire'] : item.readStatus == 1 ? ['title'] : ['']" :style="item.readStatus == 2 ? 'color: #999999' : ''">设备异常</div>
        <div class="createTime">{{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>

      <div class="messageContent" :style="item.readStatus == 2 ? 'color: #999999' : ''" @click="jumpToErrorDetail(item.id, item.backStageAbnormal.abnormalId)">
        [{{item.backStageAbnormal.facilityName ? item.backStageAbnormal.facilityName :'无'}}](错误码:{{item.backStageAbnormal.abnormalCode ? item.backStageAbnormal.abnormalCode:'无'}}): {{item.backStageAbnormal.abnormalDesc}}
      </div>
      <div class="storeName" style="color: #999999">
        {{item.backStageAbnormal.storeName}}
      </div>
    </div>
  </div>
</template>

<script>
import { readNotice } from 'api/auth';

export default {
  props: {
    currentMessage: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    jumpToErrorDetail(id,detailId) {
      readNotice({id:id}).then( () => {
        this.$emit('refresh');
      })
      this.$router.push({ path: `/operation/error?errorDetail=${detailId}` });
    }
  },
  mounted() {
    // console.log(this.currentMessage);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.title {
  position: relative;
}
.title::before {
  content: '';
  display: block;
  position: absolute;
  left: -9px;
  top: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: red;
}

.messageItem {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}
.messageContent {
  cursor: pointer;
}
.messageHead {
  @include flexbox;
  @include justify-content(space-between);
}
</style>
