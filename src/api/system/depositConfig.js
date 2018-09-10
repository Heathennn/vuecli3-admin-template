import { axiosClient } from 'common/axiosClient';

// 配置列表
export function getDepositConfig(params) {
  return axiosClient.post('admin/serve/depositConfigList', params)
}

// 修改押金
export function updateDeposit(params) {
  return axiosClient.post('admin/serve/depositConfigAdd', params);
}