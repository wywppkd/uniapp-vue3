const MAP_API_ENV = {
  dev: 'http://rap2api.taobao.org/app/mock/230933',
  test: 'http://rap2api.taobao.org/app/mock/230933',
  prod: 'http://rap2api.taobao.org/app/mock/230933',
} as const;

export const getBaseUrl = () => {
  // 根据环境变量设置后端接口
  const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;
  if (VITE_APP_ENV) {
    return MAP_API_ENV[VITE_APP_ENV];
  }
  throw new Error('VITE_APP_ENV is not defined');
};
