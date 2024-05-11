import request from "@/utils/request";

export function pageUser(params) {
  return request({
    url: "v2/user",
    method: "get",
    params: params
  });
}

export function updateUser(mobile, data) {
  return request({
    url: "v2/user/" + mobile,
    method: "put",
    data: data
  });
}

export function deleteUsers(mobiles) {
  return request({
    url: "v2/user/" + mobiles,
    method: "delete"
  });
}

export function listItemShops(mobile, params) {
  return request({
    url: "v2/user/" + mobile + "/item/shops",
    method: "get",
    params: params
  });
}

export function sendCode(mobile) {
  return request({
    url: "v2/user/" + mobile + "/send_code",
    method: "post",
  });
}

export function refreshToken(mobile, data) {
  return request({
    url: "v2/user/" + mobile + "token",
    method: "put",
    data: data
  });
}

export function reservation(mobiles) {
  return request({
    url: "v2/reservation/" + mobiles,
    method: "post",
  });
}

export function updateReservationResult(mobiles) {
  return request({
    url: "v2/reservation/" + mobiles,
    method: "put",
  });
}

export function reward(mobiles) {
  return request({
    url: "v2/reward/" + mobiles,
    method: "post",
  });
}

export function listAllItem() {
  return request({
    url: "v2/item",
    method: "get",
  });
}

export function refreshItem() {
  return request({
    url: "v2/item/refresh",
    method: "put",
  });
}

export function pageShop(params) {
  return request({
    url: "v2/shop",
    method: "get",
    params: params
  });
}

export function refreshShop() {
  return request({
    url: "v2/shop/refresh",
    method: "put",
  });
}

export function pageOrder(params) {
  return request({
    url: "v2/order",
    method: "get",
    params: params
  });
}

export function pageLog(params) {
  return request({
    url: "v2/log",
    method: "get",
    params: params
  });
}

export function deleteLogs(ids) {
  return request({
    url: "v2/log/" + ids,
    method: "delete",
  });
}
