<template>
  <sub-page mainTitle="押金管理" subTitle="查看明细" :routeCallback="routeCallback">
    <payMoney-Deposit v-if="subPageType =='depositDetail1' || subPageInfo =='depositDetail2'" :type="ID"></payMoney-Deposit>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';
import payMoneyDeposit from './payMoneyDeposit';
export default {
  components: {
    SubPage,
    payMoneyDeposit
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
      mapSubPage: {
      }
    };
  },
  methods: {
    routeCallback() {
      this.$router.push({ path: '/finance/userDeposit' });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
