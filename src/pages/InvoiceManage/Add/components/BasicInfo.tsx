import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { INVOICE_TYPE } from '@/constants';
import { userApi } from '@/services/api';

const { Option } = Select;

type BasicInfoProps = {
  /** form */
  form: any;
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form } = props;
  const [userList, setUserList] = useState<any[]>([]); // 报销人员数据

  /** 获取报销人员数据 */
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
    getUser();
  }, [])
  return (
    <>
      <FontTitle title="签收单基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="开票人员"
              name="operatorId"
              rules={[
                { required: true, message: '请选择开票人员' }
              ]}
            >
              <Select
                placeholder="请选择"
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      operatorName: option?.label
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
              label="发票日期"
              name="invoiceDate"
              rules={[
                { required: true, message: '请选择发票日期' }
              ]}
            >
              <DatePicker allowClear placeholder="请选择" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="税率"
              name="invoiceRate"
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

          <Col span={12}>
            <Form.Item
              label="发票金额"
              name="invoiceAmount"
              rules={[
                { required: true, message: '请输入发票金额' }
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
        </Row>
      </div>
    </>
  )
}

export default BasicInfo;