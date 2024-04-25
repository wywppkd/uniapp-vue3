import request from '../utils/request';

type LangConfig = {
  lang: string;
  content: string;
  weight: number;
  isDeleted: string;
};

export function listQuerySupportI18nConfig(data: {
  mockId: string;
}): Promise<API.BaseResponse<LangConfig[]>> {
  return request({
    method: 'POST',
    url: '/tojoy-tenant/sys-i18n/listQuerySupportI18nConfig',
    data,
  });
}
