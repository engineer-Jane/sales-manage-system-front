/** 签收单 - pdf */
import React, { useState } from 'react';
import { useToggle } from 'ahooks';
import { Button, message, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ExportPdf, Previewpdf } from '@/utils/pdf';
import { invoiceApi } from '@/services/api';

type TableItem = {
  invoiceAmount: number,
  invoiceDate: string,
  invoiceName: string,
  invoiceNo: string,
  number: number,
  remark: string
}

type ReceiptPdfProps = {
  /** 订单id */
  id: string;
}

const ReceiptPdf: React.FC<ReceiptPdfProps> = (props) => {
  const { id } = props;
  const [visible, { toggle }] = useToggle(false);
  const [info, setInfo] = useState<any>({});
  const [dataSource, setDataSource] = useState<TableItem[]>([]);

  /** 获取数据详情 */
  const getInvoiceReceipt = () => {
    invoiceApi.getInvoiceReceipt({ invoiceRecordId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setDataSource(res.data?.invoices);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getInvoiceReceipt();
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => toggle();


  const columns: ColumnsType<TableItem> = [
    {
      title: '开票日期',
      dataIndex: 'invoiceDate',
    },
    {
      title: '发票名称',
      dataIndex: 'invoiceName',
    },
    {
      title: '发票编号',
      dataIndex: 'invoiceNo',
    },
    {
      title: '张数',
      dataIndex: 'number',
    },
    {
      title: '发票金额',
      dataIndex: 'invoiceAmount',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  return (
    <>
      <a key="edit" onClick={() => openModal()}>签收单</a>

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
        <div id="sales-pdf-receipt" style={{ background: '#fff', padding: '24px 40px 40px 40px' }}>
          <h2 style={{ fontWeight: 700, textAlign: 'center' }}>发票签收回执单</h2>
          <p style={{ margin: '24px 0' }}>{info?.companyName}</p>
          <div style={{ marginLeft: 24 }}>
            <p style={{ textIndent: 28, margin: 0 }}>您好！为了完善我们公司的服务流程，烦请您在收到发票后，在此回执单上签字并回传，非常感谢你的支持与配合！</p>
            <p style={{ textIndent: 28 }}>{`今收到${info?.companyName}于 ${info?.invoiceDate}开据的增值税专用发票（ 1 ）份，发票详细信息如下：`}</p>
            <Table
              columns={columns}
              dataSource={dataSource}
              bordered
              pagination={false}
              footer={() => `总金额：${info?.totalInvoiceAmount}`}
              className="sales-pdf-table"
            />
            <p style={{ margin: '40px 0' }}>确认：核对无误</p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <p style={{ width: '250px' }}>接收人签字：</p>
              <p style={{ width: '250px', marginTop: 16 }}>日期:
                <span> __________ 年</span>
                <span> _______ 月</span>
                <span> _______ 日</span>
              </p>
            </div>
          </div>
          <div id="sales-pdf-receipt-btn" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={() => Previewpdf('sales-pdf-receipt', 'sales-pdf-receipt-btn')}>打印预览</Button>
              <Button type="primary" onClick={() => ExportPdf('sales-pdf-receipt', 'sales-pdf-receipt-btn', '签收单')}>导出pdf</Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ReceiptPdf;