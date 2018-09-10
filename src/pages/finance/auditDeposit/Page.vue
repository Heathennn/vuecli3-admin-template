<template>
  <div class="auditDepositPage">
    <sub-title title="三个月内"></sub-title>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" v-permission="'2ff50f18-7140-4947-bdd2-4cd725d89a53'">
        <span slot="label" :class="isDot ? 'unnormal' : 'normal'">待处理</span>
        <unprocessed v-permission="'b5f5df30-19fe-4ce7-9cb1-6610dbe2a53c'" @changeStatus="change"> </unprocessed>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="second" v-permission="'0de65dcc-71a9-4b61-809a-a7c470e9789e'">
        <processed v-permission="'b2b581af-6f79-4334-bc4f-4567c425c8d0'"></processed>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import Processed from './Processed';

import Unprocessed from './Unprocessed';

export default {
  name: 'auditDeposit',
  data() {
    return {
      activeName: 'first',
      isDot: false,
    }
  },
  components: {
    SubTitle,
    Processed,
    Unprocessed
  },
  methods: {
    change(visiable) {
      this.isDot = visiable;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.normal, .unnormal {
  position: relative;
}

.unnormal::after {
  content: ""; 
        display: block;
        position: absolute;
        top:-3px;
        right: -3px;
        width: 6px;
        height: 6px;
        border-radius:50%;
        background-color: red;
}
.auditDepositPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
