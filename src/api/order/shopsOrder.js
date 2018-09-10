import {
  axiosClient
} from 'common/axiosClient';
// 列表信息
function getShopsOrderList(params) {
  return axiosClient.post('admin/Order/getVendingOrderList',
   params)
}
// 订单详情
function getOrderDetailList(params){
  return axiosClient.post('admin/Order/getVendingOrderDetail')
}
export{
  getShopsOrderList,
  getOrderDetailList
}