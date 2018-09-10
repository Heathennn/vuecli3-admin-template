import * as IncomeApi from 'api/finance/income';
//getIncomeDetailList
const income = {
  state: {
    incomeList: [],
    incomeTotalList: [],
    incomeDetailList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingIncomeData: false
  },
  actions: {
    getIncomeList({ commit }, payload) {
      commit('setIsFetchingIncomeData', true);
      return new Promise((resolve, reject) => {
        IncomeApi.getIncomeList(payload)
          .then(res => {
            // console.log(res);
            if (!res || !res.data) {
              commit('setIsFetchingIncomeData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('setSportOrderPagination', res.data.data);
            commit('getIncomes', list);
            commit('setIncomePagination', res.data.data);
            commit('setIsFetchingIncomeData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingIncomeData', false);
            reject();
          });
      });
    },
    // 综合统计
    getIncomeTotalList({ commit }, payload) {
      IncomeApi.getIncomeTotalList(payload)
        .then(res => {
          // console.log(res);
          if (!res || !res.data) {
            return;
          }
          let list = res.data.data;
          commit('getIncomeTotal', [list]);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //后台收入订单明细
    getIncomeDetailList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        IncomeApi.getIncomeDetailList(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('getIncomeDetail', list);
            resolve(res.data.data);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    }
  },
  mutations: {
    setIncomePagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingIncomeData(state, payload) {
      state.isFetchingIncomeData = payload;
    },
    getIncomes(state, payload) {
      state.incomeList = payload;
    },
    getIncomeTotal(state, payload) {
      state.incomeTotalList = payload;
    },
    getIncomeDetail(state, payload) {
      state.incomeDetailList = payload;
    }
  }
};

export { income };
