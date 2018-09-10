import * as DepositApi from 'api/finance/userDeposit';

//getDepositDetailList
const userDeposit = {
  state: {
    depositList: [], //已交押金
    depositRefundList: [], //已退押金
    depositDetailList: [],//已交押金明细
    isFetchingUserDepositData: false,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
  },
  actions: {
    getDepositList({ commit }, payload) {
      commit('setIsFetchingUserDepositData', true);
      return new Promise((resolve, reject) => {
        DepositApi.getDepositList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setIsFetchingUserDepositData', false);
              reject();
              return;
            }
            let list = res.data.data;
            commit('getDepositList', list);
            commit('setIsFetchingUserDepositData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingUserDepositData', false);
            reject();
          });
      });
    },
    // 已退押金
    getDepositRefundList({ commit }, payload) {
      DepositApi.getDepositRefundList(payload)
        .then(res => {
          // console.log('已退押金列表',res);
          if (!res || !res.data) {
            return;
          }
          let list = res.data.data;
          commit('getDepositRefund', list);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    // 已交押金明细
    getDepositDetailList({ commit }, payload) {
      return new Promise((resolve, reject) => {
      DepositApi.getDepositDetailList(payload)
        .then(res => {
          // console.log( res);
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('getDepositDetail', list);
          commit('setDepositPagination', res.data.data);
          resolve();
        })
        .catch(error => {
          // console.log(error);
          reject();
        });
      })
    },
    // 已退押金明细
    getDepositListConsume({
      commit
    }, payload) {
      DepositApi.getDepositListConsume(payload).then( (res) => {
        // console.log('用户已退押金明细列表', res)
      }) 
    }
  },
  mutations: {
    getDepositList(state, payload) {
      state.depositList = payload;
    },
    getDepositRefund(state, payload) {
      state.depositRefundList = payload;
    },
    getDepositDetail(state, payload) {
      state.depositDetailList = payload;
    },
    setIsFetchingUserDepositData(state, payload) {
      state.isFetchingUserDepositData = payload;
    },
    setDepositPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
  }
};

export { userDeposit };
