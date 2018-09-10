import * as ManagerApi from 'api/storePart/manager';

const manager = {
  state: {
    managerList: [],
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    currentManagerDetail: null // 当前编辑的店长信息
  },
  actions: {
    getManagerTable({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ManagerApi.getManagerList(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            let list = res.data.data.list;
            commit('setManagerPagination', res.data.data);
            commit('getManagers', list);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    updateManagerInfo({ commit }, payload) {
      // 更新店长信息
      return new Promise((resolve, reject) => {
        ManagerApi.updateManagerInfo(payload).then(res => {
          // console.log(res);
          if (!res || res.data.code === 400) {
            reject({ 
              message: res.data.message ? res.data.message : '保存失败!'
            })
          }
          resolve();
        }).catch( (error) => {
          // console.log(error);
          reject({
            message: '保存失败!'
          });
        })
      });
    },
    getManagerDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ManagerApi.getManagerDetail(payload)
          .then(res => {
            // console.log('店长详情:', res);
            if (!res) {
              reject();
              return;
            }
            commit('setCurrentManagerDetail', res.data.data);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    }
  },
  mutations: {
    getManagers(state, payload) {
      state.managerList = payload;
    },
    setManagerPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setCurrentManagerDetail(state, payload) {
      state.currentManagerDetail = payload;
    },
    resetCurrentManagerDetail(state, payload) {
      state.currentManagerDetail = payload;
    }
  }
};

export { manager };
