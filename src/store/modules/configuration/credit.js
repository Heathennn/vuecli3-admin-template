import * as CreditApi from 'api/configuration/credit';
// getCreditInfoList
const credit = {
  state: {
    creditList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingCreditList: false
  },
  actions: {
    getCreditList({ commit }, payload) {
      commit('setIsFetchingCreditList', true);
      return new Promise((resolve, reject) => {
        CreditApi.getCreditList(payload)
          .then(res => {
            if (!res || !res.data || res.data.code != 200) {
              commit('setIsFetchingCreditList', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('getCredit', list);
            commit('setCreditPagination', res.data.data);
            commit('setIsFetchingCreditList', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingCreditList', false);
            reject();
          });
      });
    },
    // 编辑
    updateCreditConfig({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        CreditApi.updateCreditConfig(payload).then(res => {
          if (!res || !res.data) {
            reject();
            return;
          }
          if (res.data.code == 200) {
            resolve();
          }
          // console.log(res);
          // commit('setSportOrderPagination', res.data.data);
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    setCreditPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 0 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    getCredit(state, payload) {
      state.creditList = payload;
    },
    
    setIsFetchingCreditList(state, payload) {
      state.isFetchingCreditList = payload;
    }
  }
};

export { credit };
