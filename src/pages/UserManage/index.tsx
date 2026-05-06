import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { userApi } from '@/services/api';
import type { API } from './typings';
import EditOrgModal from './components/EditOrgModal';
import { useAccess, Access } from 'umi';

/** 员工管理 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 跳转页面 */
  const onJump = (id?: string) => {
    let params = '';
    if (id) params = `?id=${id}`;
    history.push(`/base/user/add${params}`)
  }

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await userApi.onDelete({ userId: id });
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
    const parameter = (({ realName, phone }) => ({ realName, phone }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };

    const msg = await userApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '员工姓名',
      dataIndex: 'realName',
      valueType: 'text',
    },
    {
      title: '登录名',
      dataIndex: 'userName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
    },
    // {
    //   title: '入职时间',
    //   dataIndex: 'birthday',
    //   valueType: 'text',
    //   hideInSearch: true
    // },
    {
      title: '备注',
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
            <Access accessible={access.auth('base.user.edit')}>
              <a onClick={() => onJump(r?.userId)}>编辑</a>
            </Access>
            {/* 所属部门 */}
            <Access accessible={access.auth('base.user.setDepartment')}>
              <EditOrgModal id={r?.userId} refreshTable={refreshTable} />
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('base.user.delete')}>
              <a onClick={() => handleDelete(r?.userId)}>删除</a>
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
        rowKey="userId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <Access accessible={access.auth('base.user.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
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
