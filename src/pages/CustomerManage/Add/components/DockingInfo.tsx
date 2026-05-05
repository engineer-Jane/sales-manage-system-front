import React, { useState, useEffect } from 'react';
import { Col, Form, Input, message, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import { regRules } from '@/utils/regexp';
import { userApi } from '@/services/api';

const { Option } = Select;

type DockingInfoProps = {
  /** form */
  form: any;
}

const DockingInfo: React.FC<DockingInfoProps> = (props) => {
  const { form } = props;
  const [userList, setUserList] = useState<any[]>([]); // 销售人员数据

  /** 获取销售人员数据 */
  const getStaff = () => {
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
    getStaff();
  }, [])

  return (
    <>
      <FontTitle title="客户对接信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="客户联系人"
              name="customerContactPerson"
              rules={[
                { required: true, message: '请输入客户联系人' }
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="联系人电话"
              name="contactTel"
              rules={[
                { required: true, message: '请输入联系人电话' },
                regRules.phone
              ]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="所属销售员"
              name="salesId"
              rules={[
                { required: true, message: '请选择所属销售员' }
              ]}
            >
              <Select
                placeholder="请选择"
                allowClear
                onChange={(val: string, option: any) => {
                  if (val) {
                    form.setFieldsValue({
                      salesName: option?.label
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
        </Row>
      </div>
    </>
  )
}

export default DockingInfo;