import * as UserTopApi from 'api/user/userTop';

import * as CommonApi from 'common/common';

export const userTop = {
  state: {
    dropdownStoreList: []
  },
  actions: {
    getDropDownStoreList({ commit }, payload) {
      CommonApi.getDropDownStoreList(payload)
        .then(res => {
          if (!res || !res.data) {
            return;
          }
          let params = res.data.data.list;
          commit('getDropdownStoreList', params);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    getUserTopList({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        UserTopApi.getUserTopList(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
        }).catch( () => reject('获取数据失败'))
      })
    }
  },
  mutations: {
    getDropdownStoreList(state, storeList) {
      state.dropdownStoreList = storeList;
    }
  }
}
