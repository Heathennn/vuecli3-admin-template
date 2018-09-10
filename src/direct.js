import Vue from 'vue'
/**
 * 自定义权限指令 v-permission
 */
export const permission = Vue.directive('permission', {
  bind: function (el, resource, vnode) {
    // 获取按钮权限列表
    let roles = vnode.context.$route.meta.roles;
    
    // 获取当前权限
    let permissionItem = Vue.prototype.$_getPermission(roles, resource);
    if (!permissionItem || !permissionItem.isPermission || permissionItem.isPermission != 1) {
      Vue.prototype.$nextTick( () => {
        el.parentNode.removeChild(el);
      })
    }
  }
});

Vue.prototype.$_getPermission = function (permissionList, resource) {
  // 查找resource
  let _item = null;
  if (!permissionList || permissionList.length < 1) return;
  for (let item of permissionList) {
    if (item.resource === resource.value){
      _item = item;
    } else if (item.menuList){
      let _deep = Vue.prototype.$_getPermission(item.menuList, resource);
      if (_deep) _item = _deep
    }
  }
  return _item;
};
