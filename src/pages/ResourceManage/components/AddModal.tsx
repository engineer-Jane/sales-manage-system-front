import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Radio, TreeSelect } from 'antd';
import { useToggle } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { regRules } from '@/utils/regexp';
import { resourceApi } from '@/services/api';
import { RESOURCE_STATUS, RESOURCE_TYPE } from '@/constants';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type AddModalProps = {
  /** 按钮名称 */
  title: string;
  /** 父级Id */
  parentId?: string | undefined;
  /** tree数据 */
  treeData: any[] | undefined;
  /** 菜单Id */
  id?: string | undefined;
  /** 保存成功回调 */
  refreshTable: () => void;
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, parentId, treeData, id, refreshTable } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();

  /** 获取详情数据 */
  const getInfo = () => {
    resourceApi.info({ resourceId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        form.setFieldsValue({
          ...res.data,
          parentId
        });
      } else {
        message.error(res?.msg);
      }
    })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    if (id) {
      await getInfo();
    } else {
      await form.setFieldsValue({ parentId });
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
      resourceApi.save({
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
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`${title}菜单`}
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
            label="父级菜单"
            name="parentId"
            rules={[
              { required: true, message: '请输入父级菜单' }
            ]}
          >
            <TreeSelect
              treeData={treeData}
              fieldNames={{
                label: 'resourceName',
                value: 'resourceId',
                children: 'children'
              }}
              disabled
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="菜单名称"
            name="resourceName"
            rules={[
              { required: true, message: '请输入菜单名称' },
              regRules.specialReg
            ]}
          >
            <Input allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="菜单编码"
            name="resourceCode"
            rules={[
              { required: true, message: '请输入菜单编码' }
            ]}
          >
            <Input allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="菜单类型"
            name="resourceType"
            rules={[
              { required: true, message: '请选择客户类型' }
            ]}
          >
            <Radio.Group >
              {RESOURCE_TYPE.map((v: any) => {
                return <Radio key={v.value} value={v.value}>{v.label}</Radio>
              })}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="菜单状态"
            name="resourceStatus"
            rules={[
              { required: true, message: '请选择客户类型' }
            ]}
          >
            <Radio.Group >
              {RESOURCE_STATUS.map((v: any) => {
                return <Radio key={v.value} value={v.value}>{v.label}</Radio>
              })}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea allowClear placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;