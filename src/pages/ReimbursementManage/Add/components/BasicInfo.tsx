import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';

const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="报销单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="出库单编号"
              name="code"
              rules={[
                { required: true, message: '请输入出库单编号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="报销人员"
              name="code"
              rules={[
                { required: true, message: '请输入报销人员' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="报销金额"
              name="money"
              rules={[
                { required: true, message: '请输入报销金额' }
              ]}
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="报销日期"
              name="name"
              rules={[
                { required: true, message: '请选择报销日期' }
              ]}
            >
              <DatePicker onChange={() => { }} placeholder="请选择" style={{ width: '100%' }} />
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