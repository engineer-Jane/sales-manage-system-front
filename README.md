# 销售管理系统 · 前端

基于 [Ant Design Pro](https://pro.ant.design) 与 [Umi 3](https://umijs.org/) 的企业销售业务前端：涵盖工作台、基础资料、订单与出入库、库存明细、财务收付款与发票、费用报销与询价等模块。

## 技术栈

| 类别 | 说明 |
|------|------|
| 框架 | React 17、Umi 3 |
| UI | Ant Design 4、ProComponents（ProLayout / ProTable / ProForm） |
| 语言 | TypeScript（及部分历史 `.js`） |
| 构建 | Webpack 5（需 Node OpenSSL 兼容参数，见下方脚本） |

## 功能模块（路由概览）

- **工作台**：`/workspace`
- **基础信息管理**：部门、员工、角色、菜单、权限、品牌、产品、客户、费用类型等（`/base/*`）
- **订单管理**：销售订单、采购订单（`/order/*`）
- **销售管理**：销售出库单、销售退库单（`/sale/*`）
- **库存管理**：采购入库单、采购退库单、库存明细（`/stock/*`）
- **财务管理**：收付款记录、待收待付款明细、发票（`/bills/*`）
- **日常管理**：费用报销（`/daily/*`）
- **询价管理**：`/inquiry/*`
- **登录**：`/user/login`（默认登录后进入工作台）

## 环境要求

- Node.js ≥ 12（推荐使用 **18 LTS** 或 **20 LTS**；使用较新 Node 时依赖脚本中的 `NODE_OPTIONS=--openssl-legacy-provider` 完成构建）
- npm（或 yarn / pnpm，仓库未强制锁文件时需自行处理依赖解析）

## 快速开始

安装依赖（当前依赖树存在 peer 冲突，需使用 legacy 解析）：

```bash
npm install --legacy-peer-deps
```

启动本地开发（默认走 Mock / 本地数据，不指向外网网关，详见「接口与 Mock」）：

```bash
npm start
# 或
npm run start:dev
```

浏览器访问控制台输出的本地地址（常见为 `http://localhost:8000`，端口占用时会顺延）。

生产构建：

```bash
npm run build
```

产物目录为 **`dist`**，可通过 `npm run serve`（`umi-serve`）本地预览静态资源。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm start` / `npm run start:dev` | 开发模式 |
| `npm run start:no-mock` | 开发模式且关闭 Umi Mock（需自行配置代理连后端） |
| `npm run build` | 生产构建（含 OpenSSL legacy，适配新版 Node） |
| `npm run lint` | 代码规范与 TS 检查 |
| `npm run lint:fix` | ESLint 自动修复（含部分样式） |
| `npm test` | 单元测试 |
| `npm run tsc` | 仅 TypeScript 类型检查 |

## 接口与 Mock

- 开发环境下接口前缀采用相对路径 **`/api/*`**，由 **`mock/`** 与 **`src/mock/apiHandlers.ts`** 中的约定数据拦截或短路，便于无后端联调。
- 连接**真实后端**时：
  - 可设置环境变量 **`REACT_APP_API_HOST`** 为网关地址；
  - 将 **`REACT_APP_USE_MOCK_API`** 设为 **`false`**（否则在 Vercel 等构建环境中可能仍走前端 Mock）；
  - 并在 `config/proxy.ts` 的 `dev` 中按需配置 `/api` 代理 `target`。
- 导出 Excel 等二进制接口使用独立请求逻辑，需携带与业务一致的鉴权头；详见 `src/utils/file.tsx`。

## Vercel 部署

仓库根目录提供 **`vercel.json`**：安装命令使用 `npm install --legacy-peer-deps`，输出目录为 **`dist`**，并对 SPA 增加回写规则；其中 **`build.env.REACT_APP_USE_MOCK_API=true`** 会在 Vercel 构建时写入前端产物，**默认不请求真实后端**（与本地 Mock 演示一致）。若需连线上 API：在 Vercel 项目 Environment Variables 中将 **`REACT_APP_USE_MOCK_API`** 设为 **`false`**，并配置 **`REACT_APP_API_HOST`**（须为 **HTTPS** 地址，否则在 Vercel 的 HTTPS 站点上易被浏览器拦截为 Mixed Content，控制台表现为 **Failed to fetch**）。自定义域名部署若不走 `*.vercel.app`，请确保构建时能注入 **`VERCEL=1`** 或在面板中设置 **`REACT_APP_USE_MOCK_API=true`** 以继续走前端 Mock。

## 目录说明（简要）

```
config/          Umi 配置、路由、代理、主题等
mock/            开发期 Mock 路由（与 src/mock 共享数据时可对照）
src/
  pages/         页面与业务模块
  services/      接口封装
  components/    公共组件
  utils/         请求、工具函数等
```

## 参考文档

- [Ant Design Pro](https://pro.ant.design)
- [Umi 3](https://umijs.org/)
- [Ant Design 4](https://ant.design/)
