import { constantRouterMap, asyncRouterMap } from 'router/index';

/**
 * 为已写好的前端路由配置页面内的权限(单纯添加, 不考虑有无页面的权限)
 * 每次为一组菜单添加
 * @param asyncRouterMap 全部路由表
 * @param permissionList 全部可用权限
 */
function addRoutePermission(asyncRouterMap, permissionList) {
  // let asyncRouters = JSON.parse(JSON.stringify(asyncRouterMap))
  asyncRouterMap.forEach(route => {
    // 第一级权限
      let currentPermission = getPermissionItem(permissionList, route);
      if (!currentPermission) return;
      if (route.meta.noChild) { // 只有一级
        route.children[0].meta.roles = currentPermission.menuList
      } else {
        route.children.forEach(childRoute => { 
          // 第二级权限
          let childPermission = getPermissionItem(currentPermission.menuList, childRoute);
          if(!childPermission) return;
          if(!childRoute.children || childRoute.children.length == 0) { // 没有第三级路由
            childRoute.meta.roles = childPermission.menuList;
          } else { // 第三级路由
            childRoute.children.forEach( (thirdRoute) => {
              // 第三级权限
              let thirdPermission = getPermissionItem(childPermission.menuList, thirdRoute);
              if (!thirdPermission) return;
              thirdRoute.meta.roles = thirdPermission.menuList
            })
          }
        })
      }
      // console.log(route)
    })
    // console.log(asyncRouterMap)
}

/**
 * 获取正在匹配的权限
 * @param permissionList 权限列表
 * @param route 路由 (单个)
 */
function getPermissionItem(permissionList, route) {
  if(!permissionList) return null;
  let item = permissionList.find( (item) => item.resource == route.meta.resource);
  return item;
}

/**
 * 通过resource判断是否具有该路由的权限 (单个路由)
 * @param permissionList 权限列表
 * @param route 路由 
 */
function hasPermission(permissionList, route) {
  // route是否配置resource
  let hasResource = route.meta.resource;
  let permissionItem = getPermissionItem(permissionList, route)
  // 判断是否有权限
  if ((hasResource && permissionItem && permissionItem.isPermission == 1) || route.meta.alwaysShow) {
    return true;
  } else {
    return false;
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 全部路由表
 * @param permissionList 全部可用权限
 */
function filterAsyncRouter(asyncRouterMap, permissionList) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // 判断当前路由是否具有权限, 推入一个新的数组
    if (hasPermission(permissionList, route)) {
      // 当前权限
      let currentPermission = getPermissionItem(permissionList, route);
      // 当前路由具有子路由
      if (route.children && route.children.length > 1 && currentPermission) {
        route.children = filterAsyncRouter(route.children, currentPermission.menuList)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap, // 已有路由
    addRouters: [], // 根据权限获取的路由
  },
  getters: {
    permission: (state, getters, rootState) => {
      return rootState.auth.permissionList
    }
  },
  actions: {
    generateRoutes({ commit, getters }, payload) {
      return new Promise( (resolve, reject) => {
        // 添加所有的权限
        addRoutePermission(asyncRouterMap, getters.permission);
        // 过滤权限菜单, 按钮级别的权限在页面内手动添加
        let accessedRouters = filterAsyncRouter(asyncRouterMap, getters.permission);
        // console.log(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve()
      })
    }
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  }
}

export default permission