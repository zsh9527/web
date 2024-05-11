import axios from "axios";
import qs from "qs"
import { Message } from "element-ui";
// 创建axios实例
let base_location = process.env.BASE_URL
import store from "../store";
import router from "../router";

const service = axios.create({
  baseURL: base_location,
  //   timeout: 20000, // 请求超时时间
  //   headers: {
  //        "X-Requested-With": "XMLHttpRequest",
  //        "Content-Type": "application/json;charset=UTF-8"
  //        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  //   },
  transformRequest: [
    function (data) {
      // 对所有传参的key的value是 null or undefined 转换成 ''
      // 是否是文件格式 上传文件不需要修改
      const isFormData = data instanceof FormData;
      if (data && !isFormData) {
        Object.keys(data).forEach(key => {
          if (
            data[key] === null ||
            data[key] === undefined ||
            data[key] === "null" ||
            data[key] === "undefined"
          ) {
            data[key] = "";
          }
        });
      }
      data = isFormData ? data : JSON.stringify(data);
      return data;
    }
  ]
});
/**
 *  request拦截器
 *  1、上传文件时不能修改参数、Content-Type。注意需要自行判断其他参数不为null、undefined
 *  2、加入时间戳，防止ie缓存
 *  3、将token 加入请求头
 */
service.interceptors.request.use(
  config => {
    // 是否是上传文件 或者 数组
    const isFormData = config.data instanceof FormData;
    // 是否需要添加ts
    const isNotNeedAddTs = config.data instanceof Array;
    // 加入时间戳，防止ie缓存
    if (config.method == "post" && !isFormData) {
      if (!isNotNeedAddTs) {
        config.data = {
          ...config.data,
          ts: Date.parse(new Date()) / 1000
        };
      }
    } else if (config.method == "get" && !isFormData) {
      if (!isNotNeedAddTs) {
        config.params = {
          ts: Date.parse(new Date()) / 1000,
          ...config.params
        };
        // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
        config.paramsSerializer = function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }
    } else {
      config.headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "multipart/form-data"
      };
    }
    // 不是上传文件 定义请求头
    if (!isFormData) {
      config.headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8"
      };
    }
    // 在请求头中加入token
    config.headers.Authorization = store.state.token;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
/**
 * @description 请求回调处理
 * @param response.data.code 回调状态
 */
service.interceptors.response.use(
  response => {
    if (response.data.code == 0) {
      Message.error(response.data.msg);
    }
    return response;
  },
  function (error) {
    if (error.response.status == 401) {
      // 401重定向
      router.push("/login");
    }
    let errorMessage = "连接超时,请刷新重试!";
    if (error.response.data.message && error.response.data.message != "null") {
      errorMessage = error.response.data.message;
    } else if (error.response.data.reason) {
      errorMessage = error.response.data.reason;
    }
    Message.error(errorMessage);
    return Promise.reject(error);
  }
);
export default service;
