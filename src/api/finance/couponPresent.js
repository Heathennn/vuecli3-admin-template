import { axiosClient } from 'common/axiosClient';

// 获取赠送消耗列表
export function getCouponPresentList(params) {
  return axiosClient.post('admin/store/getCouponUseList', params)
}

// 获取消耗统计
export function getPresentTotal(params) {
  return axiosClient.post('admin/Store/getCouponTotal', params)
} 

// 获取消耗详情列表
export function getPresentListDetail(params) {
  return axiosClient.post('admin/store/getStoreCouponUseList', params)
}

// 获取消耗详情统计
export function getPresentTotalDetail(params) {
  return axiosClient.post('admin/store/getStoreCouponTotal', params)
}