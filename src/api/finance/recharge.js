import {
  axiosClient
} from 'common/axiosClient';

// 充值列表
function getRechargeList(params) {
  return axiosClient.post('admin/Finance/getStatsChannelTotal', params)
}

// 充值明细
function getRechargeDetailList(params) {
  return axiosClient.post('admin/Finance/getRechargeListByParam', params)
}

// // 充值汇总
// function getRechargeDetailList(params) {
//   return axiosClient.post('admin/Finance/getStatsChannelTotal', params)
// }
export{
  getRechargeList,
  getRechargeDetailList
}