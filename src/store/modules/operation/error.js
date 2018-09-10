import * as ErrorApi from 'api/operation/error';

import * as CommonApi from 'common/common';

const error = {
  state: {
    errorList: [],
    pageSize: 10, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingData: false,
    errorDropdownStoreList: []
  },
  actions: {
    getErrorList({ commit }, payload) {
      commit('setIsFetchingData', true);
      return new Promise((resolve, reject) => {
        ErrorApi.getErrorList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setIsFetchingData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('getErrorList', list);
            commit('setErrorPagination', res.data.data);
            commit('setIsFetchingData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingData', false);
            reject();
          });
      });
    },
    getErrorDropDownStoreList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        CommonApi.getStores(payload)
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
    getErrorDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ErrorApi.getErrorDetail(payload)
          .then(res => {
            // console.log('异常信息',res)
            resolve(res.data.data);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getErrorProcessStream({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ErrorApi.getErrorProcessStream(payload)
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            // console.log(error)
          });
      });
    },
    getErrorInfoList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ErrorApi.getErrorInfoList(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
        }).catch( (error) => {
          reject('获取数据失败');
        })
      })
    },
    addErrorLog({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        ErrorApi.addErrorLog(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '操作失败');
            return;
          }
          resolve();
        }).catch( (error) => {
          reject('操作失败')
        })
      })
    }
  },
  mutations: {
    getErrorList(state, payload) {
      state.errorList = payload;
    },
    setErrorPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    getErrorDropdownStoreList(state, payload) {
      state.errorDropdownStoreList = payload;
    },
    setIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    }
  }
};

export { error };
