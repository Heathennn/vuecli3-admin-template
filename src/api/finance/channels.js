import {
  axiosClient
} from 'common/axiosClient';

// 渠道汇总收入
function getChannelsList(params) {
  return axiosClient.post('admin/Finance/getStatsChannelIncome',
   params)
}

// 渠道汇总退款
function getChannelsRefundList(params) {
  return axiosClient.post('admin/Finance/getStatsChannelRefund',
   params)
}

export{
  getChannelsList,
  getChannelsRefundList
}