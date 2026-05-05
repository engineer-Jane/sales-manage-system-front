import React, { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select } from 'antd';
import { useToggle } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { brandApi, productApi } from '@/services/api';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type AddModalProps = {
  /** 按钮名称 */
  title: string;
  /** 产品Id */
  id?: string | undefined;
  /** 保存成功回调 */
  refreshTable: () => void;
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, id, refreshTable } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const [brandList, setBrandList] = useState<any[]>([]); // 产品品牌数据
  const [form] = Form.useForm();

  /** 获取详情数据 */
  const getInfo = () => {
    productApi.info({ productId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data
        });
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 获取产品品牌数据 */
  const getBrand = () => {
    brandApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setBrandList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getBrand();
    if (id) {
      await getInfo();
    }
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => {
    toggle();
    setConfirmLoading(false);
    form.resetFields();
  }

  /** 提交表单并关闭弹窗 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      productApi.save({
        ...info,
        ...values
      }).then((res: any) => {
        if (res && res?.code === 200) {
          message.success(`保存成功！`);
          onCancel();
          if (refreshTable) {
            refreshTable();
          }
        } else {
          message.error(res?.msg);
        }
      })
      setConfirmLoading(false);
    }).catch(() => {
      setConfirmLoading(false);
    })
  }

  return (
    <>
      {title === '编辑' ? (
        <a key="edit" onClick={() => openModal()}>
          {title}
        </a>
      ) : (
        <Button type="primary" onClick={() => openModal()}>
          <PlusOutlined />
          {title}
        </Button>
      )}

      <Modal
        width={800}
        centered
        destroyOnClose
        maskClosable={false}
        title={`${title}产品`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form
          {...layout}
          form={form}
          name="form"
          scrollToFirstError={true}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="产品名称"
                name="productName"
                rules={[
                  { required: true, message: '请输入产品名称' }
                ]}
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="产品型号"
                name="productCode"
                rules={[
                  { required: true, message: '请输入产品型号' }
                ]}
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="产品单价"
                name="productPrice"
              >
                <InputNumber min={0} placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="产品品牌"
                name="productBrand"
                rules={[
                  { required: true, message: '请选择产品品牌' }
                ]}
              >
                <Select placeholder="请选择">
                  {brandList.length > 0 && brandList.map((v) => {
                    return <Option key={v?.brandId} value={v?.brandName} label={v?.brandName}>{v?.brandName}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="基本单位"
                name="productUnit"
                rules={[
                  { required: true, message: '请输入基本单位' }
                ]}
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="包装单位"
                name="packageUnit"
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="产品封装"
                name="productPackage"
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="批次号"
                name="productBatchNumber"
                rules={[
                  { max: 50, message: '字符最大长度为50' }
                ]}
              >
                <Input allowClear placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="备注"
                name="remark"
              >
                <Input.TextArea allowClear placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;