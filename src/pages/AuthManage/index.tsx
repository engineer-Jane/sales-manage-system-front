import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import TreeCommon from '@/components/TreeCommon';
import TableList from './components/TableList';
import type { FC } from 'react';
import { departmentApi } from '@/services/api';
import { message } from 'antd';

/** 权限管理 */

const ResourcePage: FC = () => {
  const [parentId, setParentId] = useState('-1');
  const [treeData, setTreeData] = useState([]);

  const getTree = () => {
    departmentApi.tree({ departmentId: -1 }).then((res: any) => {
      if (res && res?.code === 200) {
        setTreeData(res.data);
      } else {
        message.error(res?.msg);
      }
    })
  };

  useEffect(() => {
    getTree();
  }, []);

  return (
    <PageContainer className="sales">
      <ProCard split="vertical" gutter={16} ghost>
        <ProCard colSpan="20%">
          <TreeCommon
            isDefaultSelectedKeys={true}
            treeData={treeData}
            onSelect={setParentId}
            fieldNames={{
              title: 'departmentName',
              key: 'departmentId',
              children: 'children'
            }}
          />

        </ProCard>
        <ProCard colSpan="80%" ghost>
          <TableList parentId={parentId} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ResourcePage;
