<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->

    <router-view/>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex';

export default {
  name: 'App',
  created() {
    // let _this = this;
    // // 如果没有登录(vuex)
    // if (!this.isLogin) {
    //   const acessToken = localStorage.getItem('accessToken');
    //   // 本地存储没有token
    //   if (!acessToken) {
    //     this.toLogin(this.$router)
    //     this.$router.push({path: '/login'});
    //   } else {
    //     // 设置用户信息
    //     this.setLogin(res);
    //     return;
    //   }
    // }
  },
  watch: {
    '$route'(to, from) {
      this.setActiveRouteName(to.name);
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin,
      activeRouteName: state => state.auth.activeRouteName
    })
  },
  methods: {
    ...mapMutations(['setLogin'])
  },
  mounted() {
    this.$nextTick( () => {
      
    })
  },
  methods: {
    ...mapMutations(['setActiveRouteName']),
    toLogin(router) {
      if (!router) {
        return;
      }
      const { currentRoute } = router;
      if (currentRoute && currentRoute.name) {
        if (currentRoute.name === 'login') {
          return;
        } else {
          router.replace({
            path: '/login',
            replace: true,
            query: { to: currentRoute.path }
          });
        }
      } else {
        router.replace({ path: '/login', replace: true });
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
