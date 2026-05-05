import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { INVOICE_TYPE } from '@/constants';
import { customerApi, orderApi, userApi } from '@/services/api';


const { Option } = Select;

type BasicInfoProps = {
  /** form */
  form: any;
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form } = props;
  const [customerList, setCustomerList] = useState<any[]>([]); // 客户数据
  const [userList, setUserList] = useState<any[]>([]); // 销售人员数据
  const [orderList, setOrderList] = useState<any[]>([]); // 采购订单数据

  /** 获取采购订单数据 */
  const getOrder = () => {
    orderApi.query({
      pageNumber: 1,
      pageSize: 1000,
      orderType: 'PURCHASE_ORDER',
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setOrderList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 客户数据 */
  const getCustomer = () => {
    customerApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setCustomerList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 获取销售人员数据 */
  const getUser = () => {
    userApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setUserList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  useEffect(() => {
    getOrder();
    getCustomer();
    getUser();
  }, [])

  return (
    <>
      <FontTitle title="入库单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="采购单编号"
              name="orderId"
              rules={[
                { required: true, message: '请选择采购单编号' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      orderNo: option?.label
                    })
                  }
                }}
              >
                {orderList.length > 0 && orderList.map((v) => {
                  return <Option key={v?.orderId} value={v?.orderId} label={v?.orderNo}>{v?.orderNo}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="客户名称"
              name="customerId"
              rules={[
                { required: true, message: '请选择客户名称' }
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      customerName: option?.label
                    })
                  }
                }}
              >
                {customerList.length > 0 && customerList.map((v) => {
                  return <Option key={v?.customerId} value={v?.customerId} label={v?.customerName}>{v?.customerName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="入库人员"
              name="operaterId"
              rules={[
                { required: true, message: '请选择入库人员' }
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      operater: option?.label
                    })
                  }
                }}
              >
                {userList.length > 0 && userList.map((v) => {
                  return <Option key={v?.userId} value={v?.userId} label={v?.realName}>{v?.realName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="发票类型"
              name="invoiceType"
              rules={[
                { required: true, message: '请选择发票类型' }
              ]}
            >
              <Select placeholder="请选择" allowClear>
                {INVOICE_TYPE.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="税率"
              name="taxRate"
              rules={[{ required: true, message: '请输入税率' }]}
            >
              <InputNumber min={0} max={100} addonAfter={'%'} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="入库日期"
              name="stockTime"
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="合同金额"
              name="contractAmount"
              rules={[
                { required: true, message: '请输入合同金额' }
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="税额"
              name="taxAmount"
              rules={[
                { required: true, message: '请输入税额' }
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="备注信息"
              name="remark"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BasicInfo;