## 开发前注意事项

- 开发环境: `Node.js 18.x || >=20.x`, `yarn v1.x`
- 当前工程是采用 cli 创建的 `uniapp` 项目, 推荐使用 `VSCode` 开发, 并安装以下插件:

  - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint ESLint 负责代码质量检查
  - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode Prettier 负责代码风格统一

- 为了保证最基本的代码质量, 开发过程中遇到 ESLint 报错一定要处理, 不要忽略!!不要忽略!!不要忽略!!

## 基于 uniapp cli 初始化后做了哪些工作

- [x] 配置 `ESLint + Prettier + Husky` 控制代码质量、统一代码风格
- [x] 引入 `pinia` 全局状态管理库
- [x] 引入 `uni-ui` 扩展组件库, 可直接使用
- [x] 增加 `uni.request` 拦截器, 统一添加请求头 token 及处理登录失效场景
- [x] 增加 `auth.ts` 统一管理 token 存储
- [x] H5 编译设置环境变量, 区分开发、测试、生产环境
- [x] 小程序编译设置环境变量, 区分开发、测试、生产环境
- [ ] APP编译设置环境变量, 区分开发、测试、生产环境
- [x] 本地环境 H5 请求增加代理解决跨域问题
- [x] 规范源码目录结构, 详见下文

```bash
.
├── README.md
├── index.html
├── package.json
├── shims-uni.d.ts
├── src
│   ├── App.vue
│   ├── api # 接口请求方法
│   ├── env.d.ts
│   ├── main.ts
│   ├── manifest.json
│   ├── pages # 页面
│   │   └── index
│   │       └── index.vue
│   ├── pages.json
│   ├── shime-uni.d.ts
│   ├── static
│   │   └── logo.png
│   ├── stores # 全局状态仓库
│   │   └── counter.ts
│   ├── uni.scss
│   ├── utils # 工具函数
│   │   ├── auth.ts # 管理 token 存储
│   │   ├── getBaseUrl.ts # 根据环境变量获取后端接口地址
│   │   ├── getPlatform.ts # 获取当前平台
│   │   ├── request.ts # 增加拦截器的请求方法
│   │   └── sleep.ts
│   └── vite-env.d.ts
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

## 本地开发 & 线上部署

```bash
# 本地启动
yarn run dev:h5 # 本地启动H5
yarn run dev:mp-weixin # 本地启动微信小程序

# 发版前构建
yarn run build:h5:dev # 构建H5(开发环境)
yarn run build:h5:test # 构建H5(测试环境)
yarn run build:h5:prod # 构建H5(生产环境)

yarn run build:mp-weixin:dev # 构建微信小程序(开发环境)
yarn run build:mp-weixin:test # 构建微信小程序(测试环境)
yarn run build:mp-weixin:prod # 构建微信小程序(生产环境)
```
