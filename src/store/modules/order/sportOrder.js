import * as sportOrderApi from 'api/order/sportOrder';

import * as CommonApi from 'common/common';
// getSportDetailList
const sportOrder = {
  state: {
    sportOrderList: [],
    sportDetailList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingUserWalletData: false,
    errorDropdownStoreList: [],
  },
  actions: {
    getSportOrderList({
      commit
    }, payload) {
      commit('setIsFetchingUserWalletData', true);
      return new Promise((resolve, reject) => {
        sportOrderApi
          .getSportOrderList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setIsFetchingUserWalletData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('setSportOrderPagination', res.data.data);
            commit('getSportOrder', list);
            commit('setIsFetchingUserWalletData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      })
    },
    // 点击查看详情
    getSportOrderDetail({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        sportOrderApi.getSportDetailList(payload).then(res => {
            // console.log(res);
            if (!res || !res.data) {
              reject(res.data.message || '获取数据失败');
              return;
            }
            resolve(res.data.data);
          })
          .catch(error => {
            reject();
            // console.log(error);
          });
      })
    },
    cancelOrder({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        sportOrderApi.cancelOrder(payload).then((res) => {
          if (res.data.code == 200) {
            resolve();
            return;
          }
          reject(res.data.message || '操作失败');
        }).catch((error) => {
          // console.log(error);
          reject('操作失败');
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
    getOrderOperationLog({commit}, payload) {
      return new Promise( (resolve, reject)  => {
        sportOrderApi.getOrderOperationLog(payload).then((res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
        }).catch( (error) => {
          reject('获取数据失败');
        })
      })
    }
  },
  mutations: {
    setSportOrderPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    getSportOrder(state, payload) {
      state.sportOrderList = payload;
    },
    setIsFetchingUserWalletData(state, payload) {
      state.isFetchingUserWalletData = payload;
    },
    getSportDetail(state, payload) {
      state.sportDetailList = payload;
    },
    getErrorDropdownStoreList(state, payload) {
      state.errorDropdownStoreList = payload;
    },
  }
};

export {
  sportOrder
};
