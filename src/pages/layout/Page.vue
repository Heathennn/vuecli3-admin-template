<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <nav-bar></nav-bar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import Navbar from './components/NavBar'

import Sidebar from './components/Sidebar/index'

import AppMain from './components/AppMain';
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  components: {
    'nav-bar': Navbar,
    Sidebar,
    AppMain
  },
  // mixins: [ResizeMixin],
  computed: {
    // sidebar() {
    //   return this.$store.state.app.sidebar
    // },
    // device() {
    //   return this.$store.state.app.device
    // },
    // classObj() {
    //   return {
    //     hideSidebar: !this.sidebar.opened,
    //     withoutAnimation: this.sidebar.withoutAnimation,
    //     mobile: this.device === 'mobile'
    //   }
    // }
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/assets/style/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
