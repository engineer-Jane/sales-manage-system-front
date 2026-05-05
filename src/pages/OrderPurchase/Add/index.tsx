import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import ProductInfo from '@/components/ProductInfo';
import { getPageQuery } from '@/utils';
import { orderApi } from '@/services/api';
import { dateTimeShow } from '@/utils/date';
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
    orderApi.info({ orderId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setProductList(res.data?.products);
        form.setFieldsValue({
          ...res.data,
          orderTime: moment(res.data?.orderTime),
          settlementDate: moment(res.data?.settlementDate)
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
    history.push(`/order/purchase`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      orderApi.save({
        ...info,
        ...values,
        orderTime: dateTimeShow(values?.orderTime),
        settlementDate: dateShow(values?.settlementDate),
        customerName: form.getFieldValue('customerName'),
        salesName: form.getFieldValue('salesName'),
        products: productList,
        orderType: 'PURCHASE_ORDER'
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
          {/* 订单基本信息 */}
          <BasicInfo form={form} info={info} />
          {/* 订单产品信息 */}
          <ProductInfo title="订单产品信息" list={productList} onChange={(list: API.TableItem[]) => setProductList(list)} />
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