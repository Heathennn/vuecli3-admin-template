import * as WalletApi from 'api/finance/userWallet';
//getWalletRechargeList
// getWalletConsumeList
// getWalletRefundList//退款
// getWalletCouponList 优惠券
const userWallet = {
  state: {
    userWalletList: [],
    walletRechargeList: [], //充值
    walletConsumeList: [], //消费
    walletRefundList: [], //退款
    walletCouponList: [], // 优惠券
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingUserWalletData: false,
  },
  actions: {
    getUserWalletList({
      commit
    }, payload) {
      commit('setIsFetchingUserWalletData', true);
      return new Promise( (resolve, reject) => {
        WalletApi.getWalletList(payload).then((res) => {
          // console.log('用户钱包首页列表',res)
          if (!res || !res.data) {
            commit('setIsFetchingUserWalletData', false);
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setUserWalletPagination', res.data.data);
          commit('setUserWalletList', list);
          commit('setIsFetchingUserWalletData', false);
          resolve();
        }).catch((error) => {
          // console.log(error);
          commit('setIsFetchingUserWalletData', false);
          reject();
        })
      })
    },
    // 用户钱包总计
    getUserWalletDetail({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        WalletApi.getUserWalletDetail(payload).then((res) => {
          // console.log('总计',res)
          if (!res || !res.data) {
            reject();
            return;
          }
          let detail = res.data.data;
          // commit('setUserWalletList', detail);
          resolve(detail);
        }).catch((error) => {
          // console.log(error);
          reject();
        })
      })
    },
    // 充值
    getWalletRechargeList({
      commit
    }, payload) {
      WalletApi.getWalletRechargeList(payload).then((res) => {
        // console.log('充值', res);
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getWalletRecharge', list);
      }).catch((error) => {
        // console.log(error)
      })
    },
    // 消费
    getWalletConsumeList({
      commit
    }, payload) {
      WalletApi.getWalletConsumeList(payload).then((res) => {
        // console.log('消费',res)
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getWalletConsume', list);
      }).catch((error) => {
        // console.log(error)
      })
    },
    // 退款
    getWalletRefundList({
      commit
    }, payload) {
      WalletApi.getWalletRefundList(payload).then((res) => {
        // console.log("退款",res)
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getWalletRefund', list);
      }).catch((error) => {
        // console.log(error)
      })
    },
    // 优惠券
    getWalletCouponList({
      commit
    }, payload) {
      WalletApi.getWalletCouponList(payload).then((res) => {
        // console.log("优惠券",res)
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getWalletCoupon', list);
      }).catch((error) => {
        // console.log(error)
      })
    },
  },
  mutations: {
    setUserWalletPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingUserWalletData(state, payload) {
      state.isFetchingUserWalletData = payload;
    },
    setUserWalletList(state, payload) {
      state.userWalletList = payload;
    },
    getWalletRecharge(state, payload) {
      state.walletRechargeList = payload;
    },
    getWalletConsume(state, payload) {
      state.walletConsumeList = payload;
    },
    getWalletRefund(state, payload) {
      state.walletRefundList = payload;
    },
    getWalletCoupon(state, payload) {
      state.walletCouponList = payload;
    }
  }
}

export {
  userWallet
}
