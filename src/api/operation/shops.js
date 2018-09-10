import {
  axiosClient
} from 'common/axiosClient';

// 售货机列表
function getShopsList(params) {
  return axiosClient.post('admin/Operate/getVendingStatisticsList', params);
}

// 商品库列表
function getGoodsList(params) {
  return axiosClient.post('admin/Operate/goodsList', params)
}

// 获取商品详情
function getGoodsDetail(params) {
  return axiosClient.post('admin/Operate/goodsDetail', params);
}

// 编辑/创建商品
function saveGoodInfo(params) {
  return axiosClient.post('admin/Operate/goodsSave', params)
}

// 获取售货机商品列表
function getShopGoodList(params) {
  return axiosClient.post('admin/Store/vendingList', params)
}

// 获取售货机操作记录
function getShopOperationHistory(params) {
  return axiosClient.post('admin/order/listByParams', params);
}

export {
  getShopsList,
  getGoodsList,
  getGoodsDetail,
  saveGoodInfo,
  getShopGoodList,
  getShopOperationHistory
}