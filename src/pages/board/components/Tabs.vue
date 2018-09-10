<template>
  <div class="tabsPage">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="实时预约" name="first" v-permission="'5485d97f-24c0-4375-a3d6-3f1efd0e8ffd'">
        <appointment v-permission="'5485d97f-24c0-4375-a3d6-3f1efd0e8ffd'"></appointment>
      </el-tab-pane>
      <el-tab-pane label="设备状态" name="second" v-permission="'34b18b78-99a6-403e-9ad0-fae6198d961f'">
        <device-status v-permission="'34b18b78-99a6-403e-9ad0-fae6198d961f'"></device-status>
      </el-tab-pane>
      <el-tab-pane label="储物柜" name="third" v-permission="'abe05399-99a1-4c5f-a94f-8bde73a594a2'">
        <locker v-permission="'abe05399-99a1-4c5f-a94f-8bde73a594a2'"></locker>
      </el-tab-pane>
      <el-tab-pane label="自动售货机" name="fourth" v-permission="'4c6a0d90-1c7d-4582-88b6-d9603b5449c4'">
        <vending-machine v-permission="'4c6a0d90-1c7d-4582-88b6-d9603b5449c4'"></vending-machine>
      </el-tab-pane>
      <el-tab-pane label="实时监控" name="five" v-permission="'fb51e80e-d05b-46f3-976d-b32a803aac25'">
        <monitor v-if="$store.state.board.defaultStore" v-permission="'fb51e80e-d05b-46f3-976d-b32a803aac25'"></monitor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Appointment from './Appointment';

import DeviceStatus from './DeviceStatus';

import Locker from './Locker';

import VendingMachine from './VendingMachine';

import Monitor from './Monitor';

export default {
  data() {
    return {
      activeName2: 'first'
    };
  },
  components: {
    Appointment,
    DeviceStatus,
    Locker,
    VendingMachine,
    Monitor
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabsPage {
  width: 100%;
  height: auto;
}
</style>
