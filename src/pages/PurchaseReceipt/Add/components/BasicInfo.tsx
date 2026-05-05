import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { INVOICE_TYPE } from '@/constants';

const { Option } = Select;

const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="入库单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="入库单编号"
              name="code"
              rules={[
                { required: true, message: '请输入入库单编号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="采购单编号"
              name="code"
              rules={[
                { required: true, message: '请输入采购单编号' }
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
              label="入库人员"
              name="name"
              rules={[
                { required: true, message: '请输入入库人员' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
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
              <Select placeholder="请选择">
                {Object.keys(INVOICE_TYPE).map((key: string) => {
                  return <Option key={key} value={key}>{INVOICE_TYPE[key]}</Option>
                })}
              </Select>
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
              label="入库日期"
              name="name"
            >
              <DatePicker onChange={() => { }} placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="合同金额"
              name="money"
              rules={[
                { required: true, message: '请选择合同金额' }
              ]}
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="税额"
              name="money"
              rules={[
                { required: true, message: '请选择税额' }
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
        </Row>
      </div>
    </>
  )
}

export default BasicInfo;