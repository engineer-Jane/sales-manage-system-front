import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { useToggle } from 'ahooks';
import { productApi, userApi } from '@/services/api';
import type { API } from './typings';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type AddModalProps = {
  /** 按钮名称 */
  title?: string;
  /** 当前数据 */
  current?: API.TableItem;
  /** 已选择数据 */
  selectList: any[];
  /** 选择成功回调 */
  onChange: (val: API.TableItem, current: API.TableItem | undefined) => void;
  /** 额外字段 */
  extra: string;
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, current, selectList, onChange, extra } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [productList, setProductList] = useState<API.TableItem[]>([]);

  /** 获取产品数据 */
  const getProduct = () => {
    productApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setProductList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getProduct();
    if (current) form.setFieldsValue({ ...current });
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
      const formValues = {
        ...values,
        productId: form.getFieldValue('productId')
      }
      if (onChange) {
        onChange(formValues, current);
      }
      onCancel();
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
        <Button type="default" onClick={() => openModal()}>
          {selectList.length > 0 ? '重新选择' : '选择产品'}
        </Button>
      )}

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`选择产品`}
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
          <Form.Item
            label="产品名称"
            name="productName"
            rules={[
              { required: true, message: '请选择费用' }
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
              onChange={(val: string, option: any) => {
                if (val) {
                  form.setFieldsValue({
                    ...option,
                    totalPriceWithTax: Number(form.getFieldValue('purchaseAmount')) * Number(option?.productPrice)
                  })
                }
              }}
            >
              {productList.length > 0 && productList.map((v: API.TableItem) => {
                return <Option key={v?.productId} value={v?.productName} {...v}>{v?.productName}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="产品品牌"
            name="productBrand"
            rules={[
              { required: true, message: '请输入产品品牌' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="产品型号"
            name="productCode"
            rules={[
              { required: true, message: '请输入产品型号' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="基本单位"
            name="productUnit"
            rules={[
              { required: true, message: '请输入基本单位' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label={extra === 'inquiry' ? '询价数量' :
              extra === 'stockStorage' ? '已入库数量' :
                extra === 'stockRetrieval' ? '退库数量' :
                  '数量'}
            name="buyNumber"
            rules={[
              { required: true, message: '请输入产品数量' }
            ]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={{ width: '100%' }}
              onChange={(val) => {
                form.setFieldsValue({
                  totalAmount: Number(form.getFieldValue('productPrice')) * Number(val)
                })
              }}
            />
          </Form.Item>

          {/* 库存管理 */}
          {['saleRetrieval', 'inquiry'].indexOf(extra) === -1 &&
            <Form.Item
              label={extra === 'stockStorage' ? '本次入库数量' :
                extra === 'stockRetrieval' ? '本次退库数量' :
                  '已发货数量'}
              name="deliverAmount"
              rules={[
                { required: true, message: '请输入本次入库数量' }
              ]}
            >
              <InputNumber
                min={0}
                precision={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          }

          <Form.Item
            label="含税单价（元）"
            name="productPrice"
            rules={[
              { required: true, message: '请输入含税单价' }
            ]}
          >
            <InputNumber disabled min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="含税总价（元）"
            name="totalAmount"
            rules={[
              { required: true, message: '请输入含税总价' }
            ]}
          >
            <InputNumber disabled min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          {/* 询价管理 */}
          {extra === 'inquiry' &&
            <Form.Item
              label="目标售价"
              name="expectPrice"
              rules={[
                { required: true, message: '请输入目标售价' }
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          }
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;