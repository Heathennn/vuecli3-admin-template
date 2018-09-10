import { axiosClient } from 'common/axiosClient';

// 获取门店公告列表
export function getStoreBulletinList(params) {
  return axiosClient.post('admin/store/getListByParamNotice', params)
}

// 发布公告
export function addStoreBulletin(params) {
  return axiosClient.post('admin/store/addStoreNotice', params)
}