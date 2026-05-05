import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import ProductInfo from '@/components/ProductInfo';
import { saleApi } from '@/services/api';
import { getPageQuery } from '@/utils';
import { dateShow, dateTimeShow } from '@/utils/date';
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
    saleApi.info({ saleStockOrderId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setProductList(res.data?.products);
        form.setFieldsValue({
          ...res.data,
          deliveryTime: moment(dateShow(res.data?.deliveryTime))
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
    history.push(`/sale/storage`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      saleApi.save({
        ...info,
        ...values,
        deliveryTime: dateTimeShow(values?.deliveryTime),
        salesName: form.getFieldValue('salesName'),
        orderNo: form.getFieldValue('orderNo'),
        products: productList,
        saleStockOrderType: 'SALES_STORAGE'
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
          {/* 出库单基本信息 */}
          <BasicInfo form={form} />
          {/* 出库单产品信息 */}
          <ProductInfo
            title="出库单产品信息"
            list={productList}
            onChange={(list: API.TableItem[]) => setProductList(list)}
            extra="saleStorage"
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