import * as AuthApi from 'api/auth';
import {
  axiosClient
} from 'common/axiosClient';

import {
  removeToken,
  getToken,
  setToken,
} from 'common/utils';

const auth = {
  state: {
    token: '',
    permissionList: [], // 权限树
    isLogin: false,
    activeRouteName: 'home',
    userInformation: {},
    allSystemMessages: [],
    operatorSystemMessages: [], // 运营
    seviceSystemMessages: [], // 客服
    noticeSystemMessages: [] // 通知(公共)
  },
  actions: {
    login({
      commit,
      state
    }, payload) {
      return new Promise((resolve, reject) => {
        AuthApi.login(payload)
          .then(res => {
            if (res.data.code != 200) {
              reject(res.data.message ? res.data.message : '服务器或网络异常');
              return;
            }
            // 返回中的data
            setToken(res.data.data.userManager.token);
            commit('setLogin', res.data.data.userManager);
            commit('SET_TOKEN', res.data.data.userManager.token)
            commit('SET_RULES', res.data.data.permissionList);
            // commit('SET_RULES', [1]);
            // axiosClient.defaults.headers.common['token'] = '111';
            axiosClient.defaults.headers.common['token'] = res.data.data.userManager.token;
            axiosClient.defaults.headers.common['userId'] = state.userInformation.id;
            resolve(res.data.data);
          })
          .catch(error => {
            reject('服务器或网络异常');
            // console.log(error);
          });
      });
    },
    getSystemMessages({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        AuthApi.getSystemMessages(payload)
          .then(res => {
            if (res.data.code == 200) {
              if (!payload.noticeType) {
                // 全部
                commit('setAllSystemMessages', res.data.data);
              }
              if (payload.noticeType == 1) {
                // 公共(通知)
                commit('setNoticeSystemMessage', res.data.data);
              }
              if (payload.noticeType == 2) {
                // 客服
                commit('setSeviceSystemMessages', res.data.data);
              }
              if (payload.noticeType == 3) {
                // 运营
                commit('setOperatorSystemMessages', res.data.data);
              }
              resolve();
              return;
            } else {
              reject('获取消息失败');
              return;
            }
          })
          .catch(error => {
            // console.log(error);
            reject('获取消息失败');
          });
      });
    },
    markAllAsRead({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        AuthApi.markAllAsRead(payload).then((res) => {
          // console.log(res);
          resolve();
        }).catch((error) => {
          // console.log(error);
          reject();
        })
      })
    },
    // 拉取用户信息, 获得权限树
    getUserInfo({
      commit,
      state
    }, payload) {
      return new Promise((resolve, reject) => {
        AuthApi.getUserPermission({token: getToken()}).then( (res) => {
          if (res.data.code == 200 && res.data.data && res.data.data.length != 0) {
            commit('SET_RULES', res.data.data);
            resolve()
          } else {
            reject();
          }
          // commit('SET_RULES', [1]);
        }).catch( () => {
          reject();
        })
      })
    },

    // 前端登出
    Fedout({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        if (getToken()) {
          removeToken();
        }
        commit('logout');
        commit('SET_TOKEN', '')
        commit('SET_RULES', [])
        resolve();
      })
    }

  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_RULES: (state, roles) => {
      state.permissionList = roles;
    },
    setLogin(state, payload) {
      state.isLogin = true;
      Object.assign(state, {
        userInformation: payload
      });
    },
    setActiveRouteName(state, payload) {
      state.activeRouteName = payload;
    },
    logout(state, payload) {
      localStorage.removeItem('userInformation');
      state.isLogin = false;
    },
    setAllSystemMessages(state, payload) {
      state.allSystemMessages = payload;
    },
    setNoticeSystemMessage(state, payload) {
      state.noticeSystemMessages = payload;
    },
    setSeviceSystemMessages(state, payload) {
      state.seviceSystemMessages = payload;
    },
    setOperatorSystemMessages(state, payload) {
      state.operatorSystemMessages = payload;
    }
  }
};

export {
  auth
};
