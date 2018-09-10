import * as ChannelsApi from 'api/finance/channels';

const channels = {
  state: {
    channelsList: [],
    channelsRefundList : []
  },
  actions: {
    getChannelsList({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        ChannelsApi.getChannelsList(payload).then((res) => {
          // console.log(res.data.data);
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data;
          commit('getChannels', list);
          resolve();
        }).catch((error) => {
          // console.log(error);
          reject();
        })
      })
    },
    getChannelsRefundList({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        ChannelsApi.getChannelsRefundList(payload).then((res) => {
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data;
          commit('getChannelsRefund', list);
          resolve();
        }).catch((error) => {
          // console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    getChannels(state, payload) {
      state.channelsList = payload;
    },
    getChannelsRefund(state, payload) {
      state.channelsRefundList = payload;
    }
  }
}

export {
  channels
}
