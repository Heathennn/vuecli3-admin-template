import {
  axiosClient
} from 'common/axiosClient';

const URL_DEVELOPMENT = 'http://api-control.test.hxsapp.com/admin/Upload/uploadFile';

const URL_PRODUCTION = 'http://api-control.hxsapp.com/admin/Upload/uploadFile';

const HOST_DEVELOPMENT = 'admin-gym.test.hxsapp.com';

const HOST_PRODUCTION = 'admin-gym.hxsapp.com';

const HOST = window.location.host;


// 获取下拉菜单门店列表
export function getStores(params) {
  return axiosClient.post('api/Store/getListByParam', params)
}

// 拿到下拉菜单getStores
export function getDropDownStoreList(params) {

  return new Promise((resolve, reject) => {
    getStores({ page: 1, size: 100})
      .then(res => {
        if (!res || !res.data) {
          reject();
          return;
        }
        let stores = res.data.data.list;
        // console.log("下拉", params);
        let first = null;
        stores.forEach( (item, index) => {
          if (item.id === 1) {
            first = stores.splice(index, 1)[0];
            return;
          }
        })
        stores.unshift(first);
        
        resolve(stores);
      })
      .catch(error => {
        // console.log(error);
        reject();
      });
  });
}

export const uploadFileApi = HOST === HOST_PRODUCTION ? URL_PRODUCTION : URL_DEVELOPMENT
