/** 出库单 - pdf */
import React, { useState } from 'react';
import { useToggle } from 'ahooks';
import { Button, message, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ExportPdf, Previewpdf } from '@/utils/pdf';
import { saleApi } from '@/services/api';

type TableItem = {
  buyAmount: number;
  deliverTime: string;
  productCode: string;
  productPrice: number;
  productUnit: string;
  totalProductAmount: number;
  orderNo?: string;
}

type ExWarehousePdfProps = {
  /** id */
  id: string;
}

const remarkList = [
  `1、以上信息请正楷填写；`,
  `2、以上信息请按照收货方采购部提供信息正确填写，如信息有误，将影响您的货物收货报检及时性；`,
  `3、请将发票等资料单独寄往采购人员处；`,
  `4、上述所有字段内容，请以采购方数据为准；`,
  `5、国外器件每种产品包装上面必须注明生产厂家。`
]

const ExWarehousePdf: React.FC<ExWarehousePdfProps> = (props) => {
  const { id } = props;
  const [visible, { toggle }] = useToggle(false);
  const [info, setInfo] = useState<any>({});
  const [dataSource, setDataSource] = useState<TableItem[]>([]);

  /** 获取出库单详情数据 */
  const getDeliveryOrderInfo = () => {
    saleApi.getDeliveryOrderInfo({ saleStockOrderId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        const products = res.data?.products?.products;
        let list: TableItem[] = [];
        if (products.length > 0) {
          list = products.map((v: TableItem) => {
            return {
              ...v,
              orderNo: res.data?.products?.orderNo
            }
          })
        }
        setDataSource(list);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getDeliveryOrderInfo();
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => toggle();


  const columns: ColumnsType<TableItem> = [
    {
      title: '送货单位全称（供应商）',
      children: [
        {
          title: '订单号',
          dataIndex: 'orderNo',
        }
      ]
    },
    {
      title: info?.deliveryCompany,
      children: [
        {
          title: '产品型号',
          dataIndex: 'productCode',
        },
        {
          title: '产品单价（含税）',
          dataIndex: 'productPrice',
        },
        {
          title: '单位（pcs）',
          dataIndex: 'productUnit',
        },
        {
          title: '到货数量',
          dataIndex: 'buyAmount',
        },
        {
          title: '产品总价（含税）',
          dataIndex: 'totalProductAmount',
        },
        {
          title: '交货时间',
          dataIndex: 'deliverTime',
        },
      ]
    },
  ];

  return (
    <>
      <a key="edit" onClick={() => openModal()}>出库单</a>

      <Modal
        width={800}
        centered
        destroyOnClose
        maskClosable={false}
        title={``}
        visible={visible}
        // confirmLoading={confirmLoading}
        onCancel={onCancel}
        // onOk={onSubmit}
        footer={null}
        className="sales-pdf-modal"
        style={{ height: 662 }}
      >
        <div id="sales-pdf-ex-warehouse" style={{ background: '#fff', padding: '24px 40px 40px 40px' }}>
          <h2 style={{ fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>发（送）货单</h2>
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            footer={() => {
              return <div>
                <span>采购业务员：</span>
                <span>{info?.salesMan}</span>
                <span>送货日期：</span>
                <span style={{ borderRightWidth: 0 }}>{info?.deliveryDate}</span>
              </div>
            }}
            className="sales-pdf-table sales-pdf-table-ex-warehouse"
          />
          <div style={{ display: 'flex', margin: '24px 0' }}>
            <span style={{ width: 45 }}>备注：</span>
            <div>
              {remarkList.map((v: string) => {
                return <p style={{ margin: 0 }}>{v}</p>
              })}
            </div>
          </div>
          <div id="sales-pdf-ex-warehouse-btn" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={() => Previewpdf('sales-pdf-ex-warehouse', 'sales-pdf-ex-warehouse-btn')}>打印预览</Button>
              <Button type="primary" onClick={() => ExportPdf('sales-pdf-ex-warehouse', 'sales-pdf-ex-warehouse-btn', '出库单')}>导出pdf</Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ExWarehousePdf;