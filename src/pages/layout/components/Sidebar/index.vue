<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened="true">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers'])
  }
};
</script>

<style lang="scss" scoped>
.admin_name {
  height: 50px;
  width: 100%; 
  background-color: blue;
  // color: white;
}
</style>

