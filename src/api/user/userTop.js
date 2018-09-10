import {
  axiosClient
} from 'common/axiosClient';
// 获取用户排行榜
export function getUserTopList(params) {
  return axiosClient.post('admin/Security/getUserSportTimeSort', params)
}
// 获取点赞列表
export function getFollowerUsers(params) {
  return axiosClient.post('admin/store/getListByParamRecord', params)
}