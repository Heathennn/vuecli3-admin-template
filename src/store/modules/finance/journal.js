import * as JournalApi from 'api/finance/journal';

const journal = {
  state: {
    journalList: [],
    CollectList: [],
    isFetchingJournalData:  false,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
  },
  actions: {
    getJournalList({
      commit
    }, payload) {
      commit('setIsFetchingJournalData', true);
      return new Promise( (resolve, reject) => {
        JournalApi.getJournalList(payload).then((res) => {
          // console.log(res);
          if (!res || !res.data) {
            commit('setIsFetchingJournalData', false);
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('getJournal', list);
          commit('setJournalPagination', res.data.data);
          commit('setIsFetchingJournalData', false);
          resolve();
        }).catch((error) => {
          commit('setIsFetchingJournalData', false);
          // console.log(error)
          reject();
        })
      })
    },
    getCollectList({
      commit
    }, payload) {
      JournalApi.getCollectList(payload).then((res) => {
        // console.log(res.data.data);
        if (!res || !res.data) {
          return;
        }
        let tableData = [];
        let list = res.data.data;
        tableData.push(list);
        commit('getCollect', tableData);
        return {};
      }).catch((error) => {
        // console.log(error)
      })
    }
  },
  mutations: {
    getJournal(state, payload) {
      state.journalList = payload;
    },
    getCollect(state, payload) {
      state.CollectList = payload;
    },
    setJournalPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingJournalData(state, payload) {
      state.isFetchingJournalData = payload;
    }
  }
}

export {
  journal
}
