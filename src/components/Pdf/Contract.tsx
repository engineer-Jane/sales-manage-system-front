/** 合同 - pdf */
import React, { useState } from 'react';
import { useToggle } from 'ahooks';
import { Button, Col, Divider, message, Modal, Row, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ExportPdf, Previewpdf } from '@/utils/pdf';
import { orderApi } from '@/services/api';

type TableItem = {
  buyAmount: number; // 数量
  deliverTime: string; // 交货时间
  productCode: string; // 产品型号
  productPrice: number; // 产品单价(含税)
  productUnit: string; // 单位
  totalProductAmount: number; // 产品总价(含税)
}

type ContractPdfProps = {
  /** 订单id */
  id: string;
}

const explainList = [
  `二．交（提）货地点、方式及质量等级：需方  快递  工业级`,
  `三．运输方式及到达站（港）和费用负担：快递  供方`,
  `四．合理损耗及计算方法：无`,
  `五．包装标准、包装物的供应与回收：按产品技术标准或国家相关标准，防静电包装，保证货到合格；包装不回收`,
  `六．验收标准、方法及提出异议期限：按技术协议，  需方需在收到货后15天内提出质量异议，否则质量视为无异议。`,
  `七．随机备品、配件工具数量及供应办法：合格证，测试数据`,
  `八．结算方式及期限：T/T 先款后货`,
  `九．如需提供担保，另立合同担保书，作为本合同  附件：无`,
  `十．违约责任：按《合同法》执行`,
  `十一．解决合同纠纷方式：本合同履行中发生争议，双方当事人应及时协商解决，协商不成可申请有关部门进行调解。协调不成或调解未达成协议，双方当事人同意可向需方所在地人民法院起诉）。`,
  `十二．其它事项：无。`,
];
const defaultInfoList = [{
  title: '供 方'
}, {
  title: '需 方'
}]

const ContractPdf: React.FC<ContractPdfProps> = (props) => {
  const { id } = props;
  const [visible, { toggle }] = useToggle(false);
  const [info, setInfo] = useState<any>({});
  const [infoList, setInfoList] = useState<any[]>(defaultInfoList);

  /** 获取合同详情数据 */
  const getOrderContract = () => {
    orderApi.getOrderContract({ orderId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        const newInfoList = [{
          title: '供 方',
          ...res.data?.sellerInfo
        }, {
          title: '需 方',
          ...res.data?.buyerInfo
        }];
        setInfoList(newInfoList);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    toggle();
    getOrderContract();
  }

  /** 关闭弹窗 */
  const onCancel = () => toggle();

  const columns: ColumnsType<TableItem> = [
    {
      title: '产品型号',
      dataIndex: 'productCode',
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
    },
    {
      title: '数量',
      dataIndex: 'buyAmount',
    },
    {
      title: '单价含税',
      dataIndex: 'productPrice',
    },
    // {
    //   title: '总价含税',
    //   dataIndex: 'totalProductAmount',
    // },
    {
      title: '金额含税',
      dataIndex: 'money',
    },
    {
      title: '交货时间',
      dataIndex: 'deliverTime',
    },
  ];

  return (
    <>
      <a key="edit" onClick={() => openModal()}>合同</a>

      <Modal
        width={840}
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
        <div id="sales-pdf-contract" style={{ background: '#fff', padding: '24px 40px 0 40px' }}>
          <Divider style={{ borderTopColor: 'rgba(0, 0, 0, 0.85)', marginTop: 0 }} />
          <p style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>合同档案号：<span style={{ fontWeight: 600 }}>{info?.contractNo}</span></p>
          <h2 style={{ fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>产品采购（加工）合同</h2>
          <Row gutter={24} style={{ marginBottom: 12 }}>
            <Col span={12}>供方：{info?.sellerInfo?.companyName}</Col>
            <Col span={12}>合同编号：{info?.contractNo}</Col>
          </Row>
          <Row gutter={24} style={{ marginBottom: 12 }}>
            <Col span={12}>需方：{info?.buyerInfo?.companyName}</Col>
            <Col span={12}>签订地点：{info?.sellerInfo?.companyAddress}</Col>
          </Row>
          <Row gutter={24} style={{ marginBottom: 12 }}>
            <Col span={12}></Col>
            <Col span={12} style={{ display: 'flex' }}>
              签订时间：{info?.contractDate}
            </Col>
          </Row>
          <p style={{ margin: '16px 0 12px 0' }}>一．产品名称、型号、数量、金额、供货时间、厂家：</p>
          <Table
            columns={columns}
            dataSource={info?.productList}
            bordered
            pagination={false}
            footer={() => `合计金额(大写): ${info?.contractAmount}`}
            className="sales-pdf-table"
            style={{ marginBottom: 12 }}
          />
          {explainList.map((v: string) => {
            return <p style={{ margin: 0 }}>{v}</p>
          })}
          <Row gutter={0} style={{ margin: '24px 0' }}>
            {infoList.map((v: any, i: number) => {
              return (
                <Col span={12}>
                  <div style={{ padding: 24, border: '1px solid rgba(0, 0, 0, 0.85)', borderLeftWidth: i === 1 ? 0 : 1 }}>
                    <h2 style={{ fontWeight: 700, textAlign: 'center' }}>{v.title}</h2>
                    <p style={{ margin: 0 }}>单位名称(章) : {v?.companyName}</p>
                    <p style={{ margin: 0 }}>单位地址 : {v?.companyAddress}</p>
                    <p style={{ margin: 0 }}>法定代表人 : {v?.legalRepresentative}</p>
                    <p style={{ margin: 0 }}>委托代理人 : {v?.companyContactPerson}</p>
                    <p style={{ margin: 0 }}>电    话：{v?.companyTel}</p>
                    <p style={{ margin: 0 }}>传    真：{v?.faxNo}</p>
                    <p style={{ margin: 0 }}>开户银行：{v?.bankName}</p>
                    <p style={{ margin: 0 }}>账    号：{v?.bankAccountNo}</p>
                  </div>
                </Col>
              )
            })}
          </Row>
          <div id="sales-pdf-contract-btn" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={() => Previewpdf('sales-pdf-contract', 'sales-pdf-contract-btn')}>打印预览</Button>
              <Button type="primary" onClick={() => ExportPdf('sales-pdf-contract', 'sales-pdf-contract-btn', '合同')}>导出pdf</Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ContractPdf;