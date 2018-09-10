import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1, path: '' })
}

export function removeToken() {
  return Cookies.remove(TokenKey, { path: '' })
}
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function compare(property) {
  return function(a, b) {
    return a[property] - b[property]
  }
}


