// 【是】、【否】
export const WHETHER: any = {
  true: '是',
  false: '否'
}

// 性别
// export const SEX: any = {
//   0: '男',
//   1: '女'
// }
export const SEX: any = [
  { value: 0, label: '男' },
  { value: 1, label: '女' }
]

// 付款状态
export const PAYMENT_STATUS: any = [
  { value: 0, label: '已付款' },
  { value: 1, label: '未付款' },
  { value: 1, label: '部分付款' }
]

// 开票状态 
export const INVOICE_STATUS: any = [
  { value: 0, label: '未开票' },
  { value: 1, label: '已开票' }
]

// 订单状态
export const ORDER_STATUS: any = [
  { value: 0, label: '未付款' },
  { value: 1, label: '部分付款' },
  { value: 2, label: '已付款' }
]

// 发票种类
export const INVOICE_TYPE: any = [
  { value: 'ORDINARY_VAT_INVOICE', label: '普通' },
  { value: 'OTHER_INVOICE', label: '专票' },
  { value: 'SPECIAL_VAT_INVOICE', label: '收据' }
]

// 付款方式
export const PAYMENT_TYPE: any = [
  { value: 'cash_transfer_TT', label: '现金转账' },
  { value: 'LC_3_month', label: '承兑汇票3个月' },
  { value: 'LC_6_month', label: '承兑汇票6个月' },
  { value: 'LC_9_month', label: '承兑汇票9个月' }
]

// 结算方式
export const SETTLE_STYLE: any = {
  1: '先款后货',
  2: '先货后款'
}

// 收付款类型
export const OPERATE_TYPE: any = [
  { value: 'PAYMENT_PAY', label: '收款' },
  { value: 'PAYMENT_RECEIVE', label: '付款' }
]

// 审核状态
export const STATUS: any = [
  { value: 0, label: '草稿' },
  { value: 1, label: '审核中' },
  { value: 2, label: '未通过' },
  { value: 3, label: '已通过' },
  { value: 4, label: '已生效' }
]

// 客户类别
export const CUSTOMER_TYPE: any = [
  { value: 0, label: '客户' },
  { value: 1, label: '供应商' }
]

// 菜单类型
export const RESOURCE_TYPE: any = [
  { value: 'MENU', label: '菜单' },
  { value: 'BUTTON', label: '按钮' }
]

// 菜单状态
export const RESOURCE_STATUS: any = [
  { value: 'DISPLAY', label: '显示' },
  { value: 'HIDE', label: '隐藏' }
]