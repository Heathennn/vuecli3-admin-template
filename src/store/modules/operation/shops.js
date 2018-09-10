import * as ShopsApi from 'api/operation/shops';

const shops = {
  state: {
    shopsList: [],
    goodsList: [],
    pageSize1: 10, // 每页条数(传入) size(实际每页条数)
    pageNum1: 1, // 当前页数
    pages1: 0, // 总页数
    total1: 0, // 总条数
    isFetchingShopsDetailData: false,
    pageSize2: 10, // 每页条数(传入) size(实际每页条数)
    pageNum2: 1, // 当前页数
    pages2: 0, // 总页数
    total2: 0, // 总条数
    isFetchingData2: false
  },
  actions: {
    getShopsList({ commit }, payload) {
      commit('setIsFetchingData1', true);
      ShopsApi.getShopsList(payload)
        .then(res => {
          if (!res || !res.data) {
            commit('setIsFetchingData1', false);
            return;
          }
          // console.log(res)
          let list = res.data.data;
          commit('getShopsList', list);
          commit('setIsFetchingData1', false);
          // commit('setShopsPagination', res.data.data)
          // console.log(list);
        })
        .catch(error => {
          // console.log(error);
          commit('setIsFetchingData1', false);
        });
    },
    getGoodsList({ commit }, payload) {
      commit('setIsFetchingData2', true);
      return new Promise((resolve, reject) => {
        ShopsApi.getGoodsList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setIsFetchingData2', false);
              reject();
              return;
            }
            // console.log(res);
            let list = res.data.data.list;
            commit('setGoodsPagination', res.data.data);
            commit('getGoodsList', list);
            commit('setIsFetchingData2', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingData2', false);
            reject();
          });
      });
    },
    getShopDetailList({ // 获取售货机商品详情
      commit
    }, payload) {
      if (this.isFetchingShopsDetailData) return; 
      commit('setIsFetchingShops', true);
      return new Promise( (resolve, reject) => {
        ShopsApi.getShopGoodList(payload).then( (res) => {
          // console.log('售货机商品详情',res);
          resolve(res.data.data);
          commit('setIsFetchingShops', false)
        }).catch( (error) => {
          console.log(error);
          commit('setIsFetchingShops', false)
          reject();
        }) 
      })
    },
    saveGoodInfo({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        ShopsApi.saveGoodInfo(payload).then( (res) => {
          // console.log(res);
          resolve();
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    getShopsList(state, payload) {
      state.shopsList = payload;
    },
    getGoodsList(state, payload) {
      state.goodsList = payload;
    },
    setShopsPagination(state, payload) {
      state.pageSize1 = payload.pageSize;
      state.pageNum1 = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total1 = payload.total;
      state.pages1 = payload.pages;
    },
    setGoodsPagination(state, payload) {
      state.pageSize2 = payload.pageSize;
      state.pageNum2 = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total2 = payload.total;
      state.pages2 = payload.pages;
    },
    setIsFetchingData1(state, payload) {
      state.isFetchingData1 = payload;
    },
    setIsFetchingShops(state, payload) {
      state.isFetchingShopsDetailData = payload;
    },
    setIsFetchingData2(state, payload) {
      state.isFetchingData2 = payload;
    }
  }
};

export { shops };
