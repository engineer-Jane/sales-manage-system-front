import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import FontTitle from '@/components/FontTitle';


const BankInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="员工银行信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="员工银行账户"
              name="bankAccountNo"
              rules={[
                { required: true, message: '请输入员工银行账户' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="银行开户行名称"
              name="bankName"
              rules={[
                { required: true, message: '请输入银行开户行名称' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="备注信息"
              name="remark"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea maxLength={200} allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BankInfo;