export {};

declare global {
  namespace API {
    // 响应数据类型
    type BaseResponse<T = null> = {
      code: number;
      msg: string;
      data: T;
      success: boolean;
      time: number;
    };

    // 带分页的响应数据类型
    type BaseResponsePaging<T> = BaseResponse<{
      records: T[];
      total: number;
    }>;
  }
}
