import {
  axiosClient
} from 'common/axiosClient';

export function getAppVersionList(params) {
  return axiosClient.post('admin/main/getVersionListByParam', params);
}

export function updateAppVersion(params) {
  return axiosClient.post('admin/main/getVersionUpdate', params);
}

export function getAppVerisonDetail(params) {
  return axiosClient.post('admin/main/getVersionDetail', params);
}

export function addVersionConfig(params) {
  return axiosClient.post('admin/main/getVersionAdd', params);
}
