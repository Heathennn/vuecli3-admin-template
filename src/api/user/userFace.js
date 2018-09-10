import {
  axiosClient
} from 'common/axiosClient';

// 获取用户人脸采集列表
export function getUserFaceList(params) {
  return axiosClient.post('admin/Operate/getFaceList', params)
}

// 删除人脸采集
export function removeUserFace(params) {
  return axiosClient.post('admin/Operate/delFaceImg', params)
}