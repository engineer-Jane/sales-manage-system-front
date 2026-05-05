import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import OrderInfo from '@/components/OrderInfo';
import { getPageQuery } from '@/utils';
import { invoiceApi } from '@/services/api';
import moment from 'moment';
import { dateShow, dateTimeShow } from '@/utils/date';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const { id } = getPageQuery();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<API.TableItem[]>([]);
  const [info, setInfo] = useState<any>({});

  /** 获取详情数据 */
  const getInfo = () => {
    invoiceApi.info({ invoiceRecordId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setOrderList(res.data?.orders);
        form.setFieldsValue({
          ...res.data,
          invoiceDate: moment(dateShow(res.data?.invoiceDate))
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
    history.push(`/bills/invoice`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      invoiceApi.save({
        ...info,
        ...values,
        invoiceDate: dateTimeShow(values?.invoiceDate),
        operatorName: form.getFieldValue('operatorName'),
        orders: orderList
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
          {/* 签收单基本信息 */}
          <BasicInfo form={form} />
          {/* 订单信息 */}
          <OrderInfo title="订单信息" list={orderList} onChange={(list: API.TableItem[]) => setOrderList(list)} />
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