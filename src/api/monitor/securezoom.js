import {
  axiosClient
} from 'common/axiosClient';
//列表信息
function getMonitorList(params) {
  return axiosClient.post('admin/Security/getMonitoringListByParam',
   params)
}
//查看明细
function getMonitorDetailList(params) {
  return axiosClient.post('admin/Security/getMonitoringDetail',
   params)
}
export{
  getMonitorList,
  getMonitorDetailList
}