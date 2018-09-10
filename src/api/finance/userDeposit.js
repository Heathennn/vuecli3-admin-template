import { axiosClient } from 'common/axiosClient';

// 已交押金
function getDepositList(params) {
  return axiosClient.post('admin/Finance/getDepositStatistics', params);
}

// 已退押金
function getDepositRefundList(params) {
  return axiosClient.post('admin/Finance/getDepositStatisticsConsume', params);
}

// 已交押金明细
function getDepositDetailList(params) {
  return axiosClient.post('admin/Finance/getDepositList', params);
}

// 已退押金明细
function getDepositListConsume() {
  return axiosClient.post('admin/Finance/getDepositListConsume', params);
}

export { getDepositList, getDepositRefundList, getDepositDetailList, getDepositListConsume };
