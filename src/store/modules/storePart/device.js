import * as DeviceApi from 'api/storePart/device';

import * as CommonApi from 'common/common';

const device = {
  state: {
    boundDeviceList: [], // 已绑设备
    unboundDeviceList: [], // 未绑设备
    dropdownStoreList: [], // 门店下拉列表
    isLoadingData: false
  },
  actions: {
    getDeviceListByIsBound({ commit }, payload) {
      // 根据绑定状态获取列表
      commit('setIsLoadingData', true);
      return new Promise( (resolve, reject) => {
        DeviceApi.getDeviceList(payload)
          .then(res => {
            if (!res || !res.data) {
              commit('setIsLoadingData', false);
              reject();
              return;
            }
            let response = res.data.data.list;
            if (payload.bundling == 1) {
              commit('getBoundDeviceList', response);
              commit('setIsLoadingData', false);
              resolve(res.data.data);
              return;
            }
            if (payload.bundling == 2) {
              commit('getUnboundDeviceList', response);
              commit('setIsLoadingData', false);
              resolve();
            }
          })
          .catch(error => {
            // console.log(error);
            commit('setIsLoadingData', false);
            reject();
          });
      })
    },
    editDeviceInfo({ commit }, payload) {
      // 编辑设备信息
      DeviceApi.setDeviceInfo(payload).then(res => {
        if (res.data.code == 400) {
          vue.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          });
          // console.log(res);
          return;
        }
        // console.log(res);
      });
    },
    unbindDevice({ commit }, payload) { // 解绑设备
      return new Promise((resolve, reject) => {
        DeviceApi.unbindDevice(payload)
          .then(res => {
            // console.log(res);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            rejcet();
          });
      });
    },
    // filterDeviceList({ commit }, payload) {
    //   // 在已绑定状态下 根据门店ID和类型筛选
    //   commit('setIsLoadingData', true);
    //   DeviceApi.filterDeviceList(payload)
    //     .then(res => {
    //       if (!res || !res.data) {
    //         commit('setIsLoadingData', false);
    //         return;
    //       }
    //       let list = res.data.data;
    //       commit('getBoundDeviceList', list);
    //       commit('setIsLoadingData', false);
    //     })
    //     .catch(error => {
    //       // console.log(error);
    //       commit('setIsLoadingData', false);
    //     });
    // },
    getDropDownStoreList({ commit }, payload) {
      CommonApi.getStores(payload)
        .then(res => {
          if (!res || !res.data) {
            return;
          }
          let params = res.data.data.list;
          commit('getDropdownStoreList', params);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    bindDevice({ commit }, payload) { // 绑定设备
      return new Promise( (resolve, reject) => {
        DeviceApi.bindDevice(payload).then( (res) => {
          if (res.data.code === 200) {
            resolve();
            return;
          }
          reject();
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    },
    deviceSync({ commit }, payload) { // 一键同步
      return new Promise( (resolve, reject) => {
        DeviceApi.deviceSync(payload).then( (res) => {
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
    getBoundDeviceList(state, payload) {
      state.boundDeviceList = payload;
    },
    getUnboundDeviceList(state, payload) {
      state.unboundDeviceList = payload;
    },
    getDropdownStoreList(state, payload) {
      state.dropdownStoreList = payload;
    },
    setIsLoadingData(state, payload) {
      state.isLoadingData = payload;
    }
  }
};

export { device };
