import React, { useState } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import BankInfo from './components/BankInfo';
import AccountInfo from './components/AccountInfo';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  /** 取消 */
  const onCancel = () => {
    history.push(`/base/staff`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      console.log('values-----', values)
      // workspaceApi.save({
      //   ...values,
      //   id: info ? info?.id : undefined
      // }).then((res: any) => {
      //   if (res && res?.code === 1) {
      //     message.success(`保存成功！`);
      //     onCancel();
      //   } else {
      //     message.error(res?.msg);
      //   }
      // })
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
          {/* 员工基本信息 */}
          <BasicInfo />
          {/* 员工银行信息 */}
          <BankInfo />
          {/* 登录账号信息 */}
          <AccountInfo />
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