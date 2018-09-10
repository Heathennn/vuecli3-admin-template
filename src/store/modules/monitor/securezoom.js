import * as SecurezoomApi from 'api/monitor/securezoom';

import * as CommonApi from 'common/common';
//getMonitorDetailList 查看明细
const securezoom = {
  state: {
    monitorList: [],
    monitorDetailList: [],
    errorDropdownStoreList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
  },
  actions: {
    getMonitorList({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        SecurezoomApi.getMonitorList(payload).then((res) => {
          // console.log(res);
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setSecrezoomPagination', res.data.data);
          commit('getMonitor', list);
          resolve();
        }).catch((error) => {
          reject();
        })
      })
    },
    //门店列表
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
    //查看明细
    getMonitorDetailList({
      commit
    }, payload) {
      SecurezoomApi.getMonitorDetailList(payload).then((res) => {
        // console.log(res);
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data;
        commit('getMonitorDetail', list);
      })
    }
  },
  mutations: {
    getMonitor(state, payload) {
      state.monitorList = payload;
    },
    getMonitorDetail(state, payload) {
      state.monitorDetailList = payload;
    },
    setSecrezoomPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    getErrorDropdownStoreList(state, payload) {
      state.errorDropdownStoreList = payload;
    }
  }
}

export {
  securezoom
}
