import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import FontTitle from '@/components/FontTitle';
import { regPassword } from '@/utils/regexp';

const AccountInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="登录账号信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="登录账号"
              name="userName"
              rules={[
                { required: true, message: '请输入登录账号' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="登录密码"
              name="password"
              rules={[
                { required: true, message: '请输入登录密码' },
                regPassword.password
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default AccountInfo;