import { getToken } from './auth';
import { MAP_PLATFORM, getPlatform } from './getPlatform';
import { getBaseUrl } from './getBaseUrl';

uni.addInterceptor('request', {
  invoke(args) {
    const p = getPlatform();
    console.log('🚀 ~ file: request.ts:8 ~ invoke ~ p:', p);
    // // h5 走代理, 去掉 baseUrl, 其他平台加上
    let url = '';
    if (p === MAP_PLATFORM.h5) {
      url = `/api${args.url}`;
    } else {
      url = `${getBaseUrl()}${args.url}`;
    }

    args.url = url;
    const token = getToken();
    if (token) {
      args.header = {
        ...args.header,
        token: getToken(),
      };
    }
    args.timeout = 30000;
  },
  returnValue(result) {
    return new Promise((resolve, reject) => {
      result
        .then(async (res: any) => {
          if (res?.data?.code === 401) {
            // TODO: 登录失效, 跳转登录页
            uni.showToast({
              title: '登录失效',
              icon: 'none',
            });
          }
          resolve(res?.data); // 只返回接口出参, 去掉响应头信息
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  },
});

type MyUniRequesType = (options: UniApp.RequestOptions) => Promise<any>; // 重写 uni.request 出参类型 any, 方便每个接口自定义出参类型
export default uni.request as MyUniRequesType;
