import * as HomeApi from 'api/home';

const deviceKind = {
  '1': '运动设备',
  '2': '弱电设备',
  '0': '其他设备'
}
const home = {
  state: {
    overview: {},
    consumAndOrder: {},
    newUser: {},
    recharge: {},
    isFetchChartDatas: false
  },
  actions: {
    getHomeOverview({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        HomeApi.getHomeOverview()
          .then(res => {
            if (!res || !res.data) {
              // console.log('error');
              reject();
              return;
            }
            let params = res.data.data;
            resolve();
            commit('setHomeOverview', params);
          })
          .catch(error => {
            // console.log(error);
            reject();
          });
      });
    },
    getChartDatas({
      commit
    }, payload){
      commit('setFetchState', true);
      return new Promise( (resolve, reject) => {
        HomeApi.getHomeChartData(payload).then( (res) => {
          if (!res || !res.data) {
            commit('setFetchState', false);
            reject();
            return;
          }
          let allData = res.data.data;
          commit('setFetchState', false);
          commit('setChartsData', allData);
          resolve();
        }).catch( (error) => {
          // console.log(error);
          commit('setFetchState', false);
          reject();
        })
      })
    } 
  },
  mutations: {
    setHomeOverview(state, payload) {
      Object.assign(state, {
        overview: {
          orderMoney: payload.orderMoney.toString(),
          orderTimes: payload.orderTimes.toString(),
          storeNum: payload.storeNum.toString(),
          userNum: payload.userNum.toString()
        }
      });
    },
    setChartsData(state, payload) {
      Object.assign(state, {
        consumAndOrder: payload.getConsumListByDate,
        newUser: payload.getStatisticsNewUser,
        recharge: payload.getStatisticsRecharge
      })
    },
    setFetchState(state, payload) {
      state.isFetchChartDatas = payload;
    }
  }
};

export { home };
