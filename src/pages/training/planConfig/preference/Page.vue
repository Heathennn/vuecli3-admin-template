<template>
  <div>
    <div class="userPreference">
      <div class="config_header">用户选择偏好的有氧设备</div>
      <div class="percentInput">
        <el-input placeholder="" v-model="percent" style="width: 120px">
          <template slot="append">%</template>
        </el-input>
      </div>
        <span style="color: #666666; padding-left: 5px;">  概率随机分配在周期内的运动周日 </span>
    </div>

    <div style="color: #666666; padding-top: 20px; padding-bottom: 20px;">剩下 未被选择的有氧运动设备，减去上面的额定概率后，随机分配在周期内的运动日。</div>
    <el-button type="primary" @click="updateConfig">保存</el-button>
  </div>
</template>

<script>
import {
  getTrainingConfig,
  updateTrainingConfig
} from 'api/training/trainingConfig';

export default {
  data() {
    return {
      percent: 0
    };
  },
  methods: {
    fetchConfig() {
      getTrainingConfig({
        confType: 'preferenceProbability'
      }).then( (res) => {
        this.percent = res.data.data.confValue;
      })
    },
    updateConfig() {
      updateTrainingConfig({
        confType: 'preferenceProbability',
        confValue: this.percent,
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('修改配置成功');
          this.fetchConfig();
        } else {
          this.$notify.error('修改配置失败');
          this.fetchConfig();
        }
      }).catch( () => {
        this.$notify.error('修改配置失败');
        this.fetchConfig();
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchConfig();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userPreference {
  @include flexbox;
  @include align-items(center);
  @include justify-content(flex-start);
  box-sizing: border-box;
  padding: {
    left: 30px;
    right: 30px;
    top: 50px;
    bottom: 50px;
  }
  background-color: #e5e5e5;
  border: 1px solid #666666;
}
.config_header {
  padding: {
    right: 10px;
  }
}
.percentInput {
}
</style>


