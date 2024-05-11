import request from "@/utils/request";

export function pageTask(params) {
  return request({
    url: "v2/task",
    method: "get",
    params: params
  });
}

export function stopTask(id) {
  return request({
    url: "v2/task/" + id,
    method: "delete"
  });
}

export function addTask(data) {
  return request({
    url: "v2/task",
    method: "post",
    data: data
  });
}

export function pageEngine(params) {
  return request({
    url: "v2/task/engine",
    method: "get",
    params: params
  });
}

export function pageSpider(params) {
  return request({
    url: "v2/task/spider",
    method: "get",
    params: params
  });
}
