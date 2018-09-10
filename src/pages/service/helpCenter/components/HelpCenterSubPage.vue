<template>
  <sub-page v-if="subPageInfo"
            mainTitle="帮助中心"
            subTitle="编辑帮助"
            :routeCallback="routeCallback">
    <help-detail v-if="subPageType === 'helpDetail'"
                  :id="ID"
                  @refreshHelpCenter="refreshHelpCenter"></help-detail>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import HelpDetail from './HelpDetail';

export default {
  components: {
    SubPage,
    HelpDetail
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
      this.$router.push( { path: '/service/helpCenter' });
    },
    refreshHelpCenter() {
      this.$emit('refreshHelpCenterList')
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
