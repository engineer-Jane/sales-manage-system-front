// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Params = {
    beginTime: string,
    customerName: string,
    endTime: string,
    invoiceStatus: number,
    orderStatus: number,
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
    customerId: number,
    customerName: string,
    customerType: number,
    invoiceTaxRate: number,
    invoiceType: string,
    orderAmount: number,
    orderAmountWithTax: number,
    orderAttachment: string,
    orderId: number,
    orderNo: string,
    orderTime: string,
    orderType: string,
    paymentType: string,
    products: ProductsItem[],
    remark: string,
    salesId: number,
    salesName: string
  }
}

