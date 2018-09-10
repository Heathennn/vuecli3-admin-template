import {
  axiosClient
} from 'common/axiosClient';

// 获取音乐列表
function getMusicList(params) {
  return axiosClient.post('admin/Main/musicList', params);
}

// 音频上传
function uploadMusic(params) {
  return axiosClient.post('admin/Main/uploadBatch', params);
}

// 删除音频
export function removeMusic(params) {
  return axiosClient.post('admin/Main/musicDelete', params);
}
export {
  getMusicList,
  uploadMusic
}