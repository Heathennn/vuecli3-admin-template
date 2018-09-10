import * as UsersApi from 'api/operation/users';

const users = {
  state: {
    users: [],
    isFetchingData: false,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0 // 总条数
  },
  actions: {
    getUsers({ commit }, payload) {
      commit('setIsFetchingData', true);
      return new Promise((resolve, reject) => {
        UsersApi.getUsers(payload)
          .then(res => {
            if (!res || !res.data || res.data.code != 200) {
              commit('setIsFetchingData', false);
              commit('setUsers', []);
              reject(res.data.message || '获取数据失败');
              return;
            }
            let list = res.data.data.list;
            commit('setUsersPagination', res.data.data);
            commit('setUsers', list);
            commit('setIsFetchingData', false);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            commit('setIsFetchingData', false);
            reject();
          });
      });
    },
    getUserDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserDetail(payload)
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserCreditList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserCreditList(payload)
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserBodyBaseInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserBodyBaseInfo(payload)
          .then(res => {
            // console.log('身体基础数据',res);
            if (res.data.code == 200) {
              resolve(res.data.data);
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserBodyDimensionInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserBodyDimensionInfo(payload)
          .then(res => {
            // console.log('身体图表数据',res)
            if (res.data.code == 200) {
              resolve(res.data.data);
              return;
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserBodyDimensionTable({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserBodyDimensionTable(payload)
          .then(res => {
            // console.log('身体维度列表', res);
            if (res.data.code == 200) {
              resolve(res.data.data);
            }
            reject();
          })
          .catch(error => {
            reject();
          });
      });
    },
    getUserBodyComponent({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserBodyComponent(payload)
          .then(res => {
            // console.log('身体成分', res)
            if (res.data.code == 200) {
              resolve(res.data.data);
              return;
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserTotalSportData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserTotalSportData(payload)
          .then(res => {
            // console.log('用户运动总数据', res);
            if (res.data.code == 200) {
              resolve(res.data.data);
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserSportDataList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserSportDataList(payload)
          .then(res => {
            // console.log('用户运动数据列表', res)
            if (res.data.code == 200) {
              resolve(res.data.data);
              return;
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserSportChartData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserSportChartData(payload)
          .then(res => {
            // console.log('用户运动图表', res)
            if (res.data.code == 200) {
              resolve(res.data.data);
            }
            reject();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getUserSportChartByDeviceType({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UsersApi.getUserSportChartByDeviceType(payload)
          .then(res => {
            if (res.data.code == 200) {
              resolve(res.data.data);
            }
            reject();
          })
          .catch(error => {
            reject();
          });
      });
    },
    getUserBodyComponentTable({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        UsersApi.getUserBodyComponentTable(payload).then( (res) => {
          if (res.data.code == 200) {
            resolve(res.data.data);
            return;
          }
          reject();
        }).catch( (error) => {
          console.log(error);
          reject();
        })
      })
    }
  },
  mutations: {
    setUsersPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    },
    setUsers(state, payload) {
      state.users = payload;
    }
  }
};

export { users };
