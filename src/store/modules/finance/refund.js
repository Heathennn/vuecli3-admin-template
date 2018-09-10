import * as RefundApi from 'api/finance/refund';

const refund = {
  state: {
    refundList: [],

  },
  actions: {
    getRefundList({
      commit
    }, payload) {
      RefundApi.getRefundList(payload).then((res) => {
        // console.log(res);
        if (!res || !res.data) {
          return;
        }
        let list = res.data.data.list;
        commit('getRefund', list);
      }).catch((error) => {
        // console.log(error)
      })
    }
  },
  mutations: {
    getRefund(state, payload) {
      state.refundList = payload;
    }
  }
}

export {
  refund
}
