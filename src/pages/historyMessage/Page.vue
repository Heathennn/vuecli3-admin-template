<template>
  <div class="historyMessagePage">
    <div class="markAllAsRead" @click="mark">全部已阅</div>
    <!-- <notice :noticeSystemMessages="noticeSystemMessages"
                        :operatorSystemMessages="operatorSystemMessages"
                        :seviceSystemMessages="seviceSystemMessages"></notice> -->
    <el-tabs v-model="activeType" @tab-click="handleClick">
      <el-tab-pane name="3">
         <el-badge slot="label" :value="read1" class="item" :max="99" style="margin-top:10px;">
          <span>运营</span>
        </el-badge>
        <operation-page @setRead="setRead1" ref="operationPage"></operation-page>
      </el-tab-pane>
      <el-tab-pane name="2">
        <el-badge slot="label" :value="read2" class="item" :max="99" style="margin-top:10px;">
          <span>客服</span>
        </el-badge>
        <service-page @setRead="setRead2" ref="servicePage"></service-page>
      </el-tab-pane>
      <el-tab-pane name="1">
         <el-badge slot="label" :value="read3" class="item" :max="99" style="margin-top:10px;">
          <span>通知</span>
        </el-badge>
        <notice-page @setRead="setRead3" ref="noticePage"></notice-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getHistoryMessage, markAllAsRead } from 'api/auth';

import OperationPage from './components/OperationPage';

import ServicePage from './components/ServicePage';

import NoticePage from './components/NoticePage';

export default {
  name: 'historyMessage',
  data() {
    return {
      activeType: '3',
      read1: '',
      read2: '',
      read3: '',
    }
  },
  components: {
    OperationPage,
    ServicePage,
    NoticePage
  },
  methods: {
    handleClick() {

    },
    setRead1(val) {
      this.read1 = val == 0 ? '' : val;
    },
    setRead2(val) {
      this.read2 = val == 0 ? '' : val;
    },
    setRead3(val) {
      this.read3 = val == 0 ? '' : val;
    },
    mark() {
      markAllAsRead({
        userId: this.$store.state.auth.userInformation.id,
        noticeType: this.activeType
      }).then(() => {
        this.$refs.operationPage.fetchData();
        this.$refs.servicePage.fetchData();
        this.$refs.noticePage.fetchData();
      });
    }
  },
  computed: {
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.historyMessagePage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
}

.markAllAsRead {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 35px;
  font-size: 12px;
  color: #999999;
  z-index: 10000;
}
</style>
