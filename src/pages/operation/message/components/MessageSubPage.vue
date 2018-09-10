<template>
  <sub-page v-if="subPageInfo"
            key="1"
            mainTitle="消息管理"
            subTitle="新建消息"
            :routeCallback="routeCallback">
    <create-message v-if="subPageType === 'createMessage'"
                    @refreshMessageList="refreshMessageList"></create-message>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import CreateMessage from './CreateMessage';

export default {
  components: {
    SubPage,
    CreateMessage
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
  },
  methods: {
    routeCallback() {
      this.$router.push( { path: '/operation/message' });
    },
    refreshMessageList() {
      this.$emit('refreshMessage');
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
