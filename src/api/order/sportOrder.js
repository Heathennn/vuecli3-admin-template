import {
  axiosClient
} from 'common/axiosClient';

function getSportOrderList(params) {
  return axiosClient.post('admin/Order/getSportOrderList', params)
}

// 详情 admin/Order/getSportDetail
function getSportDetailList(params) {
  return axiosClient.post('admin/Order/getSportDetail', params)
}

// 取消订单
function cancelOrder(params) {
  return axiosClient.post('admin/Order/cancleOrder', params);
}

// 获取门店列表
function getStoreNameList(params) {
  return axiosClient.post('admin/Store/list', params)
}

// 获取订单操作记录
function getOrderOperationLog(params) {
  return axiosClient.post('admin/security/getflowListInfo', params)
}

export{
  getSportOrderList,
  getSportDetailList,
  cancelOrder,
  getStoreNameList,
  getOrderOperationLog
}
