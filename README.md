# 销售管理系统 · 前端

基于 [Ant Design Pro](https://pro.ant.design) 与 [Umi 3](https://umijs.org/zh-CN) 的销售业务控制台：工作台、基础资料、订单与出入库、库存与财务、费用报销与询价等。开发环境支持前端 Mock，便于无后端联调；生产构建可对接真实网关。

## 技术栈

| 类别 | 说明 |
|------|------|
| 框架 | React 17、Umi 3 |
| UI | Ant Design 4、[@ant-design/pro-*](https://procomponents.ant.design/)（ProLayout / ProTable / ProForm 等） |
| 语言 | TypeScript（及部分历史 `.js`） |
| 构建 | Webpack（通过 Umi；脚本中带 `NODE_OPTIONS=--openssl-legacy-provider` 以适配较新 Node） |

## 功能模块（路由概览）

| 模块 | 路径前缀 | 说明 |
|------|-----------|------|
| 工作台 | `/workspace` | 首页看板 |
| 权限配置 | `/permission-config` | **本地/会话权限演示**：勾选一级菜单、二级页面、按钮权限；写入 `localStorage` 后与侧栏路由、`Access` 组件联动（该路由不设 `access`，避免误操作后无法恢复） |
| 基础信息管理 | `/base/*` | 部门、员工、角色、菜单（资源）、权限分配、品牌、产品、客户、费用类型等 |
| 订单管理 | `/order/*` | 销售订单、采购订单及新增页 |
| 销售管理 | `/sale/*` | 销售出库单、销售退库单及新增页 |
| 库存管理 | `/stock/*` | 采购入库单、采购退库单、库存明细 |
| 财务管理 | `/bills/*` | 收付款记录、待收待付款明细、发票 |
| 日常管理 | `/daily/*` | 费用报销 |
| 询价管理 | `/inquiry/*` | 询价列表与新增 |
| 登录 | `/user/login` | 登录成功后默认进入工作台 |

各业务路由在 `config/routes.ts` 中配置 `access: 'normalRouteFilter'` 与 `auth` 权限码；侧栏与访问控制依赖全局 `permissionCodes`（见下文）。

## 权限说明

- **数据来源**：登录接口 `/api/auth/info` 返回的用户信息中的 `resourceCodes` 会写入 `localStorage`（键名 `permissionCodes`），并在 `src/app.tsx` 的 `getInitialState` 中注入。
- **运行时校验**：`src/access.ts` 提供 `auth(code)`（按钮等）与 `normalRouteFilter(route)`（菜单路由）；未配置 `auth` 的路由（如权限配置页）不做过滤。
- **权限清单**：`src/constants/permissionRegistry.ts` 中的 `PERMISSION_MODULES` 维护「一级模块 → 二级页面 → 按钮」树，与路由及各页 `<Access>` 使用的字符串保持一致。
- **演示环境**：`src/mock/apiHandlers.ts` 中演示用户默认下发 `getAllRegisteredCodes()`，即注册表中的全部权限；对接真实后端时需保证后端返回的编码与前端路由、`permissionRegistry` 一致（含如 `workspace`、`sale.retrieval.*`、`stock.retrieval.*` 等）。
- **默认全开**：若本地无 `permissionCodes` 或登录后用户信息里 `resourceCodes` 为空数组，前端会写入 **`getAllRegisteredCodes()`**（菜单与各页按钮权限均已勾选），避免侧栏空白；后端若有下发则以服务端列表为准。注册表中 **`getAllMenuPermissionCodes()`** 仅含菜单路由码，可供扩展使用。
- **工作台**：权限码 **`workspace`**（`/workspace`）会通过 **`withDefaultWorkspaceAccess`** 在登录合并及本地缓存读取时自动补足，避免后端未下发时无法进入工作台首页。

## 数据脱敏

- **工具**：`src/utils/desensitize.ts` 提供 `displayMasked` 及手机号、姓名、地址、税号、银行卡号等掩码函数；仅在 **表格等只读展示** 中使用，**表单编辑页不入库前勿脱敏**，以免保存错误数据。
- **已接入列表**：员工管理、权限管理-用户表、客户管理（电话与地址）、产品品牌管理（厂家电话与地址）、员工管理（Staff）列表中的姓名与电话等字段。
- **调试**：构建或启动环境变量 **`REACT_APP_DESENSITIZE=false`** 时展示明文（仅限可信调试环境）。

## 环境要求

- Node.js ≥ 12（推荐 **18 LTS** 或 **20 LTS**）
- 安装依赖时当前依赖树可能存在 peer 冲突，建议使用：

```bash
npm install --legacy-peer-deps
```

## 快速开始

启动本地开发（默认可走 Mock，见「接口与 Mock」）：

```bash
npm start
# 或
npm run start:dev
```

浏览器访问终端输出的地址（常见为 `http://localhost:8000`，端口占用时会顺延）。

生产构建：

```bash
npm run build
```

产物目录为 **`dist`**，可使用 `npm run serve`（`umi-serve`）本地预览静态资源。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm start` / `npm run start:dev` | 开发模式 |
| `npm run start:no-mock` | 开发模式且关闭 Umi Mock（需自行配置代理连后端） |
| `npm run start:test` | 测试环境变量 + 关闭 Mock |
| `npm run build` | 生产构建 |
| `npm run lint` | ESLint、Stylelint、Prettier 与 TS 检查 |
| `npm run lint:fix` | ESLint 自动修复（及部分样式） |
| `npm run tsc` | 仅 TypeScript 类型检查 |
| `npm test` | 单元测试 |
| `npm run test:e2e` | Playwright E2E（需先安装浏览器） |
| `npm run openapi` | 根据 OpenAPI 生成接口代码（需项目已配置） |

## 接口与 Mock

- 请求经 `src/utils/request.ts` 等封装；`src/app.tsx` 中注册了请求中间件，在开启 Mock 时可由 **`src/utils/mockApiClient.ts`** 与 **`src/mock/apiHandlers.ts`** 对 `/api/*` 进行短路返回，无需真实 HTTP。
- 连接**真实后端**时建议：
  - 设置 **`REACT_APP_API_HOST`** 为网关根地址；
  - 将 **`REACT_APP_USE_MOCK_API`** 设为 **`false`**（静态托管构建产物中若为 `true` 仍可能走前端 Mock）；
  - 在 `config/proxy.ts` 的 `dev` 中为 `/api` 配置 `target`（当前默认注释说明由 Mock 承接）。
- Excel 导出等见 `src/utils/file.tsx`，需与业务一致的鉴权头。

## Vercel 部署

根目录 **`vercel.json`** 约定：安装使用 `npm install --legacy-peer-deps`，输出 **`dist`**，并配置 SPA 回写。构建环境变量 **`REACT_APP_USE_MOCK_API`** 控制是否在浏览器侧使用 Mock；若连线上 API，请在面板中将该项设为 **`false`** 并配置 **`REACT_APP_API_HOST`**（生产站点建议使用 **HTTPS**，避免 Mixed Content）。细节以 `vercel.json` 与部署平台说明为准。

## 目录说明（简要）

```
config/                    Umi 配置、路由（routes）、代理、主题等
mock/                      开发期 Mock 路由（可与 src/mock 对照）
src/
  access.ts                Umi 权限插件：permissionCodes → auth / normalRouteFilter
  app.tsx                  运行时布局、initialState、全局 request 中间件
  constants/
    permissionRegistry.ts  权限树与 getAllRegisteredCodes（配置页 + Mock）
  pages/                   页面与业务模块
  services/                接口封装
  components/              公共组件
  mock/apiHandlers.ts      业务接口 Mock 响应体映射
  utils/                   请求、本地缓存、文件导出、desensitize（列表脱敏）等
```

## 参考文档

- [Ant Design Pro](https://pro.ant.design)
- [Umi 3](https://umijs.org/zh-CN/)
- [Umi 插件 - access](https://umijs.org/zh-CN/plugins/plugin-access)
- [Ant Design 4](https://ant.design/index-cn)
