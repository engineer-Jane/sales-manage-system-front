// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Params = {
    beginTime: string,
    customerName: string,
    endTime: string,
    orderNo: string,
    purchaseStockOrderType: string,
    pageNumber: number,
    pageSize: number
  };

  type ProductsItem = {
    buyNumber: number,
    deliverAmount: number,
    deliverTime: string,
    productBrand: string,
    productCode: string,
    productId: number,
    productName: string,
    productPrice: number,
    productUnit: number,
    totalAmount: number
  }

  type TableItem = {
    contractAmount: number,
    customerId: number,
    customerName: string,
    invoiceType: string,
    operater: string,
    operaterId: number,
    orderId: number,
    orderNo: string,
    products: ProductsItem[],
    purchaseStockId: number,
    purchaseStockOrderNo: string,
    purchaseStockOrderType: string,
    remark: string,
    stockTime: string,
    taxAmount: number,
    taxRate: number,
    stockOrderId: string
  }
}

