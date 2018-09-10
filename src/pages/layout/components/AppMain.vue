<template>
  <section class="app-main" style="min-height: 100%">
    <fade mode="out-in">
      <keep-alive :exclude="noCached">
        <router-view></router-view>
      </keep-alive>
    </fade>
  </section>
</template>

<script>
import Fade from 'components/transitions/Fade';

export default {
  name: 'AppMain',
  data() {
    return {
      noCached: ['addBulletin', 'historyBulletin','userDetail', 'auditDetail', 'sportOrderDetail', 'courseBase', 'personnelConfig', 'auditDeposit', 'difficultyConfig', 'historyMessage','role', 'roleConfig', 'planDetail', 'storeStatus', 'userSportDetail']
    }
  },
  components: {
    Fade
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  }
}
</script>
