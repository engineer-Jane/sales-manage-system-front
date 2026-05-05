import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import BankInfo from './components/BankInfo';
import DockingInfo from './components/DockingInfo';
import { customerApi } from '@/services/api';
import { getPageQuery } from '@/utils';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const { id } = getPageQuery();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});

  /** 获取详情数据 */
  const getInfo = () => {
    customerApi.info({ customerId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data
        });
      } else {
        message.error(res?.msg);
      }
    })
  }

  useEffect(() => {
    if (id) {
      getInfo();
    }
  }, [id])

  /** 取消 */
  const onCancel = () => {
    history.push(`/base/customer`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      customerApi.save({
        ...info,
        ...values,
        salesName: form.getFieldValue('salesName')
      }).then((res: any) => {
        if (res && res?.code === 200) {
          message.success(`保存成功！`);
          onCancel();
        } else {
          message.error(res?.msg);
        }
      })
      setConfirmLoading(false);
    }).catch(() => {
      setConfirmLoading(false);
    })
  };

  return (
    <PageContainer>
      <div className="sales-form">
        <Form
          {...layout}
          form={form}
          name="form"
          scrollToFirstError={true}
        >
          {/* 客户基本信息 */}
          <BasicInfo form={form} info={info} />
          {/* 客户银行信息 */}
          <BankInfo />
          {/* 客户对接信息 */}
          <DockingInfo form={form} />
        </Form>

        <div className="sales-form-footer">
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" loading={confirmLoading} onClick={onSubmit}>
              保存
            </Button>
          </Space>
        </div>
      </div>
    </PageContainer>
  )
}

export default Add;