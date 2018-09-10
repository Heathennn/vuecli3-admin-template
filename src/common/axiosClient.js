import axios from 'axios';

import qs from 'qs';

import { createSign } from 'api/sign';

import { removeToken } from './utils';

const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://api-control.test.hxsapp.com/',
  withCredentials: true,
  timeout: 10000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [
    function(data, headers) {
      return qs.stringify(createSign(data));
    }
  ]
});

// 拦截请求, 登录接口不传token
axiosClient.interceptors.request.use(function (config) {
  if (config.url === 'admin/User/loginValid') {
    config.headers.common = {'Content-Type': 'application/x-www-form-urlencoded'};
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 拦截返回值
axiosClient.interceptors.response.use( (response) => {
  if (response.data.code == 400 && response.data.data.tokenStatus == 0) {
    removeToken();
    // 1. 跳转到另一个路由
    // 2. 刷新页面
    window.location.reload();
    return;
  }
  return response;
})

export { axiosClient };
