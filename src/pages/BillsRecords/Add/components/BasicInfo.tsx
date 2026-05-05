import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { INVOICE_TYPE, RECORDS_MODE, RECORDS_TYPE } from '@/constants';
import FileUpload from '@/components/FileUpload';

const { Option } = Select;

const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="收付款信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="收付单编号"
              name="code"
              rules={[
                { required: true, message: '请输入收付单编号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="订单编号"
              name="code"
              rules={[
                { required: true, message: '请输入订单编号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="收付金额"
              name="money"
              rules={[
                { required: true, message: '请输入收付金额' }
              ]}
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="订单金额"
              name="money"
              rules={[
                { required: true, message: '请输入订单金额' }
              ]}
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="收付款方式"
              name="sex"
              rules={[
                { required: true, message: '请选择收付款方式' }
              ]}
            >
              <Select placeholder="请选择">
                {Object.keys(RECORDS_MODE).map((key: string) => {
                  return <Option key={key} value={key}>{RECORDS_MODE[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="收付款类型"
              name="sex"
              rules={[
                { required: true, message: '请选择收付款类型' }
              ]}
            >
              <Select placeholder="请选择">
                {Object.keys(RECORDS_TYPE).map((key: string) => {
                  return <Option key={key} value={key}>{RECORDS_TYPE[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="收款公司名称"
              name="name"
              rules={[
                { required: true, message: '请输入收款公司名称' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="收款公司账号"
              name="name"
              rules={[
                { required: true, message: '请输入收款公司账号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="付款公司名称"
              name="name"
              rules={[
                { required: true, message: '请输入付款公司名称' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="付款公司账号"
              name="name"
              rules={[
                { required: true, message: '请输入付款公司账号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="发票类型"
              name="sex"
              rules={[
                { required: true, message: '请选择发票类型' }
              ]}
            >
              <Select placeholder="请选择">
                {Object.keys(INVOICE_TYPE).map((key: string) => {
                  return <Option key={key} value={key}>{INVOICE_TYPE[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="付款日期"
              name="name"
              rules={[
                { required: true, message: '请选择付款日期' }
              ]}
            >
              <DatePicker onChange={() => { }} placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="税率"
              name="costRate"
              rules={[{ required: true, message: '请输入税率' }]}
            >
              <InputNumber min={0} max={100} addonAfter={'%'} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="税额"
              name="money"
              rules={[
                { required: true, message: '请输入税额' }
              ]}
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
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
              name="file"
              rules={[
                { required: true, message: '请上传发票凭证' },
              ]}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <FileUpload
                listType="text"
                maxCount={1}
                onChange={(e) => {
                  console.log('发票凭证----', e)
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