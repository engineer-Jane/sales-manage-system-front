import React, { useState } from 'react';
import { Button, Col, Drawer, Form, message, Radio, Row, Space } from 'antd';
import { useToggle } from 'ahooks';
import { invoiceApi } from '@/services/api';
import OrderInfo from '@/components/OrderInfo';
import moment from 'moment';
import FontTitle from '@/components/FontTitle';
import { CloseOutlined } from '@ant-design/icons';
import { INVOICE_TYPE } from '@/constants';
import { TransfArrObj } from '@/utils';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type DetailsDrawerProps = {
  /** 按钮名称 */
  title: string;
  /** 产品Id */
  id?: string | undefined;
  /** 保存成功回调 */
  refreshTable: () => void;
}

const DetailsDrawer: React.FC<DetailsDrawerProps> = (props) => {
  const { title, id, refreshTable } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();

  /** 获取详情数据 */
  const getInfo = () => {
    invoiceApi.info({ invoiceRecordId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data,
          invoiceDate: moment(res.data?.invoiceDate)
        });
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    if (id) {
      await getInfo();
    }
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => {
    toggle();
    setConfirmLoading(false);
    form.resetFields();
  }

  /** 审核 */
  const onAudit = (values: any) => {
    invoiceApi.audit({
      // auditStatus: "AUDITING", // AUDIT_FAILED(2,"审核不通过"), AUDIT_PASS(3,"审核通过")
      ...values,
      invoiceRecordId: id
    }).then((res: any) => {
      if (res && res?.code === 200) {
        message.success(`保存成功！`);
        onCancel();
        if (refreshTable) {
          refreshTable();
        }
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 提交表单并关闭弹窗 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      onAudit(values);
      setConfirmLoading(false);
    }).catch(() => {
      setConfirmLoading(false);
    })
  }

  return (
    <>
      <a key="edit" onClick={() => openModal()}>
        {title}
      </a>

      <Drawer
        width={780}
        title={title === '审核' ? '审核' : '查看详情'}
        placement="right"
        closable={false}
        onClose={onCancel}
        visible={visible}
        extra={<CloseOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} onClick={onCancel} />}
        footer={title === '审核' ?
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" loading={confirmLoading} onClick={onSubmit}>
              提交
            </Button>
          </Space>
          : false
        }
      >
        <FontTitle title="签收单基本信息" />
        <div className="sales-form-content" style={{ marginBottom: 40 }}>
          <Row gutter={[24, 16]}>
            <Col span={24}>
              发票签收单编号：<span style={{ fontWeight: 700 }}>{info?.invoiceRecordCode}</span>
            </Col>
            <Col span={12}>开票人员：{info?.operatorName}</Col>
            <Col span={12}>发票类型：{TransfArrObj(INVOICE_TYPE)[info?.invoiceType]}</Col>
            <Col span={12}>开票日期：{info?.invoiceDate}</Col>
            <Col span={12}>税率：{info?.invoiceRate}</Col>
            <Col span={12}>税额：{info?.taxAmount}</Col>
            <Col span={12}>发票金额：{info?.invoiceAmount}</Col>
            <Col span={24}>备注信息：{info?.remark}</Col>
          </Row>
        </div>
        {/* 订单信息 */}
        <OrderInfo
          title="订单信息"
          list={info?.orders || []}
          disable={true}
        />
        {/* 审核结果 */}
        <Form
          {...layout}
          form={form}
          name="form"
          scrollToFirstError={true}
        >
          {title === '审核' &&
            <>
              <FontTitle title="审核结果" />
              <Form.Item
                label="审核结果"
                name="status"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
              >
                <Radio.Group>
                  <Radio value="AUDIT_PASS">通过</Radio>
                  <Radio value="AUDIT_FAILED">不通过</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          }
        </Form>
      </Drawer>
    </>
  )
}

export default DetailsDrawer;