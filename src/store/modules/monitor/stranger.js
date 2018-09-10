import * as StangerApi from 'api/monitor/stranger';

import * as CommonApi from 'common/common';
//getStrangerDetailList
const stranger = {
  state: {
    strangerList: [],
    strangerDetailList: [],
    errorDropdownStoreList: [],
    pageSize: 10, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    strangerIsFetchingData: false,
  },
  actions: {
    getStrangerList({
      commit
    }, payload) {
      // commit('setStrangereIsFetchingData', true);
      return new Promise((resolve, reject) => {
        StangerApi.getStrangerList(payload).then((res) => {
          // console.log(res);
          if (!res || !res.data) {
            commit('setStrangereIsFetchingData', false);
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setStrangerList', list);
          commit('setErrorPagination', res.data.data);
          // commit('setStrangerIsFetchingData', false);
          resolve();
        }).catch((error) => {
          // console.log(error);
          // commit('setStrangerIsFetchingData', false);
          reject();
        })
      })
    },
    getStrangerDetailList({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        StangerApi.getStrangerDetailList(payload).then((res) => {
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data;
          commit('getStrangerDetail', list);
          resolve();
        }).catch( () => {
          reject();
        })
      })
    },
    getErrorDropDownStoreList({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        CommonApi.getDropDownStoreList(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            let params = res.data.data.list;
            commit('getErrorDropdownStoreList', params);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
  },
  mutations: {
    setStrangerList(state, payload) {
      state.strangerList = payload;
    },
    getStrangerDetail(state, payload) {
      state.strangerDetailList = payload;
    },
    getErrorDropdownStoreList(state, payload) {
      state.errorDropdownStoreList = payload;
    },
    setErrorPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
  }
}

export {
  stranger
}
