<template>
  <sub-page v-if="subPageInfo"
            key="1"
            mainTitle="设备异常"
            subTitle="设备异常处理详情"
            :routeCallback="routeCallback">
    <error-detail v-if="subPageType === 'errorDetail'"></error-detail>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import ErrorDetail from './ErrorDetail';

export default {
  components: {
    SubPage,
    ErrorDetail
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
  },
  methods: {
    routeCallback() {
      this.$router.push( { path: '/error' });
    }
  },  
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
