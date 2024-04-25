import { name } from '../../package.json';

const TOKEN_KEY = `${name}-token`;

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY);
}

export function setToken(value: string) {
  return uni.setStorageSync(TOKEN_KEY, value);
}

export function removeToken() {
  return uni.removeStorageSync(TOKEN_KEY);
}
