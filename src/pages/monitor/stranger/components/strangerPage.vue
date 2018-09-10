<template>
  <sub-page mainTitle="陌生人入场" subTitle="详情" :routeCallback="routeCallback">
    <stranger-detail v-if="subPageType =='strangerTotal'"></stranger-detail>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import strangerDetail from './strangerDetail';

export default {
  methods: {
    routeCallback() {
      this.$router.push({ path: '/monitor/stranger' });
    }
  },
  components: {
    SubPage,
    strangerDetail
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
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
