import * as CodeApi from 'api/configuration/errorCode';
const errorCode = {
  state: {
    errorCodeList: [],
    unclassifiedErrorCodeList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingErrorCodeData: false
  },
  actions: {
    getErrorCodeList({ commit }, payload) {
      commit('setIsFetchingErrorCodeData', true);
      return new Promise((resolve, reject) => {
        CodeApi.getCodeList(payload)
          .then(res => {
            if (!res || !res.data || res.data.code != 200) {
              commit('setIsFetchingErrorCodeData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            // console.log('异常代码列表', list);
            if (payload.classifySign == 2) {
              // 已分类
              commit('setClassifiedErrorCodePagination', res.data.data);
              commit('getErrorCodeList', list);
            }
            if (payload.classifySign == 1) {
              // 未分类
              // commit('setSportOrderPagination', res.data.data);
              commit('getUnClassifiedErrorCodeList', list);
            }
            commit('setIsFetchingErrorCodeData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingErrorCodeData', false);
            reject();
          });
      });
    },
    getExceptionSync({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        CodeApi.getExceptionSync(payload).then( (res) => {
          if (res.data.code === 200) {
            resolve();
            return;
          }
          reject();
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    setClassifiedErrorCodePagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 0 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingErrorCodeData(state, payload) {
      state.isFetchingErrorCodeData = payload;
    },
    getErrorCodeList(state, payload) {
      state.errorCodeList = payload;
    },
    getUnClassifiedErrorCodeList(state, payload) {
      state.unclassifiedErrorCodeList = payload;
    }
  }
};

export { errorCode };
