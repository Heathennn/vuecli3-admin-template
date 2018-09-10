import {
  axiosClient
} from 'common/axiosClient';

function getAbnormalOrderList(params) {
  return axiosClient.post('admin/Serve/overTimeOrder', params)
}

// 获取订单详情
function getAbnormalOrderDetail(params) {
  return axiosClient.post('admin/Order/getSportDetail', params);

}

// 更改申诉状态
function updateAppealStatus(params) {
  return axiosClient.post('admin/Order/orderAppeal', params)
}
export {
  getAbnormalOrderList,
  getAbnormalOrderDetail,
  updateAppealStatus
}