import Utils from '@/utils/utils';
import { withSalesMockRequest } from '@/utils/mockApiClient';
import { request } from 'umi';

const requestWithMock = withSalesMockRequest(request);
Utils.init(requestWithMock);

// 系统授权
export * as authApi from './Auth';

// 工作台
export * as workspaceApi from './Workspace';

// 基础信息管理
// 部门管理
export * as departmentApi from './Department';
// 员工管理
export * as userApi from './User';
// 角色管理
export * as roleApi from './Role';
// 菜单管理
export * as resourceApi from './Resource';
// 产品品牌管理
export * as brandApi from './Brand';
// 产品管理
export * as productApi from './Product';
// 客户管理
export * as customerApi from './Customer';
// 费用类型管理
export * as costTypeApi from './CostType';

// 订单管理
export * as orderApi from './Order';

// 销售管理
// 销售出库退库管理
export * as saleApi from './Sale';

// 库存管理
// 采购入库退库单管理
export * as stockApi from './Stock';
// 库存明细表 
export * as productStockApi from './Stock/productStock';

// 财务管理
// 收付款记录管理
export * as paymentRecordApi from './PaymentRecord';
// 待收款待付款记录管理
export * as prepaymentApi from './Prepayment';
// 发票管理
export * as invoiceApi from './Invoice';

// 日常管理
// 费用报销管理
export * as costApplyApi from './CostApply';

// 询价管理
export * as salesQueryApi from './SalesQuery';
