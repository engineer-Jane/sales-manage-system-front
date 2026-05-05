import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { regRules } from '@/utils/regexp';
import { INVOICE_STATUS, INVOICE_TYPE, SETTLE_STYLE, SEX } from '@/constants';
import FileUpload from '@/components/FileUpload';

const { Option } = Select;

const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="订单基本信息" />
      <div className="sales-form-content">
        <Row>
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
              label="客户名称"
              name="name"
              rules={[
                { required: true, message: '请输入客户名称' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="客户类型"
              name="sex"
              rules={[
                { required: true, message: '请选择客户类型' }
              ]}
            >
              <Select placeholder="请选择">
                {Object.keys(SEX).map((key: string) => {
                  return <Option key={key} value={key}>{SEX[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="销售人员"
              name="name"
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="发票税率"
              name="costRate"
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
              <Select placeholder="请选择">
                {Object.keys(INVOICE_TYPE).map((key: string) => {
                  return <Option key={key} value={key}>{INVOICE_TYPE[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="下单日期"
              name="name"
            >
              <DatePicker onChange={() => { }} placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="开票状态"
              name="invoiceStatus"
            >
              <Select placeholder="请选择">
                {Object.keys(INVOICE_STATUS).map((key: string) => {
                  return <Option key={key} value={key}>{INVOICE_STATUS[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="结算方式"
              name="settleStyle"
            >
              <Select placeholder="请选择">
                {Object.keys(SETTLE_STYLE).map((key: string) => {
                  return <Option key={key} value={key}>{SETTLE_STYLE[key]}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="订单金额（含税）"
              name="money"
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="订单金额（不含税）"
              name="money"
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
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
              name="file"
              rules={[
                { required: true, message: '请上传合同附件' },
              ]}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <FileUpload
                listType="text"
                maxCount={1}
                onChange={(e) => {
                  console.log('合同附件----', e)
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