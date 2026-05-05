import React from 'react';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import FontTitle from '@/components/FontTitle';


const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="退库单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="退库单编号"
              name="code"
              rules={[
                { required: true, message: '请输入退库单编号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="销售订单编号"
              name="code"
              rules={[
                { required: true, message: '请输入销售订单编号' }
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
              label="销售人员"
              name="name"
              rules={[
                { required: true, message: '请输入销售人员' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="退库日期"
              name="name"
              rules={[
                { required: true, message: '请选择退库日期' }
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