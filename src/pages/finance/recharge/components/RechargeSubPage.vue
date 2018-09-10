<template>
  <sub-page mainTitle="充值汇总" subTitle="充值明细" :routeCallback="routeCallback">
    <recharge-detail v-if="subPageType =='rechargeDetail'"></recharge-detail>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import RechargeDetail from './rechargeDetail';

export default {
  methods: {
    routeCallback() {
      this.$router.push({ path: '/finance/recharge' });
    }
  },
  components: {
    SubPage,
    RechargeDetail
  },
  props: {
    subPageInfo: {
      type: String,
      default: ''
    }
  },
  computed:{
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
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
