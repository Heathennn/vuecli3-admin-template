<template>
  <sub-page mainTitle="App版本配置"
            subTitle="编辑App版本配置"
            :routeCallback="routeCallback">
    <version-config></version-config>
  </sub-page>    
</template>

<script>
import SubPage from 'components/SubPage';

import VersionConfig from './VersionConfig';

export default {
  components: {
    SubPage,
    VersionConfig
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
    ID() {
      let arr = this.subPageInfo.split('=');
      let id = arr[1];
      return id;
    }
  },
  data() {
    return {
    }
  },
  methods: {
    routeCallback() {
      this.$router.push({path: '/system/appVersion'})
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
