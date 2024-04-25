export const MAP_PLATFORM = {
  'app-plus': 'app-plus',
  h5: 'h5',
  'mp-weixin': 'mp-weixin',
} as const;

// 拿到所有 value 联合类型
export type Platform = (typeof MAP_PLATFORM)[keyof typeof MAP_PLATFORM];

export const getPlatform = (): Platform | undefined => {
  let platform = undefined;

  // #ifdef APP-PLUS
  platform = MAP_PLATFORM['app-plus'];
  // #endif

  // #ifdef H5
  platform = MAP_PLATFORM.h5;
  // #endif

  // #ifdef MP-WEIXIN
  platform = MAP_PLATFORM['mp-weixin'];
  // #endif

  return platform;
};
