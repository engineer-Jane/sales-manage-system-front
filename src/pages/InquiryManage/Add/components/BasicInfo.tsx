import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { customerApi, userApi } from '@/services/api';

const { Option } = Select;

type BasicInfoProps = {
  /** form */
  form: any;
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form } = props;
  const [userList, setUserList] = useState<any[]>([]); // 报销人员数据
  const [customerList, setCustomerList] = useState<any[]>([]); // 客户数据

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

  /** 获取报销人员数据 */
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
  }, [])

  return (
    <>
      <FontTitle title="询价单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="销售人员"
              name="salesId"
              rules={[
                { required: true, message: '请选择报销人员' }
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
              label="客户名称"
              name="customerId"
              rules={[
                { required: true, message: '请选择客户' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
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
              label="采购总价"
              name="purchaseAmount"
              rules={[
                { required: true, message: '请输入采购总价' }
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="期望交货日期"
              name="expecteDeliveryDate"
              rules={[
                { required: true, message: '请选择期望交货日期' }
              ]}
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="询价有效日期"
              name="validateDate"
              rules={[
                { required: true, message: '请选择询价有效日期' }
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