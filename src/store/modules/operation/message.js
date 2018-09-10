import * as MessageApi from 'api/operation/message';

const message = {
  state: {
    messageList: [],
    pageSize: 10, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingData: false,
    checkingMessageDetail: {}
  },
  actions: {
    getMessageList({ commit }, payload) {
      commit('setMessageIsFetchingData', true);
      return new Promise((resolve, reject) => {
        MessageApi.getMessageList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setMessageIsFetchingData', false);
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('setMessagePagination', res.data.data);
            commit('getMessageList', list);
            commit('setMessageIsFetchingData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setMessageIsFetchingData', false);
            reject();
          });
      });
    },
    getMessageDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        MessageApi.getMessageDetail(payload)
          .then(res => {
            if (!res || !res.data || res.data.code != 200) {
              reject('获取消息详情失败');
              return;
            }
            let detail = res.data.data;
            commit('setCheckingMessageDetail', detail);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setCheckingMessageDetail', null);
            reject('获取消息详情失败');
          });
      });
    },
    sendMessages({ commit }, payload) {
      return new Promise((resolve, reject) => {
        MessageApi.sendMessage(payload)
          .then(res => {
            // console.log(res);
            if (res.data.code == 200) {
              resolve();
              return;
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    }
  },
  mutations: {
    getMessageList(state, payload) {
      state.messageList = payload;
    },
    setMessagePagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setMessageIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    },
    setCheckingMessageDetail(state, payload) {
      state.checkingMessageDetail = payload;
    }
  }
};

export { message };
