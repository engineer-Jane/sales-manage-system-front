import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import { getPageQuery } from '@/utils';
import { paymentRecordApi } from '@/services/api';
import moment from 'moment';
import { dateShow } from '@/utils/date';

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
    paymentRecordApi.info({ paymentId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data,
          paymentDate: moment(dateShow(res.data?.paymentDate))
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
    history.push(`/bills/paymentRecord`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      paymentRecordApi.save({
        ...info,
        ...values,
        paymentDate: dateShow(values?.paymentDate),
        orderNo: form.getFieldValue('orderNo'),
        payeeCompanyName: form.getFieldValue('payeeCompanyName'),
        payorCompanyName: form.getFieldValue('payorCompanyName'),
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
          {/* 收付款信息 */}
          <BasicInfo form={form} info={info} />
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