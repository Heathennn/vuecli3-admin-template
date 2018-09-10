<template>
  <sub-page mainTitle="售货机商品管理"
            subTitle="售货机商品详情"
            :routeCallback="routeCallback">
    <shops-detail v-if="subPageType === 'shopsDetail'"></shops-detail>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import ShopsDetail from './ShopsDetail';

export default {
  props: {
    subPageType: {
      type: String,
      default: ''
    }
  },
  components: {
    SubPage,
    ShopsDetail 
  },
  methods: {
    routeCallback() {
      this.$router.push({path: '/operation/shops'})
    }
  },
  data() {
    return {
      mapSubPageTitle: {
        shopsDetail: {
          mainTitle: '售货机商品管理',
          subTitle: '售货机商品详情'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
