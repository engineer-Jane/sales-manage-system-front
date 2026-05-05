import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { CUSTOMER_TYPE, INVOICE_STATUS, INVOICE_TYPE, PAYMENT_TYPE } from '@/constants';
import FileUpload from '@/components/FileUpload';
import { customerApi, userApi } from '@/services/api';
import { resetFile } from '@/utils/file';

const { Option } = Select;

type BasicInfoProps = {
  /** form */
  form: any;
  /** 数据详情 */
  info: any;
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form, info } = props;
  const [file, setFile] = useState({});
  const [customerList, setCustomerList] = useState<any[]>([]); // 客户数据
  const [userList, setUserList] = useState<any[]>([]); // 销售人员数据

  useEffect(() => {
    if (info) {
      setFile(resetFile(info, 'orderAttachment'));
    }
  }, [info])

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
  }, [])

  return (
    <>
      <FontTitle title="订单基本信息" />
      <div className="sales-form-content">
        <Row>
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
              label="客户类型"
              name="customerType"
              rules={[
                { required: true, message: '请选择客户类型' }
              ]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {CUSTOMER_TYPE.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="销售人员"
              name="salesId"
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
              label="发票税率"
              name="invoiceTaxRate"
              rules={[{ required: true, message: '请输入发票税率' }]}
            >
              <InputNumber min={0} max={100} addonAfter={'%'} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="发票种类"
              name="invoiceType"
              rules={[
                { required: true, message: '请选择发票种类' }
              ]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {INVOICE_TYPE.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="下单日期"
              name="orderTime"
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="开票状态"
              name="invoiceStatus"
            >
              <Select allowClear style={{ width: '100%' }}>
                {INVOICE_STATUS.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="结算方式"
              name="paymentType"
            >
              <Select allowClear style={{ width: '100%' }}>
                {PAYMENT_TYPE.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="订单金额（含税）"
              name="orderAmountWithTax"
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="订单金额（不含税）"
              name="orderAmount"
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="预计结算时间"
              name="settlementDate"
              rules={[
                { required: true, message: '请选择预计结算时间' }
              ]}
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="备注说明"
              name="remark"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="合同附件"
              name="orderAttachment"
              rules={[
                { required: true, message: '请上传合同附件' },
              ]}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <FileUpload
                listType="text"
                defaultList={[file]}
                onChange={(e) => {
                  if (e) {
                    form.setFieldsValue({
                      orderAttachment: e.url
                    })
                  } else {
                    form.setFieldsValue({
                      orderAttachment: ''
                    })
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BasicInfo;