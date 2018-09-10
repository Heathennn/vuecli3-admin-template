<template>
  <sub-page v-if="subPageInfo"
            mainTitle="异常订单"
            subTitle="异常订单详情"
            :routeCallback="routeCallback">
    <order-detail v-if="subPageType === 'orderDetail'"
                  :id="ID"></order-detail>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import OrderDetail from './OrderDetail';

export default {
  components: {
    SubPage,
    OrderDetail
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
  methods: {
    routeCallback() {
      this.$router.push( { path: '/service/abnormalOrder' });
    }
  },  
  data() {
    return {
      mapSubPage: {
        editManager: {
          mainTitle: '店长管理',
          subTitle: '编辑店长'
        },
        modifiyManager: {
          mainTitle: '店长管理',
          subTitle: '编辑店长'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
