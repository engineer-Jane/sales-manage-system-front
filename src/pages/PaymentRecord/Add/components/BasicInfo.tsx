import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { INVOICE_TYPE, OPERATE_TYPE, PAYMENT_TYPE } from '@/constants';
import FileUpload from '@/components/FileUpload';
import { resetFile } from '@/utils/file';
import { customerApi, orderApi } from '@/services/api';

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
  const [orderList, setOrderList] = useState<any[]>([]); // 销售订单数据
  const [buyerList, setBuyerList] = useState<any[]>([]); // 付款公司【客户】数据列表
  const [sellerList, setSellerList] = useState<any[]>([]); // 收款公司【供应商】数据列表

  useEffect(() => {
    if (info) {
      setFile(resetFile(info, 'payImgUrl'));
    }
  }, [info])

  /** 获取销售订单数据 */
  const getOrder = () => {
    orderApi.query({
      pageNumber: 1,
      pageSize: 1000,
      // orderType: 'SALES_ORDER',
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setOrderList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 获取公司数据数据 */
  const getCompany = (customerName?: string, type?: string) => {
    customerApi.query({
      pageNumber: 1,
      pageSize: 1000,
      customerName: customerName,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        if (type) {
          if (type === '0') setBuyerList(res.data?.records);
          if (type === '1') setSellerList(res.data?.records);
        } else {
          setBuyerList(res.data?.records);
          setSellerList(res.data?.records);
        }
      } else {
        message.error(res?.msg);
      }
    })
  }

  useEffect(() => {
    getOrder();
    getCompany();
  }, [])

  return (
    <>
      <FontTitle title="收付款信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="订单编号"
              name="orderId"
              rules={[
                { required: true, message: '请选择订单编号' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      orderNo: option?.label,
                      orderAmount: option?.orderAmount
                    })
                  }
                }}
              >
                {orderList.length > 0 && orderList.map((v) => {
                  return <Option key={v?.orderId} value={v?.orderId} label={v?.orderNo} {...v}>{v?.orderNo}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="订单金额"
              name="orderAmount"
              rules={[
                { required: true, message: '请输入订单金额' }
              ]}
            >
              <InputNumber disabled min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="收付款类型"
              name="operateType"
              rules={[
                { required: true, message: '请选择收付款类型' }
              ]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {OPERATE_TYPE.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="收付金额"
              name="paymentAmount"
              rules={[
                { required: true, message: '请输入收付金额' }
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="收款公司"
              name="payeeCompanyId"
              rules={[
                { required: true, message: '请选择收款公司' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onSearch={(val: string) => {
                  getCompany(val, '1');
                }}
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      payeeCompanyName: option?.label,
                      payeeCompanyAccountNo: option?.bankAccountNo,
                    })
                  }
                }}
              >
                {buyerList.length > 0 && buyerList.map((v) => {
                  return <Option key={v?.customerId} value={v?.customerId} label={v?.customerName} {...v}>{v?.customerName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="收款公司账号"
              name="payeeCompanyAccountNo"
              rules={[
                { required: true, message: '请输入收款公司账号' }
              ]}
            >
              <Input disabled allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="付款公司"
              name="payorCompanyId"
              rules={[
                { required: true, message: '请选择付款公司' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onSearch={(val: string) => {
                  getCompany(val, '0');
                }}
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      payorCompanyName: option?.label,
                      payorCompanyAccountNo: option?.bankAccountNo,
                    })
                  }
                }}
              >
                {sellerList.length > 0 && sellerList.map((v) => {
                  return <Option key={v?.customerId} value={v?.customerId} label={v?.customerName} {...v}>{v?.customerName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="付款公司账号"
              name="payorCompanyAccountNo"
              rules={[
                { required: true, message: '请输入付款公司账号' }
              ]}
            >
              <Input disabled allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="收付款方式"
              name="paymentType"
              rules={[
                { required: true, message: '请选择收付款方式' }
              ]}
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
              label="付款日期"
              name="paymentDate"
              rules={[
                { required: true, message: '请选择付款日期' }
              ]}
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
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
              <Select allowClear style={{ width: '100%' }}>
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

          <Col span={24}>
            <Form.Item
              label="发票凭证"
              name="payImgUrl"
              rules={[
                { required: true, message: '请上传发票凭证' },
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
                      payImgUrl: e.url
                    })
                  } else {
                    form.setFieldsValue({
                      payImgUrl: ''
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