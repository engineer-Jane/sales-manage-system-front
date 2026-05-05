import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { useToggle } from 'ahooks';
import { costTypeApi, orderApi, userApi } from '@/services/api';
import type { API } from './typings';
import { dateShow, dateTimeShow } from '@/utils/date';
import moment from 'moment';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type AddModalProps = {
  /** 按钮名称 */
  title?: string;
  /** 当前数据 */
  current?: API.TableItem;
  /** 已选择数据 */
  selectList: any[];
  /** 选择成功回调 */
  onChange: (val: API.TableItem, current: API.TableItem | undefined) => void;
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, current, selectList, onChange } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [orderList, setOrderList] = useState<API.TableItem[]>([]);

  /** 获取订单数据 */
  const getOrder = () => {
    orderApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setOrderList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getOrder();
    if (current) {
      form.setFieldsValue({
        ...current,
        invoiceDate: moment(dateShow(current?.invoiceDate))
      });
    }
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => {
    toggle();
    setConfirmLoading(false);
    form.resetFields();
  }

  /** 提交表单并关闭弹窗 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      const formValues = {
        ...values,
        invoiceDate: dateTimeShow(values?.invoiceDate),
        orderId: form.getFieldValue('orderId')
      }
      if (onChange) {
        onChange(formValues, current);
      }
      onCancel();
      setConfirmLoading(false);
    }).catch(() => {
      setConfirmLoading(false);
    })
  }

  return (
    <>
      {title === '编辑' ? (
        <a key="edit" onClick={() => openModal()}>
          {title}
        </a>
      ) : (
        <Button type="default" onClick={() => openModal()}>
          {selectList.length > 0 ? '重新选择' : '选择订单'}
        </Button>
      )}

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`选择订单`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form
          {...layout}
          form={form}
          name="form"
          scrollToFirstError={true}
        >
          <Form.Item
            label="订单编号"
            name="orderNo"
            rules={[
              { required: true, message: '请选择订单' }
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
              onChange={(val: string, option: any) => {
                if (val) {
                  console.log('option----', option)
                  form.setFieldsValue({
                    ...option
                  })
                }
              }}
            >
              {orderList.length > 0 && orderList.map((v: API.TableItem) => {
                return <Option key={v?.orderId} value={v?.orderNo} {...v}>{v?.orderNo}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="订单金额"
            name="orderAmount"
            rules={[
              { required: true, message: '请输入订单金额' }
            ]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="销售人员"
            name="salesName"
            rules={[
              { required: true, message: '请输入销售人员' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="订单日期"
            name="orderTime"
            rules={[
              { required: true, message: '请输入订单日期' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="发票名称"
            name="invoiceName"
            rules={[
              { required: true, message: '请输入发票名称' }
            ]}
          >
            <Input allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="发票编号"
            name="invoiceNo"
            rules={[
              { required: true, message: '请输入发票编号' }
            ]}
          >
            <Input allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="发票金额"
            name="invoiceAmount"
            rules={[
              { required: true, message: '请输入发票金额' }
            ]}
          >
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="开票日期"
            name="invoiceDate"
            rules={[
              { required: true, message: '请选择开票日期' }
            ]}
          >
            <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea disabled allowClear placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;