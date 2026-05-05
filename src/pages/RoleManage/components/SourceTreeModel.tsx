/**
 * 功能权限
 */
import { useState } from 'react';
import type { FC } from 'react';
import { useToggle } from 'ahooks';
import { message, Modal } from 'antd';
import { resourceApi, userApi } from '@/services/api';
import TreeCommon from '@/components/TreeCommon';

interface SourceTreeProps {
  /** 角色id */
  id: string;
}

const SourceTreeModel: FC<SourceTreeProps> = (props) => {
  const { id } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  /** 获取所有角色数据 */
  const getTree = () => {
    resourceApi.tree({
      resourceId: -1,
      // resourceType: ''
    }).then((res: any) => {
      if (res && res?.code === 200) {
        setTreeData(res.data);
      } else {
        message.error(res?.msg);
      }
    })
  };

  /** 获取已选角色数据 */
  const getSelect = () => {
    userApi.selectResourceListByRoleId({ roleId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setCheckedKeys(res.data);
      } else {
        message.error(res?.msg);
      }
    })
  };

  /** 打开弹窗 */
  const openModal = async () => {
    await getTree();
    await getSelect();
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => {
    toggle();
    setConfirmLoading(false);
  }

  /** 提交配置角色 */
  const onSubmit = () => {
    setConfirmLoading(true);
    userApi.saveOrUpdateRoleResourceRelation({
      roleId: id,
      resourceIds: checkedKeys
    }).then((res: any) => {
      if (res && res?.code === 200) {
        message.success(`保存成功！`);
        onCancel();
      } else {
        message.error(res?.msg);
      }
    })
    setConfirmLoading(false);
  };

  /**
   * 选中复选框数据回传
   * @param values
   */
  const onCheck = (values: any) => {
    setCheckedKeys(values);
  };

  return (
    <>
      <a key="edit" onClick={() => openModal()}> 功能权限 </a>

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`设置功能权限`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <TreeCommon
          isCheckbox={true}
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheckbox={onCheck}
          fieldNames={{
            title: 'resourceName',
            key: 'resourceId',
            children: 'children'
          }}
        />
      </Modal>
    </>
  );
};

export default SourceTreeModel;
