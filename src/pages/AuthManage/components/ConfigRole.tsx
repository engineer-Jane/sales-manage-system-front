import { useState } from 'react';
import type { FC } from 'react';
import { useToggle } from 'ahooks';
import { message, Modal, Transfer } from 'antd';
import { roleApi, userApi } from '@/services/api';

interface ConfigRoleProps {
  /**员工id */
  id: string;
}

const ConfigRoleModel: FC<ConfigRoleProps> = (props) => {
  const { id } = props;
  const [visible, { toggle }] = useToggle(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  /** 获取所有角色数据 */
  const getTree = () => {
    roleApi.query({
      pageNumber: 1,
      pageSize: 1000
    }).then((res: any) => {
      if (res && res?.code === 200) {
        const data = res.data?.records;
        const newData = data.map((item: any) => {
          return {
            title: item?.roleName,
            key: item?.roleId
          }
        })
        setTreeData(newData);
      } else {
        message.error(res?.msg);
      }
    })
  };

  /** 获取已选角色数据 */
  const getSelect = () => {
    userApi.selectRoleListByUserId({ userId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setTargetKeys(res.data);
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
    userApi.saveOrUpdateUserRoleRelation({
      userId: id,
      roleIds: targetKeys
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
   * 选中项发生改变时的回调函数
   * @param values targetKeys
   * @param direction transfer方向
   * @param moveKeys transfer数据
   */
  const onChange = (values: string[]) => {
    setTargetKeys(values);
  };

  return (
    <>
      <a key="edit" onClick={() => openModal()}> 配置角色 </a>

      <Modal
        width={480}
        centered
        destroyOnClose
        maskClosable={false}
        title={`配置角色`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Transfer
          dataSource={treeData}
          targetKeys={targetKeys}
          onChange={onChange}
          render={(item: any) => item.title}
          showSearch
          pagination
        />
      </Modal>
    </>
  );
};

export default ConfigRoleModel;
