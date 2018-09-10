<template>
  <sub-page v-if="subPageInfo"
            key="1"
            mainTitle="店长管理"
            subTitle="编辑店长"
            :routeCallback="routeCallback">
    <edit-manager v-if="subPageType === 'editManager'"
                  :id="ID"
                  @refreshData="refreshData"></edit-manager>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import EditManager from './EditManager';

export default {
  components: {
    SubPage,
    EditManager
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
      this.$router.push( { path: '/storePart/manager' });
    },
    refreshData() {
      this.$emit('fetchMangerList')
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
