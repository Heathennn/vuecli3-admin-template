<template>
  <sub-page v-if="mapSubPage[subPageType]" :mainTitle="mapSubPage['baseInfo'].mainTitle"
            :subTitle="mapSubPage[subPageType].subTitle"
            :routeCallback="routeCallback"
            key="2">
    <base-information v-if="subPageType =='baseInfo'"
                      :storeId="storeId"
                      @refreshData="refresh"></base-information>
    <config-information v-if="subPageType == 'configInfo'"
                        :storeId="storeId"></config-information>
    <manager-information v-if="subPageType == 'managerInfo'"
                         :storeId="storeId"></manager-information>
  </sub-page>    
</template>

<script>
import SubPage from 'components/SubPage';

import BaseInformation from './BaseInformation';

import ConfigInformation from './ConfigInformation';

import ManagerInformation from './ManagerInformation';

export default {
  components: {
    SubPage,
    BaseInformation,
    ConfigInformation,
    ManagerInformation
  },
  props: {
    subPageInfo: {
      type: String
    }
  },
  computed: {
    subPageType() {
      let arr = this.subPageInfo.split('=');
      let type = arr[0];
      return type;
    },
    storeId() {
      let arr = this.subPageInfo.split('=');
      let id = arr[1];
      return id;
    }
  },
  data() {
    return {
      mapSubPage: {
        baseInfo: {
          mainTitle: '门店管理',
          subTitle: '编辑基本信息'
        },
        configInfo: {
          mainTitle: '门店管理',
          subTitle: '编辑配置信息'
        },
        managerInfo: {
          mainTitle: '门店管理',
          subTitle: '编辑店长信息'
        }
      }
    }
  },
  methods: {
    routeCallback() {
      this.$router.push({path: '/storePart/store'})
    },
    refresh() {
      this.$emit('refreshStoreList')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
