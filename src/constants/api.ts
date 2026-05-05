export const EXPORT_URL: Record<string, string> = {
  ORDER: '/api/order/exportOrderDetail', // 订单管理
  SALE: '/api/stockOrder/exportStockOrder', // 销售出库退库管理
  STOCK: '/api/purchaseStockOrder/exportPurchaseStockOrder', // 采购入库退库单管理
  PRODUCT_STOCK: '/api/productStock/exportProductStockDetail', // 库存明细表
  PREPAYMENT: '/api/prepayment/exportPrepaymentInfoList', // 待收款待付款记录管理
  PREPAYMENT_RECORD: '/api/paymentRecord/exportPaymentRecordList', // 收付款记录管理
  INVOICE_RECORD: '/api/invoiceRecord/exportInvoiceRecordList', // 发票记录管理
  /** 费用报销导出（与后端约定路径，若不一致请改此处） */
  COST_APPLY: '/api/costApply/exportCostApplyList',
};

export const IMPORT_URL: any = {

};
