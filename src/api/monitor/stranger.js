import {
  axiosClient
} from 'common/axiosClient';

//列表信息
function getStrangerList(params) {
  return axiosClient.post('admin/Security/strangerList', params)
}

// 查看详情   id(传)
function getStrangerDetailList(params) {
  return axiosClient.post('admin/Security/strangerDetail', params)
}

//举报有效（详情按钮）
function failureUpdate (params){
  return axiosClient.post('admin/security/strangerAdmission',params)
}
export {
  getStrangerList,
  getStrangerDetailList,
  failureUpdate
}
