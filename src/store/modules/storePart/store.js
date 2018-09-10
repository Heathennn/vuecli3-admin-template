import * as StoreApi from 'api/storePart/store';

import { deepCopy } from 'common/utils';
import Vue from 'vue';
import { updateStoreConfig } from '../../../api/storePart/store';

const store = {
  state: {
    storeList: [],
    areaList: [],
    currentStoreDetail: null,
    currentStoreConfig: null,
    pageSize: 0, // 每页条数(传入) size(实际每页条数)
    pageNum: 1, // 当前页数
    pages: 0, // 总页数
    total: 0, // 总条数
    isFetchingData: false,
    areaIds: ['all'],
    publicDevice: [],
    managerList: [],
  },
  actions: {
    // 获取省市区级联下拉菜单
    getAreaDropDown({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.getAreaDropDown(payload)
          .then(res => {
            // console.log('省市区返回值',res);
            let list = res.data.data;
            resolve(list);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getStoreList({ commit, state }, payload) {
      if (state.isFetchingData) return;
      commit('setIsFetchingData', true);
      return new Promise((resolve, reject) => {
        StoreApi.getStoreList(payload)
          .then(res => {
            if (!res || !res.data) {
              return;
            }
            // console.log(res)
            commit('setPagination', res.data.data);
            commit('setStoreList', res.data.data.list);
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
    getStoreDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.getStoreDetail(payload).then(res => {
          // if () {

          // }
          let detail = res.data.data;
          // console.log(detail)
          commit('getCurrentStoreDetail', detail);
          resolve();
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      });
    },
    uploadImg({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.uploadImg(payload)
          .then(res => {
            // console.log(res);
            resolve(res.data.data);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getStoreConfig({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.getStoreConfig(payload)
          .then(res => {
            if (!res || !res.data) {
              return;
            }
            // console.log(res);
            commit('getCurrentStoreConfig', res.data.data);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    updateStoreDetail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.updateStoreDetail(payload).then(res => {
          // console.log(res);
          if (res.data.code != 200) {
            reject(res.data.message);
            return;
          }
          resolve(res);
          return;
        }).catch( (error) => {
          // console.log(error);
          reject('网络异常');
          return;
        })
      });
    },
    updateStoreConfig({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreApi.updateStoreConfig(payload).then(res => {
          // if (res.data.data == 400) {
          //   reject(res.data.message);
          //   return;
          // }
          // console.log(res)
          if (res.data.code === 200) {
            resolve();
            return;
          }
          reject(res.data.message);
          // return;
        }).catch( (error) => {
          reject('修改配置信息失败')
        })
      });
    },
    getPublicDevice({ commit}, payload) {
      return new Promise( (resolve, reject) => {
        StoreApi.getPublicDevice(payload).then( (res) => {
          if (!res || !res.data) {
            reject();
            return;

          }
          let list = res.data.data;
          // console.log('设备',list);
          commit('getPublicDevice', list)
          resolve();
        }).catch( (error) => {
          // console.log(error);
          rejcet();
        })
      })
    },
    getManagerList({commit}, payload) {
      return new Promise( (resolve, reject) => {
        StoreApi.getManagerList(payload).then( (res) => {
          if (!res || !res.data) {
            reject();
            return;
          }
          let list = res.data.data.list;
          commit('setManagers', list);
        }).catch( (error) => {
          // console.log(error);
          rejcet();
        })

      })
    },
    bindManagerForStore({commit}, payload) {
      return new Promise( (resolve, reject) => {
        StoreApi.bindManagerWithStore(payload).then( (res) => {
          // console.log(res)
          resolve();
        }) 
      })
    }
  },
  mutations: {
    setStoreList(state, payload) {
      state.storeList = payload;
    },
    getCurrentStoreDetail(state, payload) {
      state.currentStoreDetail = payload;
    },
    getCurrentStoreConfig(state, payload) {
      state.currentStoreConfig = payload;
    },
    setPagination(state, payload) {
      state.pageSize = payload.pageSize;
      state.pageNum = payload.pageNum < 1 ? 1 : payload.pageNum; 
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    },
    setAreaList(state, payload) {
      let list = deepCopy(payload);
      for (let item of list) {
        item.cities = [];
      }
      state.areaList = list;
    },
    setSubAreaList(state, payload) {
      let list = deepCopy(state.areaList);
      let obj = Object.assign({}, state.areaList[payload.index], {
        cities: payload.cities
      });
      list[payload.index] = obj;
      Object.assign(state, {
        areaList: list
      });
    },
    setAreaIds(state, payload) {
      state.areaIds = payload;
    },
    getPublicDevice(state, payload) {
      state.publicDevice = payload;
    },
    setManagers(state, payload) {
      state.managerList = payload;
    }
  }
};

function findIndexById(id, array) {
  array.forEach((item, index) => {
    if (item.id == id) {
      return index;
    }
  });
  return 'Nofound';
}
export { store };
