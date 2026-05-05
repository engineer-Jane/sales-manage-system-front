import React from 'react';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { regRules } from '@/utils/regexp';
import { SEX } from '@/constants';

const { Option } = Select;

const BasicInfo: React.FC = () => {

  return (
    <>
      <FontTitle title="员工基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="员工姓名"
              name="realName"
              rules={[
                { required: true, message: '请输入员工姓名' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="员工性别"
              name="sex"
              rules={[
                { required: true, message: '请选择员工性别' }
              ]}
            >
              <Select placeholder="请选择">
                {SEX.map((v: any) => {
                  return <Option key={v.value} value={v.value}>{v.label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="出生日期"
              name="birthday"
              rules={[
                { required: true, message: '请选择出生日期' }
              ]}
            >
              <DatePicker allowClear
                format="YYYY-MM-DD"
                placeholder="请选择"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="身份证号"
              name="idNumber"
              rules={[
                { required: true, message: '请输入身份证号' },
                regRules.IDCard
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[
                { required: true, message: '请输入联系电话' },
                regRules.phone
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="居住地址"
              name="address"
              rules={[
                { required: true, message: '请输入居住地址' },
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="紧急联系人"
              name="emergencyContact"
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="紧急联系电话"
              name="emergencyTel"
              rules={[
                regRules.phone
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

export default BasicInfo;