<template>
  <sub-page :mainTitle="mapSubPage[subPageType].mainTitle" :subTitle="mapSubPage[subPageType].subTitle" :routeCallback="routeCallback">
    <refund-Particulars v-if="subPageType =='particulars'" :storeId="storeId"></refund-Particulars>
  </sub-page>
</template>

<script>
import SubPage from 'components/SubPage';

import refundParticulars from './refundParticulars';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    SubPage,
    refundParticulars
  },
  props: {
    subPageType: {
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
    storeId() {
      let arr = this.subPageInfo.split('=');
      let id = arr[1];
      return id;
    }
  },
  data() {
    return {
      mapSubPage: {
        particulars: {
          mainTitle: '退款',
          subTitle: '查看详情'
        }
      }
    };
  },
  methods: {
    routeCallback() {
      this.$router.push({ path: '/finance/refund' });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
