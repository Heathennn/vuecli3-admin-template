import {
  axiosClient
} from 'common/axiosClient';

// 获取用户列表
function getUsers(params) {
  return axiosClient.post('admin/Operate/getUserList', params);
}

// 获取用户详情
function getUserDetail(params) {
  return axiosClient.post('admin/Operate/getUserDetail', params);
}

// 获取用户信用列表
function getUserCreditList(params) {
  return axiosClient.post('admin/user/creditRecordList', params);
}

// 获取身体报告基础数据
function getUserBodyBaseInfo(params) {
  return axiosClient.post('admin/Operate/getBodyfatCheck', params)
}

// 获取身体维度图表
function getUserBodyDimensionInfo(params) {
  return axiosClient.post('admin/Operate/statsDimensionTimes', params)
}

// 获取身体维度列表
function getUserBodyDimensionTable(params) {
  return axiosClient.post('admin/Operate/statsDimensionPage', params)
}

// 获取身体成分图表
function getUserBodyComponent(params) { 
  return axiosClient.post('admin/Operate/statsComponentTimes', params);
}

// 获取身体成分列表
function getUserBodyComponentTable(params) {
  return axiosClient.post('admin/Operate/statsComponentPage', params)
}

// 获取用户运动总数据
function getUserTotalSportData(params) {
  return axiosClient.post('admin/Operate/selectTotalByOrder', params)
}

// 获取用户运动数据列表
function getUserSportDataList(params) {
  return axiosClient.post('admin/Operate/selectStatisticsByDate', params);
}

// 获取用户当天运动详情
function getUserSportDetailByDate(params) {
  return axiosClient.post('admin/main/getListByDate', params);
}

// 获取用户运动记录图表
function getUserSportChartData(params) {
  return axiosClient.post('admin/Operate/selectStatisticsByChart', params);
}

// 获取各种类型器材使用数据
function getUserSportChartByDeviceType(params) {
  return axiosClient.post('admin/Operate/selectStatisticsByType', params);
}

// 获取运动详细数据里的设备详细数据
export function getSportFacilityDetail(params) {
  return axiosClient.post('admin/user/detailSportsGroups', params)
} 

// 获取身体报告
export function getPosturPage(params) {
  return axiosClient.post('admin/User/statsPosturePage', params)
}
export {
  getUsers,
  getUserDetail,
  getUserCreditList,
  getUserBodyBaseInfo,
  getUserBodyDimensionInfo,
  getUserBodyComponent,
  getUserSportDataList,
  getUserTotalSportData,
  getUserSportChartData,
  getUserSportChartByDeviceType,
  getUserBodyDimensionTable,
  getUserSportDetailByDate,
  getUserBodyComponentTable
}