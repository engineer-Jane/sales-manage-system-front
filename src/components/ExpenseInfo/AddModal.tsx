import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { useToggle } from 'ahooks';
import { costTypeApi, userApi } from '@/services/api';
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
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, current, selectList, onChange } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [costTypeList, setCostTypeList] = useState<API.TableItem[]>([]);
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

  /** 获取费用类型数据 */
  const getCostType = () => {
    costTypeApi.query({
      pageNumber: 1,
      pageSize: 1000,
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setCostTypeList(res.data?.records);
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    await getUser();
    await getCostType();
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
      if (onChange) {
        onChange(values, current);
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
          {selectList.length > 0 ? '重新选择' : '选择费用'}
        </Button>
      )}

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`选择费用`}
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
            label="费用名称"
            name="costName"
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
                    ...option
                  })
                }
              }}
            >
              {costTypeList.length > 0 && costTypeList.map((v: API.TableItem) => {
                return <Option key={v?.costId} value={v?.costName} {...v}>{v?.costName}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="费用编号"
            name="costId"
            rules={[
              { required: true, message: '请输入费用编号' }
            ]}
          >
            <Input disabled allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="票据数量"
            name="invoiceNumber"
            rules={[
              { required: true, message: '请输入票据数量' }
            ]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="报销金额（元）"
            name="applyAmount"
            rules={[
              { required: true, message: '请输入报销金额' }
            ]}
          >
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="参与人员"
            name="costUse"
            rules={[
              { required: true, message: '请选择参与人员' }
            ]}
          >
            <Select allowClear placeholder="请选择" >
              {userList.length > 0 && userList.map((v) => {
                return <Option key={v?.userId} value={v?.userName} >{v?.userName}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;