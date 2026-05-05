import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import ProductInfo from '@/components/ProductInfo';
import { getPageQuery } from '@/utils';
import { salesQueryApi } from '@/services/api';
import { dateShow } from '@/utils/date';
import moment from 'moment';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const { id } = getPageQuery();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<API.TableItem[]>([]);
  const [info, setInfo] = useState<any>({});

  /** 获取详情数据 */
  const getInfo = () => {
    salesQueryApi.info({ queryId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setProductList(res.data?.products || []);
        form.setFieldsValue({
          ...res.data,
          expecteDeliveryDate: moment(res.data?.expecteDeliveryDate),
          validateDate: moment(res.data?.validateDate)
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
    history.push(`/inquiry`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      salesQueryApi.save({
        ...info,
        ...values,
        expecteDeliveryDate: dateShow(values?.expecteDeliveryDate),
        validateDate: dateShow(values?.validateDate),
        salesName: form.getFieldValue('salesName'),
        customerName: form.getFieldValue('customerName'),
        products: productList
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
          {/* 询价单基本信息 */}
          <BasicInfo form={form} />
          {/* 询价产品信息 */}
          <ProductInfo
            title="询价产品信息"
            list={productList}
            onChange={(list: API.TableItem[]) => setProductList(list)}
            extra="inquiry"
          />
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