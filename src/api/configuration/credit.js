import {
  axiosClient
} from 'common/axiosClient';

// 信用分体系列表
function getCreditList(params) {
  return axiosClient.post('admin/Deploy/getCreditListByParam', params);
}

// 修改信用分配置
function updateCreditConfig(params) {
  return axiosClient.post('admin/Deploy/saveCreditInfo', params)
}

export {
  getCreditList,
  updateCreditConfig
}