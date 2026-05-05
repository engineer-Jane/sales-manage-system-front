import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useToggle } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { regRules } from '@/utils/regexp';
import { roleApi } from '@/services/api';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type AddModalProps = {
  /** 按钮名称 */
  title: string;
  /** 角色Id */
  id?: string | undefined;
  /** 保存成功回调 */
  refreshTable: () => void;
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { title, id, refreshTable } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();

  /** 获取详情数据 */
  const getInfo = () => {
    roleApi.info({ roleId: id }).then((res: any) => {
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

  /** 打开弹窗 */
  const openModal = async () => {
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
      roleApi.save({
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
        title={`${title}角色`}
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
            label="角色名称"
            name="roleName"
            rules={[
              { required: true, message: '请输入角色名称' }
            ]}
          >
            <Input allowClear placeholder="请输入" />
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