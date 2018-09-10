import { axiosClient } from 'common/axiosClient';

// 获取异常代码
function getCodeList(params) {
  return axiosClient.post('admin/Deploy/getGuideClassifyList', params);
}

// 一键同步
function getExceptionSync(params) {
  return axiosClient.post('api/Equipment/getExceptionSync', params);
}

// 编辑异常代码
function updateErrorCode(params) {
  return axiosClient.post('admin/Deploy/saveGuide', params)
}
export { getCodeList, getExceptionSync, updateErrorCode};
