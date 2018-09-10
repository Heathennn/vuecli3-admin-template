import * as shopsOrderApi from 'api/order/shopsOrder';

import * as CommonApi from 'common/common';
//getOrderDetailList
const shopsOrder = {
  state: {
    shopsOrderList: [],
    OrderDetailList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    shopsOrderIsFetchingData: false,
    errorDropdownStoreList: [],
  },
  actions: {
    getShopsOrderList({
      commit
    }, payload) {
      commit('setShopsOrderIsFetchingData', true);
      return new Promise((resolve, reject) => {
        shopsOrderApi.getShopsOrderList(payload).then((res) => {
          // console.log(res);
          if (!res || !res.data) {
            commit('setShopsOrderIsFetchingData', false);
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setSportOrderPagination', res.data.data);
          commit('getShopsOrder', list);
          commit('setShopsOrderIsFetchingData', false);
          resolve();
        }).catch((error) => {
          // console.log(error)
          commit('setShopsOrderIsFetchingData', false);
          reject();
        })
      })
    },
    // 售货机列表详情
    getOrderDetailList({
      commit
    }, payload) {
      shopsOrderApi.getOrderDetailList(payload).then((res) => {
        // console.log(res);
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getOrderDetail', list);
      }).catch((error) => {
        // console.log(error)
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
    setSportOrderPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    getShopsOrder(state, payload) {
      state.shopsOrderList = payload;
    },
    getOrderDetail(state, payload) {
      state.orderDetailList = payload;
    },
    setShopsOrderIsFetchingData(state, payload) {
      state.shopsOrderIsFetchingData = payload;
    },
    getErrorDropdownStoreList(state, payload) {
      state.errorDropdownStoreList = payload;
    },
  }
}

export {
  shopsOrder
}
