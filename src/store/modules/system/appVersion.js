import * as AppVersionApi from 'api/system/appVersion';

export const appVersion = {
  state: {
    appVersionList: []
  },
  actions: {
    getAppVersionList( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        AppVersionApi.getAppVersionList(payload).then( (res) => {
          if (!res || res.data.code != 200 ) {
            reject(res.data.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
        }).catch( (error) => {
          reject('获取数据失败');
        })
      })
    },
    updateAppVersion( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        AppVersionApi.updateAppVersion(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.date.message || '更新信息失败');
            return;
          }
          resolve();

        }).catch( (error) => {
          reject('更新信息失败');
        })
      })
    },
    getAppVerisonDetail( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        AppVersionApi.getAppVerisonDetail(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.date.message || '获取数据失败');
            return;
          }
          resolve(res.data.data);
        }).catch( (error) => {
          reject('获取数据失败');
        })
      })
    },
    addVersionConfig( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        AppVersionApi.addVersionConfig(payload).then( (res) => {
          if (!res || res.data.code != 200) {
            reject(res.date.message || '更新信息失败');
            return;
          }
          resolve();
        }).catch( () => reject())
      })
    }
  },
  mutations: {

  }
}
