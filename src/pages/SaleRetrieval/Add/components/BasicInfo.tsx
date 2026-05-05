import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
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
  const [orderList, setOrderList] = useState<any[]>([]); // 销售订单数据

  /** 获取销售订单数据 */
  const getOrder = () => {
    orderApi.query({
      pageNumber: 1,
      pageSize: 1000,
      orderType: 'SALES_ORDER',
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
    getCustomer();
    getUser();
    getOrder();
  }, [])

  return (
    <>
      <FontTitle title="退库单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="销售订单编号"
              name="orderId"
              rules={[
                { required: true, message: '请选择销售订单编号' }
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
              name="customerName"
              rules={[
                { required: true, message: '请输入客户名称' }
              ]}
            >
              <Select placeholder="请选择" allowClear >
                {customerList.length > 0 && customerList.map((v) => {
                  return <Option key={v?.customerId} value={v?.customerName} label={v?.customerName}>{v?.customerName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="销售人员"
              name="salesId"
              rules={[
                { required: true, message: '请选择销售人员' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      salesName: option?.label
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
              label="退库日期"
              name="deliveryTime"
              rules={[
                { required: true, message: '请选择退库日期' }
              ]}
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
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