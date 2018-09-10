import * as BoardApi from "api/board";

import * as CommonApi from "common/common";

import { axiosClient } from "common/axiosClient";

const board = {
  state: {
    appkey: "a2fa7c93a2bb43b09bb473343cb4b041",
    appSecret: "c398421cb2b08b8cb82f32e6c6a2ff40",
    liveList: [],
    getTokenApi: "api/lapp/token/get", // 获取accessToken
    accessToken:
      "at.9q6wc7d31otgqicfcuvi9xpx993qbm5q-1e5zg9tdwl-1doh61d-fqamtfrf0",
    getLiveListApi: "api/lapp/live/video/list", // 获取用户下的直播列表
    dropdownStoreList: [],
    defaultStore: null,
    timeDetail: [],
    deviceList_sport: [],
    deviceList_weak: [],
    deviceList_other: [],
    lockers: [],
    musicList: [],
    normalMusic: [],
    crazyMusic: [],
    borderError: [],
    vendingList: [],
    totalOrder: 0,
    totalOvertime: 0,
    totalCancel: 0,
    instoreNum: 0,
    overtimeNum: 0
  },
  actions: {
    getToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        axiosClient
          .post(state.getTokenApi, {
            appKey: state.appkey,
            appSecret: state.appSecret
          })
          .then(res => {
            // console.log("获取token", res);
            if (!res || !res.data) {
              reject();
              return;
            }
            commit("setAccessToken", res.data.data.accessToken);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getList({ commit, state }) {
      axiosClient
        .post(state.getLiveListApi, {
          accessToken: state.accessToken
        })
        .then(res => {
          // console.log("直播列表", res);
          const list = res.data.data;
          commit("setLiveList", list);
          // _this.liveAddress = res.data.data[1].liveAddress;
          // _this.rtmp = res.data.data[1].rtmp;
          // console.log(_this.liveAddress, _this.rtmp);
        })
        .catch(error => {
          // var player = new EZUIPlayer('myPlayer');
          // console.log(error);
        });
    },
    getVideoList({
      commint
    }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getVideoList(payload).then( (res) => {
          if (res.data.code == 200) {
            resolve(res.data.data.list);
            return;
          }
          reject();
        }).catch( (error) => {
          reject();
        })
      })
    },
    getShuHuaDevice({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.getShuHuaDevice(payload)
          .then(res => {
            // console.log(res);
          })
          .catch(error => {
            // console.log(error);
          });
      });
    },
    getStores({ commit }, payload) {
      return new Promise((resolve, reject) => {
        CommonApi.getStores(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            let params = res.data.data.list;
            let first = null;
            params.forEach( (item, index) => {
              if (item.id === 1) {
                first = params.splice(index, 1)[0];
                return;
              }
            })
            params.unshift(first);
            commit("setDropdownStoreList", params);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getStoreTimeDetail({ commit, state }, payload) {
      BoardApi.getStoreTimeDetail(payload)
        .then(res => {
          if (!res || !res.data) {
            return;
          }
          let params = res.data.data;
          // console.log("时段预约", res);
          commit("setTimeDetail", params);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    getDeviceList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.getDeviceList(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            let deviceDatas = res.data.data;
            let data = {
              kind: payload.facilityKind,
              data: deviceDatas
            };
            // console.log(data);
            commit("setDeviceList", data);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getLockerList({ commit }, payload) {
      BoardApi.getLockerList(payload)
        .then(res => {
          if (!res || !res.data) {
            return;
          }
          let lockers = res.data.data;
          commit("setLockers", lockers);
        })
        .catch(error => {
          // console.log(error);
        });
    },
    getVendingGoodsList({ commit }, payload) {
      BoardApi.getVendingGoodsList(payload).then(res => {
        // console.log(res);
      });
    },
    setSportDeviceSwitch({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.setDeviceSwitch(payload).then(res => {
          if (res.data.code == 200) {
            resolve();
          }
          else {
            reject(res.data.message);
          }
        }).catch( (error) => {
          reject('网络异常')
        })
      });
    },
    getMusicPlayerList({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getMusicList(payload)
          .then(res => {
            // console.log(res);
            if (!res || !res.data) {
              reject();
              return;
            }
            if (payload.musicType == 1) {
              commit("setNormalMusic", res.data.data.list); //
            }
            if (payload.musicType == 2) {
              commit("setCrazyMusic", res.data.data.list);
            }
            resolve();
            // let list = res.data.data.list;
            // console.log(list);
            // commit('getMusicList', list);
          })
          .catch(error => {
            reject();
            // console.log(error);
          });
      })
    },
    closeTime({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.closeTime(payload)
          .then(res => {
            // console.log(res);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    openLocker({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.openLocker(payload)
          .then(res => {
            // console.log(res);
            if (res.data.code == 200) {
              resolve();
              return;
            }
            reject(res.data);
          })
          .catch(error => {
            // console.log(error);
            reject({code: '', message: '网络或服务器异常'});
          });
      });
    },
    getBoardError({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getBoardError(payload)
          .then(res => {
            if (!res || !res.data) {
              reject();
              return;
            }
            // console.log('看板异常事件', res)
            // commit("setBoardError", res.data.data.list);
            resolve(res.data.data.list);
          })
          .catch(error => {
            reject();
            // console.log(error);
          });
      })
    },
    playMusic({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.playMusic(payload).then(res => {
            if (res.data.code == 200) {
              resolve();
            } else {
              reject({
                code: res.data.code,
                message: res.data.message
              });
            }
          }).catch( error => {
            // console.log(error);
            reject({
              code: "无",
              message: "网络异常"
            });
          });
      });
    },
    getVendingList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        BoardApi.getVendingList(payload)
          .then(res => {
            // console.log('售货机列表',res.data.data.list);
            let list = res.data.data.list;
            commit("setVendingList", list);
            resolve();
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getTotalOrder({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getTotalOrder(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          commit('SET_TODAY_ORDERINFO', res.data.data);
          resolve();
        }).catch( (error) => {
          // console.log(error);
          reject();
        })
      })
    },
    getLockerHistory({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getLockerHistory(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
          // console.log(res);
        }).catch( (error) => {
          // console.log(error);
          reject('获取数据失败')
        })
      })
    },
    getBoardOrderTable({commit}, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.getBoardOrderTable(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data.list);
        }).catch( () => reject('获取数据失败'))
      })
    },
    updateFacilityStatus({ commit }, payload) {
      return new Promise( (resolve, reject) => {
        BoardApi.updateFacilityStatus(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve();
        }).catch( (error) => {
          reject('获取数据失败');
        })
      })
    }
  },
  mutations: {
    setLogin(state, payload) {
      state.isLogin = payload;
    },
    setAccessToken(state, payload) {
      state.accessToken = payload;
    },
    setLiveList(state, payload) {
      state.liveList = payload;
    },
    setDropdownStoreList(state, payload) {
      state.dropdownStoreList = payload;
      state.defaultStore = payload[0];
    },
    setDefaultStore(state, payload) {
      state.defaultStore = payload;
    },
    setTimeDetail(state, payload) {
      state.timeDetail = payload;
    },
    setDeviceList(state, payload) {
      if (payload.kind == 1) {
        let sportData = payload.data;
        state.deviceList_sport = sportData;
      }
      if (payload.kind == 2) {
        let weakData = payload.data;
        state.deviceList_weak = weakData;
      }
      if (payload.kind == 0) {
        let otherData = payload.data;
        state.deviceList_other = otherData;
      }
    },
    setLockers(state, payload) {
      state.lockers = payload;
    },
    setSportDeviceSwitch(state, payload) {
      let arr = state.deviceList_sport.concat();
      arr[payload.index] = payload.data;
      state.deviceList_sport = arr;
      // state.deviceList_sport.splice(payload.index, payload.data);
      // vue.$set(state.deviceList_sport, payload.index, payload.data)
    },
    setWeakDeviceSwitch(state, payload) {
      let arr = state.deviceList_weak.concat();
      arr[payload.index] = payload.data;
      state.deviceList_weak = arr;
    },
    getMusicList(state, payload) {
      state.musicList = payload;
    },
    setNormalMusic(state, payload) {
      state.normalMusic = payload;
    },
    setCrazyMusic(state, payload) {
      state.crazyMusic = payload;
    },
    setBoardError(state, payload) {
      state.borderError = payload;
    },
    setVendingList(state, payload) {
      state.vendingList = payload;
    },
    SET_TODAY_ORDERINFO(state, orderInfo) {
      state.totalOrder = orderInfo.orderTotal;
      state.totalOvertime = orderInfo.overtimeTotal;
      state.totalCancel = orderInfo.cancelTotal;
      state.instoreNum = orderInfo.inStoreNum;
      state.overtimeNum = orderInfo.overtimeNum;
    }
  }
};

function mapDeviceSwitch(data) {
  data.forEach((item, index) => {
    item.electrifiedSwitch =
      item.electrifiedSwitch == 1
        ? true
        : item.electrifiedSwitch == 0
          ? false
          : false;
  });
  return data;
}
export { board };
