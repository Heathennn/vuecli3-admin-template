import { axiosClient } from 'common/axiosClient';
// 首页列表
function getIncomeList(params) {
  return axiosClient.post('admin/Finance/getStatsIncomeByParams', params);
}
// 订单明细综合统计
function getIncomeTotalList(params) {
  return axiosClient.post('admin/Finance/getStatsIncomeTotalByIncome', params);
}
// 订单明细
function getIncomeDetailList(params) {
  return axiosClient.post('admin/Finance/getIncomeDetail', params);
}
// 后台综合统计
function getIncomeOrderTotal(params) {
  return axiosClient.post('admin/Finance/getStatsIncomeByParams', params);
}

export {
  getIncomeList,
  getIncomeTotalList,
  getIncomeDetailList,
  getIncomeOrderTotal
};
