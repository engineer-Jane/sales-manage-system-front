import React, { useState } from 'react';
import { Button, Col, Drawer, Form, message, Radio, Row, Space } from 'antd';
import { useToggle } from 'ahooks';
import { costApplyApi } from '@/services/api';
import ExpenseInfo from '@/components/ExpenseInfo';
import moment from 'moment';
import FontTitle from '@/components/FontTitle';
import { CloseOutlined } from '@ant-design/icons';

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
    costApplyApi.info({ costApplyId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data,
          applyTime: moment(res.data?.applyTime)
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
    costApplyApi.audit({
      // auditStatus: "AUDITING", // AUDIT_FAILED(2,"审核不通过"), AUDIT_PASS(3,"审核通过")
      ...values,
      costApplyId: id
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
        <FontTitle title="报销单基本信息" />
        <div className="sales-form-content" style={{ marginBottom: 40 }}>
          <Row gutter={[24, 16]}>
            <Col span={24}>
              报销单编号：<span style={{ fontWeight: 700 }}>{info?.costApplyNo}</span>
            </Col>
            <Col span={12}>报销人员：{info?.userName}</Col>
            <Col span={12}>报销金额：{info?.applyAmount}</Col>
            <Col span={12}>报销日期：{info?.applyTime}</Col>
            <Col span={24}>备注信息：{info?.remark}</Col>
          </Row>
        </div>
        {/* 询价产品信息 */}
        <ExpenseInfo
          title="费用项目信息"
          list={info?.costs || []}
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
                name="applyStatus"
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