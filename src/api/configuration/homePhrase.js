import { axiosClient } from 'common/axiosClient';

// 获取激励语
export function getHomePhraseList(params) {
  return axiosClient.post('admin/store/getListByParamEncourage', params)
}

// 添加激励语
export function addHomePhrase(params) {
  return axiosClient.post('admin/store/addEncourage', params);
}

// 修改首页激励语
export function updateHomePhrase(params) {
  return axiosClient.post('admin/store/updateEncourage', params)
}

// 删除激励语
export function removePhrase(params) {
  return axiosClient.post('admin/store/delEncourage', params)
}