import React, { useState } from 'react';
import { Button, Form, message, Modal, Select, TreeSelect } from 'antd';
import { useToggle } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { departmentApi, userApi } from '@/services/api';

const { Option } = Select;

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
  /** 部门Id */
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
  const [userList, setUserList] = useState<any[]>([]); // 销售员工数据

  /** 获取员工数据 */
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

  /** 获取详情数据 */
  const getInfo = () => {
    departmentApi.info({ departmentId: id }).then((res: any) => {
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
    await getUser();
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
      departmentApi.save({
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
        title={`${title}部门`}
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
            label="部门名称"
            name="parentId"
            rules={[
              { required: true, message: '请输入部门名称' }
            ]}
          >
            <TreeSelect
              treeData={treeData}
              fieldNames={{
                label: 'departmentName',
                value: 'departmentId',
                children: 'children'
              }}
              disabled
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="员工名称"
            name="userId"
            rules={[
              { required: true, message: '请选择员工名称' }
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
            >
              {userList.length > 0 && userList.map((v) => {
                return <Option key={v?.userId} value={v?.userId}>{v?.realName}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddModal;