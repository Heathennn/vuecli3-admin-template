<template>
  <sub-page mainTitle="安全画面" subTitle="详情" :routeCallback="routeCallback">
    <secure-detail v-if="subPageType =='ZoomDetail'"></secure-detail>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import secureDetail from './secureDetail'
export default {
  methods: {
    routeCallback() {
      this.$router.push({ path: '/monitor/securezoom' });
    }
  },
  components: {
    SubPage,
    secureDetail
  },
  props: {
    subPageType: {
      type: String,
      default: ''
    }
  },
  computed:{},
  data() {
    return {
      mapSubPage: {
        ZoomDetail: {
          mainTitle: '安全画面',
          subTitle: '详情'
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
