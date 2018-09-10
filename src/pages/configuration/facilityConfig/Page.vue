<template>
  <div class="facilityConfigPage">
    <sub-title title="设备类型扩展配置"></sub-title>
    <div class="selectors">
      <div style="width: 100px">设备类型</div>
      <el-select v-model="sportType" placeholder="请选择">
          <el-option v-for="item in sportTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
    </div>
    <div class="configContent">
      <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane label="描述" v-permission="'722d8ac5-4d61-4a4c-b29b-dc0da9179cc8'">
          <desc-table :tableData="facilityDescData" @refreshData="fetchConfig" v-permission="'dca217ce-f843-4ea6-a519-0d62cf8635b8'"></desc-table>
        </el-tab-pane>
        <el-tab-pane label="ICON" v-permission="'90f9835c-1a8e-4833-ae52-6eafefc31615'">
          <icon-table :tableData="iconData" @refreshData="fetchConfig" v-permission="'5bcd93d8-ed0a-45d3-b48e-dcb0a51c2ac6'"></icon-table>
        </el-tab-pane>
        <el-tab-pane label="设备图片" v-permission="'2549b426-eda1-4245-9888-a4862a59dbaf'">
          <facility-image-table :tableData="facilityImageData" @refreshData="fetchConfig" v-permission="'3c0340b1-d3d6-41ba-9de2-3f76fabcd7a9'"></facility-image-table>
        </el-tab-pane>
        <el-tab-pane label="设备背景图片" v-permission="'85c53745-817a-4c26-91c8-87b6d73b3f36'">
          <facility-background-table :tableData="facilityBackgroundData" @refreshData="fetchConfig" v-permission="'f0362935-ad08-4c6a-8b9a-8bb7b71c7c9f'"></facility-background-table>
        </el-tab-pane>
        <el-tab-pane label="训练部位图片" v-permission="'5f075151-5d78-430f-a16a-ba7c5baacc59'">
          <plan-body-image-table :tableData="planBodyImageData" @refreshData="fetchConfig" v-permission="'97403e81-11aa-43e9-a6e0-13f7e81c015c'"></plan-body-image-table>
        </el-tab-pane>
        <el-tab-pane label="视频" v-permission="'67d4f865-39f4-44c6-adf9-42d2874d2c49'">
          <facility-video-table :tableData="facilityVideoData" @refreshData="fetchConfig" v-permission="'9b0f99c7-9973-42b5-89ee-cfce26fa64c5'"></facility-video-table>
        </el-tab-pane>
        <el-tab-pane label="单位" v-permission="'d867d268-bc10-4c1e-bb5e-65e342430857'">
          <facility-unit-table :tableData="facilityUnitData" @refreshData="fetchConfig" v-permission="'1434bbb8-3515-493b-8267-413f21e2c275'"></facility-unit-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import DescTable from './components/DescTable';

import FacilityImageTable from './components/FacilityImageTable';

import FacilityBackgroundTable from './components/FacilityBackgroundTable';

import FacilityUnitTable from './components/FacilityUnitTable';

import FacilityVideoTable from './components/FacilityVideoTable';

import IconTable from './components/IconTable';

import PlanBodyImageTable from './components/PlanBodyImageTable';

import { getFacilityConfig } from 'api/configuration/facilityConfig';

export default {
  data() {
    return {
      configList: [],
      sportType: '1,2',
      sportTypes: [
        {
          label: '全部',
          value: '1,2'
        },
        {
          label: '无氧设备',
          value: 1
        },
        {
          label: '有氧设备',
          value: 2
        }
      ]
    }
  },
  components: {
    SubTitle,
    DescTable,
    FacilityImageTable,
    FacilityUnitTable,
    FacilityVideoTable,
    IconTable,
    PlanBodyImageTable,
    FacilityBackgroundTable
  },
  watch: {
    sportType() {
      this.fetchConfig();
    }
  },
  computed: {
    facilityDescData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typeSummary: item.typeSummary ? item.typeSummary : '空', // 设备类型简介
          typeMuscle: item.typeMuscle ? item.typeMuscle : '空', // 锻炼肌群
          typeKeypoint: item.typeKeypoint ? item.typeKeypoint : '空', // 使用要点描述
          typeProtect: item.typeProtect ? item.typeProtect : '空' // 防护部位描述
        }
      })
    },
    iconData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typeIconUrl: item.typeIconUrl,
        }
      })
    },
    facilityImageData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typePicUrl: item.typePicUrl,

        }
      })
    },
    facilityBackgroundData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          backgroundPicUrl: item.backgroundPicUrl,

        }
      })
    },
    planBodyImageData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typeMuscleUrl: item.typeMuscleUrl
        }
      })
    },
    facilityVideoData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typeVideoUrl: item.typeVideoUrl
        }
      })
    },
    facilityUnitData() {
      return this.configList.map( (item) => {
        return {
          id: item.id,
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          typeUnit: item.typeUnit
        }
      })
    }
  },
  methods: {
    createParams() {
      let params = {};
      params.page = 1;
      params.size = 1000;
      params.sportTypeExtend = this.sportType
      return params;
    },
    fetchConfig() {
      getFacilityConfig(this.createParams()).then( (res) => {
        this.configList = res.data.data.list;
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchConfig();
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.facilityConfigPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.configContent {
  padding: {
    top: 30px;
  }
}

.selectors {
  @include flexbox;
  @include align-items(center);
  margin: {
    top: 30px;
  }
  padding: {
    left: 30px;
  }
}
</style>
