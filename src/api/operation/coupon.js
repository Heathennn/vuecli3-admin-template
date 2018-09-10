import {
  axiosClient
} from 'common/axiosClient';

// 优惠券发放列表
function getCouponList(params) {
  return axiosClient.post('admin/Finance/getCouponList', params);
}

export {
  getCouponList
}