<template>
  <sub-page mainTitle="收入" subTitle="查看详情" :routeCallback="routeCallback">
    <account-Balance v-if="subPageType =='account'"></account-Balance>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';
import accountBalance from './accountBalance';
export default {
  methods: {
    routeCallback() {
      this.$router.push({ path: '/finance/income' });
    }
  },
  components: {
    SubPage,
    accountBalance
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
        account: {
          mainTitle: '收入',
          subTitle: '查看详情'
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
