import React, { useState } from 'react';
import { Form, message, Modal, TreeSelect } from 'antd';
import { useToggle } from 'ahooks';
import { departmentApi, userApi } from '@/services/api';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type EditOrgModalProps = {
  /** 员工Id */
  id?: string | undefined;
  /** 保存成功回调 */
  refreshTable: () => void;
}

const EditOrgModal: React.FC<EditOrgModalProps> = (props) => {
  const { id, refreshTable } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);

  /** 获取部门tree数据 */
  const getTree = () => {
    departmentApi.tree({ departmentId: -1 }).then((res: any) => {
      if (res && res?.code === 200) {
        setTreeData(res.data);
      } else {
        message.error(res?.msg);
      }
    })
  };

  /** 打开弹窗 */
  const openModal = async () => {
    await getTree();
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
      userApi.saveOrUpdateUserDepartmentRelation({
        ...values,
        userId: id
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
      <a key="edit" onClick={() => openModal()}>所属部门</a>

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`编辑所属部门`}
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
            name="departmentId"
            rules={[
              { required: true, message: '请选择部门' }
            ]}
          >
            <TreeSelect
              style={{ width: '100%' }}
              treeData={treeData}
              placeholder="请选择"
              treeDefaultExpandAll
              fieldNames={{
                label: 'departmentName',
                value: 'departmentId',
                children: 'children'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditOrgModal;