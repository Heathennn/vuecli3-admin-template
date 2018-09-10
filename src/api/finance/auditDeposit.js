import  { axiosClient } from 'common/axiosClient';

// 获取押金审核列表
export function getAuditDeposit(params) {
  return axiosClient.post('admin/Finance/getListByParamRefund', params)
}

// 获取押金审核详情
export function getAuditDetail(params) {
  return axiosClient.post('admin/Finance/refundDetail', params)
}

// 退款审核
export function refundAudit(params) {
  return axiosClient.post('admin/Finance/refundAudit', params);
}