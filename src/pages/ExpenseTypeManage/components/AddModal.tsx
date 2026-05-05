import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useToggle } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';


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

  /** 获取组织详情 */
  const getInfo = () => {
    // workspaceApi.info({ id }).then((res: any) => {
    //   if (res && res?.code === 1) {
    //     setInfo(res.data);
    //     form.setFieldsValue({
    //       ...res.data,
    //       parentId: res.data.parent.id
    //     });
    //   } else {
    //     message.error(res?.msg);
    //   }
    // })
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
      // workspaceApi.save({
      //   ...values,
      //   id: info ? info?.id : undefined
      // }).then((res: any) => {
      //   if (res && res?.code === 1) {
      //     message.success(`保存成功！`);
      //     onCancel();
      //     if (refreshTable) {
      //       refreshTable();
      //     }
      //   } else {
      //     message.error(res?.msg);
      //   }
      // })
      // setConfirmLoading(false);
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
        title={`${title}费用类型`}
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
            name="name"
            rules={[
              { required: true, message: '请输入产品名称' }
            ]}
          >
            <Input allowClear placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remarks"
          >
            <Input.TextArea allowClear placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;