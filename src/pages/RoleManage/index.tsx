import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { message, Modal, Space } from 'antd';
import AddModal from './components/AddModal';
import { PageContainer } from '@ant-design/pro-layout';
import { roleApi } from '@/services/api';
import type { API } from './typings';
import { useAccess, Access } from 'umi';
import SourceTreeModel from './components/SourceTreeModel';

/** 角色管理 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await roleApi.onDelete({ roleId: id });
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
    const parameter = (({ roleName }) => ({ roleName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };

    const msg = await roleApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
      width: 150,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            <Access accessible={access.auth('base.role.edit')}>
              <AddModal title="编辑" id={r?.roleId} refreshTable={refreshTable} />
            </Access>
            {/* 功能权限 */}
            <Access accessible={access.auth('base.role.setFun')}>
              <SourceTreeModel id={r.roleId} />
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('base.role.delete')}>
              <a onClick={() => handleDelete(r?.roleId)}>删除</a>
            </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="roleId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <Access accessible={access.auth('base.role.add')}>
            <AddModal title="新增" refreshTable={refreshTable} />
          </Access>
        }
        // toolBarRender={false}
        // options={false}
        request={(params, sorter, filter) =>
          getPage({ ...params, sorter, filter })
        }
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;