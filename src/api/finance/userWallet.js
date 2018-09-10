import { axiosClient } from 'common/axiosClient';

// 用户钱包详情综合统计
// admin/Finance/getWalletOverall
function getUserWalletDetail(params) {
  return axiosClient.post('admin/Finance/getWalletOverall', params);
}

// 首页钱包列表
function getWalletList(params) {
  return axiosClient.post('admin/Finance/getListByParam', params);
}

// 充值明细
function getWalletRechargeList(params) {
  return axiosClient.post('admin/Finance/getRechargeListByParam', params);
}
//消费明细
function getWalletConsumeList(params) {
  return axiosClient.post('admin/Finance/getConsumeByUserId', params);
}
//优惠券明细
function getWalletCouponList(params) {
  return axiosClient.post('admin/Finance/couponList', params);
}
// 退款明细
function getWalletRefundList(params) {
  return axiosClient.post('admin/Finance/getRefundByUserId', params);
}
export {
  getWalletList,
  getUserWalletDetail,
  getWalletRechargeList, //充值
  getWalletConsumeList, //消费
  getWalletCouponList, //优惠券
  getWalletRefundList //退款
};
