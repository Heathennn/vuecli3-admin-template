import {
  axiosClient
} from 'common/axiosClient';
// 账户统计
function getJournalList(params) {
  return axiosClient.post('admin/Finance/getListFlowDetail',
   params)
}
// 综合统计（第二个表）
function getCollectList(params) {
  return axiosClient.post('admin/Finance/statsFlowTotal',
   params)
}
export{
  getJournalList,
  getCollectList
}