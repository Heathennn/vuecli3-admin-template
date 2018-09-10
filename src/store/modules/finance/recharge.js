import * as RechargeApi from 'api/finance/recharge';

const recharge = {
  state: {
    rechargeList: [],
    rechargeTotal: [],
    rechargeDetailList: [],
    isFetchingRechargeData: false,
    isFetchingRechargeDetailData: false,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
  },
  actions: {
    getRechargeList({ commit }, payload) {
      commit('setIsFetchingRechargeData', true);
      return new Promise((resolve, reject) => {
        RechargeApi.getRechargeList(payload)
          .then(res => {
            // console.log(res);
            if (!res || !res.data) {
              commit('setIsFetchingRechargeData', false);
              reject();
              return;
            }
            let list = res.data.data;
            commit('getRecharge', list);
            commit('setIsFetchingRechargeData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingRechargeData', false);
            reject();
          });
      });
    },
    // 充值明细
    getRechargeDetailList({ commit }, payload) {
      commit('setIsFetchingRechargeDetailData', true);
      return new Promise((resolve, reject) => {
        RechargeApi.getRechargeDetailList(payload)
          .then(res => {
            // console.log(res);
            if (!res || !res.data) {
              commit('setIsFetchingRechargeDetailData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('getRechargeDetail', list);
            commit('setRechargeDetailPagination', res.data.data);
            commit('setIsFetchingRechargeDetailData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingRechargeDetailData', false);
            reject();
          });
      });
    }
  },
  mutations: {
    setIsFetchingRechargeData(state, payload) {
      state.isFetchingRechargeData = payload;
    },
    setIsFetchingRechargeDetailData(state, payload) {
      state.isFetchingRechargeDetailData = payload;
    },
    getRecharge(state, payload) {
      state.rechargeList = payload;
      let totalUser = 0;
      let totalTimes = 0;
      let totalMoney = 0;
      let totalType = payload.length;
      payload.forEach((item, index) => {
         totalMoney += parseInt(item.rechargeMoneyTotal)
         totalUser += item.rechargeUserTotal;
         totalTimes += item.rechargeTotal;
      });
      totalMoney = (totalMoney / 100).toFixed(2);
      state.rechargeTotal = [{
        totalType: totalType,
        totalUser: totalUser,
        totalTimes: totalTimes,
        totalMoney: totalMoney
      }]
    },
    getRechargeDetail(state, payload) {
      state.rechargeDetailList = payload;
    },
    setRechargeTotal(state, payload) {
      state.rechargeTotal = payload;
    },
    setRechargeDetailPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
  }
};

export { recharge };
