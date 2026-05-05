import React, { useState } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import ProductInfo from '@/components/ProductInfo';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<API.TableItem[]>([]);

  /** 取消 */
  const onCancel = () => {
    history.push(`/stock/return`);
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
          {/* 退库单基本信息 */}
          <BasicInfo />
          {/* 退库单产品信息 */}
          <ProductInfo title="退库单产品信息" onChange={(list: API.TableItem[]) => setProductList(list)} />
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