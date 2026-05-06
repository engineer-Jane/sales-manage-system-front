import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { customerApi } from '@/services/api';
import type { API } from './typings';
import { CUSTOMER_TYPE } from '@/constants';
import { TransfArrObj } from '@/utils';
import { useAccess, Access } from 'umi';

/** 客户管理 */

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
    history.push(`/base/customer/add${params}`);
  };

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await customerApi.onDelete({ customerId: id });
    if (res && res.code === 200) {
      message.success(res.msg);
      refreshTable();
    }
  };

  /** 删除 */
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '删除',
      content: '是否确认删除该数据',
      okText: '确认',
      cancelText: '取消',
      onOk: () => onDelete(id),
    });
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ customerName, socialUniqueCode }) => ({
      customerName,
      socialUniqueCode,
    }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter,
    };

    const msg = await customerApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
    },
    {
      title: '纳税人识别码',
      dataIndex: 'socialUniqueCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: TransfArrObj(CUSTOMER_TYPE),
    },
    {
      title: '客户地址',
      dataIndex: 'customerAddress',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '开票资料',
      dataIndex: 'businessLicenseUrl',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '客户电话',
      dataIndex: 'customerTel',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
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
            <Access accessible={access.auth('base.customer.edit')}>
              <a onClick={() => onJump(r?.customerId)}>编辑</a>
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('base.customer.delete')}>
              <a onClick={() => handleDelete(r?.customerId)}>删除</a>
            </Access>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="customerId"
        search={{
          labelWidth: 100,
          span: 6,
        }}
        pagination={{
          pageSize: 10,
        }}
        headerTitle={
          <Access accessible={access.auth('base.customer.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          </Access>
        }
        // toolBarRender={false}
        // options={false}
        request={(params, sorter, filter) => getPage({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
