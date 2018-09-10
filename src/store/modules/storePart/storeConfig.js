import * as StoreConfigApi from 'api/storePart/storeConfig';

import { uploadImg } from 'api/storePart/store';

const storeConfig = {
  state: {
    storeConfigPublicDevice: [],
    isFetchingData: false
  },
  actions: {
    getStoreConfigPublicDevice({ commit }, payload) {
      commit('setIsFetchingData', true);
      StoreConfigApi.getStoreConfigPublicDevice(payload).then(res => {
        if (!res || !res.data) {
          commit('setIsFetchingData', false);
          return;
        }
        let list = res.data.data;
        commit('setStoreConfigPublicDevice', list);
        commit('setIsFetchingData', false);
      }).catch( (error) => {
        // console.log(error);
        commit('setIsFetchingData', false);
      })
    },
    // 上传图片
    storeConfigUploadImg({ commit }, payload) {
      return new Promise((resolve, reject) => {
        uploadImg(payload)
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
    // 更新公共设施信息
    updateStoreConfigPublicDevice({ commit }, payload) {
      return new Promise((resolve, reject) => {
        StoreConfigApi.updateStoreConfigPublicDevice(payload).then(res => {
          if (res.data.code === 200 ) {
            resolve();
          }
          reject();
        }).catch( () => {
          reject();
        })
      });
    }
  },
  mutations: {
    setStoreConfigPublicDevice(state, payload) {
      state.storeConfigPublicDevice = payload;
    },
    setIsFetchingData(state, payload) {
      state.isFetchingData = payload;
    }
  }
};

export { storeConfig };
