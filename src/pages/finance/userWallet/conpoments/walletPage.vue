<template>
  <sub-page mainTitle="用户钱包" subTitle="查看明细" :routeCallback="routeCallback">
    <walletDetail v-if="subPageType =='userWalletDetail'"></walletDetail>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import walletDetail from './walletDetail';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    SubPage,
    walletDetail
  },
  props: {
    subPageInfo: {
      type: String,
      default: ''
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
      mapSubPage: {
        particulars: {
          mainTitle: '用户钱包',
          subTitle: '查看详情'
        }
      }
    };
  },
  methods: {
    routeCallback() {
      this.$router.push({ path: '/finance/userWallet' });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
