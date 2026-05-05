import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import TreeCommon from '@/components/TreeCommon';
import TableList from './components/TableList';
import type { FC } from 'react';
import { departmentApi } from '@/services/api';
import { message } from 'antd';

/** 接口可能返回树数组，或误用列表结构 { records } */
function extractDepartmentTree(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (Array.isArray(p.records)) return p.records as any[];
    if (Array.isArray(p.data)) return p.data as any[];
    if (Array.isArray(p.list)) return p.list as any[];
  }
  return [];
}

/** children 为 null / 非数组时 rc-tree 会对 children.forEach 报错 */
function sanitizeDepartmentTree(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => {
    if (!node || typeof node !== 'object') return node;
    const next = { ...node };
    const raw = next.children;
    if (raw == null) {
      delete next.children;
    } else if (Array.isArray(raw)) {
      next.children = sanitizeDepartmentTree(raw);
    } else {
      delete next.children;
    }
    return next;
  });
}

/** 部门管理 */

const ResourcePage: FC = () => {
  const [parentId, setParentId] = useState('-1');
  const [treeData, setTreeData] = useState<any[]>([]);

  const getTree = () => {
    departmentApi.tree({ departmentId: -1 }).then((res: any) => {
      if (res && res?.code === 200) {
        const list = sanitizeDepartmentTree(extractDepartmentTree(res.data));
        setTreeData(list);
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
          <TableList parentId={parentId} treeData={treeData} onChangeTree={getTree} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ResourcePage;
