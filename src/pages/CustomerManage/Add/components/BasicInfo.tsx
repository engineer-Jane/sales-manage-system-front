import React, { useState, useEffect } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import FontTitle from '@/components/FontTitle';
import FileUpload from '@/components/FileUpload';
import { regRules } from '@/utils/regexp';
import { CUSTOMER_TYPE } from '@/constants';
import { resetFile } from '@/utils/file';

const { Option } = Select;

type BasicInfoProps = {
  /** form */
  form: any;
  /** 数据详情 */
  info: any;
};

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form, info } = props;
  const [file, setFile] = useState({});

  useEffect(() => {
    if (info) {
      setFile(resetFile(info, 'businessLicenseUrl'));
    }
  }, [info]);

  return (
    <>
      <FontTitle title="客户基本信息" />
      <div className="sales-form-content">
        <Row>
          <Col span={12}>
            <Form.Item
              label="客户名称"
              name="customerName"
              rules={[{ required: true, message: '请输入客户名称' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="客户地址"
              name="customerAddress"
              rules={[{ required: true, message: '请输入客户地址' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="纳税人识别号"
              name="socialUniqueCode"
              rules={[{ required: true, message: '请输入纳税人识别号' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="客户类别"
              name="customerType"
              rules={[{ required: true, message: '请选择客户类别' }]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {CUSTOMER_TYPE.map((v: any) => {
                  return (
                    <Option key={v.value} value={v.value}>
                      {v.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="客户电话"
              name="customerTel"
              rules={[{ required: true, message: '请输入客户电话' }, regRules.phone]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="传真"
              name="faxNo"
              rules={[{ required: true, message: '请输入传真' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="法定代表人"
              name="legalRepresentative"
              rules={[{ required: true, message: '请输入法定代表人' }]}
            >
              <Input allowClear placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="开票资料"
              name="businessLicenseUrl"
              rules={[{ required: true, message: '请上传开票资料' }]}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <FileUpload
                listType="picture-card"
                defaultList={[file]}
                onChange={(e) => {
                  if (e) {
                    form.setFieldsValue({
                      businessLicenseUrl: e.url,
                    });
                  } else {
                    form.setFieldsValue({
                      businessLicenseUrl: '',
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BasicInfo;
