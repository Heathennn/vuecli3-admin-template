import {
  axiosClient
} from 'common/axiosClient';

// 获取舒华设备状态
export function getShuHuaDevice(params) {
  return axiosClient.post('api/Equipment/shuhuaDevice', params);
}
// 获取时段信息
export function getStoreTimeDetail(params) {
  return axiosClient.post(`api/Store/getTimeDetail`, params);
}

//关闭时段
export function closeTime(params) {
  return axiosClient.post('manager/Store/closingTime', params);
}

// 获取设备状态(设备列表)
export function getDeviceList(params) {
  return axiosClient.post('admin/Equipment/getFacilityInfoListByParam', params);
}

// 设备控制(设备开关, 电源开关)
/**
 *
 * @param {Object} params
 * storeId 门店id  --> firmStoreId
 * equipmentId 设备id --> facilityNo
 * equipmentType 设备类型 --> facilityType
 * status 1 开 0 关
 * fid 设备表ID --> id
 * level  1 设备开关 0 电源开关
 * sign 签名
 */
export function setDeviceSwitch(params) {
  return axiosClient.post('api/Equipment/weakengineerOper', params);
}

// 获取储物柜信息
export function getLockerList(params) {
  return axiosClient.post('admin/operate/getLockerInfolistByStoreId', params);
}

// 获取售货机商品列表
export function getVendingGoodsList(params) {
  return axiosClient.post('api/Equipment/getVendingGoodsList', params);
}

// 获取音乐列表
export function getMusicList(params) {
  return axiosClient.post('admin/Main/musicList', params)
}

// 开储物柜柜门
export function openLocker(params) {
  return axiosClient.post('admin/Equipment/cabinetOpen', params);
}

// 看板设备异常信息
export function getBoardError(params) {
  return axiosClient.post('admin/Main/AbnormalBack', params)
}

//播放音频
/**
 *单曲循环不传musicId
 *
 * @param {*} params
 * @returns
 */
export function playMusic(params) {
  return axiosClient.post('admin/Equipment/music', params);
}

// 根据门店获取售货机列表
export function getVendingList(params) {
  return axiosClient.post('manager/Store/vendingList', params);
}

// 获取直播列表
export function getVideoList(params) {
  return axiosClient.post('admin/Equipment/getCameraList', params);
}

// 获取订单数统计
export function getTotalOrder(parmas) {
  return axiosClient.post('admin/store/getCurrentOrderNum', parmas)
}

// 获取储物柜使用记录
export function getLockerHistory(params) {
  return axiosClient.post('admin/main/listForHistory', params)
}

// 获取看板某一时段订单列表
export function getBoardOrderTable(params) {
  return axiosClient.post('admin/main/getOrderInfoByIntervalId', params)
}

// 看板刷新设备
export function updateFacilityStatus(params) {
  return axiosClient.post('admin/Main/updateFacilityStatus', params)
}

// 看板在店人数列表
export function getOnlineOrderList(params) {
  return axiosClient.post('admin/order/getSportOrderList', params)
}

// 看板超时人数列表
export function getOvertimeOrderList(params) {
  return axiosClient.post('admin/order/getSportOrderList', params);
}