import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v2/login',
    method: 'post',
    data: data
  })
}

export function verifyToken(data) {
  return request({
    url: 'v2/token/verify',
    method: 'post',
    data: data
  })
}

export function generateToken(mobile, data) {
  return request({
    url: 'v2/token/' + mobile,
    method: 'post',
    data: data
  })
}

