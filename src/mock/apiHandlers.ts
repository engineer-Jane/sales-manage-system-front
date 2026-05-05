/**
 * 销售系统业务接口 Mock 响应体（与 mock/sales-system-api 共用）
 * 构建产物在 Vercel 等静态托管上由客户端短路返回，不发起真实 HTTP。
 */

export type MockJsonBody = Record<string, unknown>;

const wrap = (data: unknown, msg = 'success'): MockJsonBody => ({
  code: 200,
  data,
  msg,
});

const mockUserInfo = {
  userId: '1',
  userName: 'admin',
  realName: '演示管理员',
  resourceCodes: [] as string[],
  phone: '13800000000',
};

const mockContract = {
  contractNo: 'MOCK-CONTRACT',
  contractDate: '—',
  contractAmount: '零元整',
  sellerInfo: {
    companyName: '（演示）供方单位',
    companyAddress: '—',
    legalRepresentative: '—',
    companyContactPerson: '—',
    companyTel: '—',
    faxNo: '—',
    bankName: '—',
    bankAccountNo: '—',
  },
  buyerInfo: {
    companyName: '（演示）需方单位',
    companyAddress: '—',
    legalRepresentative: '—',
    companyContactPerson: '—',
    companyTel: '—',
    faxNo: '—',
    bankName: '—',
    bankAccountNo: '—',
  },
  productList: [],
};

function crud(
  base: string,
  list: string,
  save: string,
  detailPath: string,
  del: string,
): Record<string, MockJsonBody> {
  return {
    [`POST ${base}/${list}`]: wrap({ records: [], total: 0 }),
    [`POST ${base}/${save}`]: wrap(null),
    [`GET ${base}/${detailPath}`]: wrap({}),
    [`DELETE ${base}/${del}`]: wrap(null),
  };
}

/** key: "METHOD /api/..." */
export const SALES_API_MOCK_BODY: Record<string, MockJsonBody> = {
  'GET /api/auth/code': wrap('mock-verify-code'),
  'GET /api/auth/info': wrap(mockUserInfo),
  'POST /api/auth/login': wrap({ token: 'mock-jwt-token' }),
  'DELETE /api/auth/logout': wrap(null),

  'GET /api/homepage/homeOrderList': wrap({ monthOrderNumber: 0, dataList: [] }),
  'GET /api/homepage/homePendingAuditOrders': wrap({ monthOrderNumber: 0, dataList: [] }),
  'GET /api/homepage/homePendingAuditQueryOrders': wrap({ monthOrderNumber: 0, dataList: [] }),
  'GET /api/homepage/homePendingPayOrReceiveOrders': wrap({ monthOrderNumber: 0, dataList: [] }),

  ...crud(
    '/api/department',
    'selectDepartmentList',
    'saveOrUpdateDepartment',
    'selectDepartmentDetail',
    'deleteDepartment',
  ),
  // 必须为树数组；分页结构会导致 TreeSelect 收到对象触发 children.forEach 报错
  'POST /api/department/selectDepartmentTreeRespList': wrap([
    {
      departmentId: '-1',
      departmentName: '全部部门',
      remark: '',
      children: [],
    },
  ]),

  'POST /api/user/selectUserList': wrap({ records: [], total: 0 }),
  'POST /api/user/saveOrUpdateUser': wrap(null),
  'GET /api/user/selectUserDetail': wrap({}),
  'DELETE /api/user/deleteUser': wrap(null),
  'POST /api/user/saveOrUpdateRoleDepartmentRelation': wrap(null),
  'POST /api/user/saveOrUpdateRoleResourceRelation': wrap(null),
  'POST /api/user/saveOrUpdateUserDepartmentRelation': wrap(null),
  'POST /api/user/saveOrUpdateUserRoleRelation': wrap(null),
  'GET /api/user/selectResourceCodeListByRoleId': wrap([]),
  'GET /api/user/selectResourceListByRoleId': wrap([]),
  'GET /api/user/selectRoleListByDepartmentId': wrap([]),
  'GET /api/user/selectRoleListByUserId': wrap([]),
  'GET /api/user/selectUserListByDepartmentId': wrap([]),

  ...crud('/api/role', 'selectRoleList', 'saveOrUpdateRole', 'selectRoleDetail', 'deleteRole'),

  'POST /api/resource/selectResourceList': wrap({ records: [], total: 0 }),
  'POST /api/resource/saveOrUpdateResource': wrap(null),
  'GET /api/resource/selectResourceDetail': wrap({}),
  'DELETE /api/resource/deleteResource': wrap(null),
  'POST /api/resource/selectResourceTree': wrap([]),

  ...crud('/api/brand', 'selectBrandList', 'saveOrUpdateBrand', 'selectBrandDetail', 'deleteBrand'),
  ...crud('/api/product', 'selectProductList', 'saveOrUpdateProduct', 'selectProductDetail', 'deleteProduct'),
  ...crud('/api/customer', 'selectCustomerList', 'saveOrUpdateCustomer', 'selectCustomerDetail', 'deleteCustomer'),
  ...crud('/api/costType', 'selectCostList', 'saveOrUpdateCost', 'selectCostDetail', 'deleteCost'),

  'POST /api/order/selectOrderList': wrap({ records: [], total: 0 }),
  'POST /api/order/saveOrUpdateOrder': wrap(null),
  'GET /api/order/selectOrderDetail': wrap({}),
  'DELETE /api/order/deleteOrder': wrap(null),
  'GET /api/order/getOrderContract': wrap(mockContract),

  'POST /api/stockOrder/selectStockOrderList': wrap({ records: [], total: 0 }),
  'POST /api/stockOrder/saveOrUpdateStockOrder': wrap(null),
  'GET /api/stockOrder/selectStockOrderDetail': wrap({}),
  'DELETE /api/stockOrder/deleteStockOrder': wrap(null),
  'GET /api/stockOrder/getDeliveryOrderInfo': wrap({
    products: { orderNo: 'MOCK', products: [] },
  }),

  ...crud(
    '/api/purchaseStockOrder',
    'selectPurchaseStockOrderList',
    'saveOrUpdatePurchaseStockOrder',
    'selectPurchaseStockOrderDetail',
    'deletePurchaseStockOrder',
  ),

  'POST /api/productStock/selectProductStockList': wrap({ records: [], total: 0 }),

  ...crud(
    '/api/paymentRecord',
    'selectPaymentRecordList',
    'saveOrUpdatePaymentRecord',
    'selectPaymentRecordDetail',
    'deletePaymentRecord',
  ),

  'POST /api/prepayment/selectPrepaymentInfoList': wrap({ records: [], total: 0 }),

  'POST /api/invoiceRecord/selectInvoiceRecordList': wrap({ records: [], total: 0 }),
  'POST /api/invoiceRecord/saveOrUpdateInvoiceRecord': wrap(null),
  'GET /api/invoiceRecord/selectInvoiceRecordDetail': wrap({}),
  'DELETE /api/invoiceRecord/deleteInvoiceRecord': wrap(null),
  'GET /api/invoiceRecord/getInvoiceReceipt': wrap({ invoices: [] }),
  'POST /api/invoiceRecord/invoiceRecordAudit': wrap(null),
  'GET /api/invoiceRecord/invoiceRecordSubmit': wrap(null),

  'POST /api/costApply/selectCostApplyList': wrap({ records: [], total: 0 }),
  'POST /api/costApply/saveOrUpdateCostApply': wrap(null),
  'GET /api/costApply/selectCostApplyDetail': wrap({}),
  'DELETE /api/costApply/deleteCostApply': wrap(null),
  'POST /api/costApply/costApplyAudit': wrap(null),
  'GET /api/costApply/costApplySubmit': wrap(null),

  'POST /api/salesQuery/selectSalesQueryInfoList': wrap({ records: [], total: 0 }),
  'POST /api/salesQuery/saveOrUpdateSalesQueryInfo': wrap(null),
  'GET /api/salesQuery/selectSalesQueryInfoDetail': wrap({}),
  'DELETE /api/salesQuery/deleteSalesQueryInfo': wrap(null),
  'POST /api/salesQuery/salesQueryInfoReply': wrap(null),
  'POST /api/salesQuery/salesQueryInfoAudit': wrap(null),
  'GET /api/salesQuery/salesQueryInfoSubmit': wrap(null),

  'POST /api/common/uploadToLocal': wrap({
    fileUrl: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    fileName: 'mock-upload.svg',
  }),
};
