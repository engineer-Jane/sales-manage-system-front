import React, { useRef, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { message, Modal, Space } from 'antd';
import AddModal from './AddModal';
import { departmentApi } from '@/services/api';
import type { API } from '../typings';
import { useAccess, Access } from 'umi';

type TableListProps = {
  /** 父级Id */
  parentId: string | undefined;
  /** 菜单tree数据 */
  treeData?: any[];
  /** 菜单数据保存成功回调 */
  onChangeTree: () => void;
}

const TableList: React.FC<TableListProps> = (props) => {
  const { parentId, treeData, onChangeTree } = props;
  const actionRef = useRef<ActionType>();
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.reset(); // 重置到默认值
      actionRef.current.reload(); // 刷新
    }
  }, [parentId]);

  /** 刷新表格 */
  const refreshTable = () => {
    if (onChangeTree) {
      onChangeTree();
    }
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await departmentApi.onDelete({ departmentId: id });
    if (res && res.code === 200) {
      message.success(res.msg);
      refreshTable();
    }
  };

  /** 删除 */
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "删除",
      content: "是否确认删除该数据",
      okText: '确认',
      cancelText: '取消',
      onOk: () => onDelete(id)
    });
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    // const {current: any, pageSize, sorter, filter, ...parameter} = params;
    const parameter = (({ departmentName }) => ({ departmentName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      parentDeptId: parentId,
      ...parameter
    };

    const msg = await departmentApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      valueType: 'text',
    },
    {
      title: '备注信息',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '操作',
      hideInSearch: true,
      valueType: 'text',
      fixed: 'right',
      width: 80,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            // <Access accessible={access.auth('base.department.edit')}>
              <AddModal
                title="编辑"
                parentId={parentId}
                treeData={treeData}
                id={r?.departmentId}
                refreshTable={refreshTable}
              />
            // </Access>
            {/* 删除 */}
            // <Access accessible={access.auth('base.department.delete')}>
              <a onClick={() => handleDelete(r?.departmentId)}>删除</a>
            // </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="departmentId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          // <Access accessible={access.auth('base.department.add')}>
            <AddModal
              title="新增"
              parentId={parentId}
              treeData={treeData}
              refreshTable={refreshTable}
            />
          // </Access>
        }
        // toolBarRender={false}
        // options={false}
        request={(params, sorter, filter) =>
          getPage({ ...params, sorter, filter })
        }
        columns={columns}
      />
    </>
  );
};

export default TableList;