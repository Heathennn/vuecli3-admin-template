import * as AbnormalOrderApi from 'api/service/abnormalOrder';

import * as CommonApi from 'common/common';

const abnormalOrder = {
  state: {
    abnormalOrderList: [],
    abnormalOrderDropDownList: [],
    isFetchingAbnormalOrderData: false,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
  },
  actions: {
    getAbnormalOrderList({ commit }, payload) {
      commit('setIsFetchingAbnormalOrderData', true);
      return new Promise( (resolve, reject) => {
        AbnormalOrderApi.getAbnormalOrderList(payload)
          .then(res => {
            // console.log(res);
            commit('getAbnormalOrderList', res.data.data.list);
            commit('setIsFetchingAbnormalOrderData', false);
            commit('setAbnormalOrderPagination', res.data.data);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingAbnormalOrderData', false);
            reject();
          });
      })
    },
    getAbnormalOrderDropDownStoreList({
      commit
    }, payload) {
      CommonApi.getDropDownStoreList(payload).then( (res) => {
        commit('setAbnormalOrderDropDownList', res.data.data.list);
      }).catch( (error) => {
        // console.log(error);
      })
    },
    getAbnormalOrderDetail({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        AbnormalOrderApi.getAbnormalOrderDetail(payload).then( (res) => {
          // console.log(res);
          resolve(res.data.data);
          return;
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    getAbnormalOrderList(state, payload) {
      state.abnormalOrderList = payload;
    },
    setAbnormalOrderDropDownList(state, payload) {
      state.abnormalOrderDropDownList = payload;
    },
    setAbnormalOrderPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingAbnormalOrderData(state, payload) {
      state.isFetchingAbnormalOrderData = payload
    }
  }
};

export { abnormalOrder };
