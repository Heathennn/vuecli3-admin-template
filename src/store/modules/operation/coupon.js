import * as CouponApi from 'api/operation/coupon';

const coupon = {
  state: {
    couponList: [],
    pageSize: 10, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingData: false,
  },
  actions: {
    getCouponList({
      commit
    }, payload) {
      commit('setIsFetchingData', true)
      return new Promise( (resolve, reject) => {
        CouponApi.getCouponList(payload).then( (res) => {
          // console.log(res);
          if (!res || !res.data) {
            commit('setIsFetchingData', false)
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setCouponList', list);
          commit('setCouponPagination', res.data.data);
          commit('setIsFetchingData', false)
          resolve();
        }).catch( (error) => {
          // console.log(error);
          commit('setIsFetchingData', false)
          reject()
        })
      })
    }
  },
  mutations: {
    setCouponList(state, payload) {
      state.couponList = payload;
    },
    setCouponPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    }
  }
}

export {
  coupon
}