import {
  axiosClient
} from 'common/axiosClient';

function getHomeOverview(params) {
  return axiosClient.post('admin/Main/overview',params)
}

function getHomeChartData(params) {
  return axiosClient.post('admin/Main/dataChart', params)
}

export {
  getHomeOverview,
  getHomeChartData
}