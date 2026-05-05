import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { message, Modal, Space } from 'antd';
import AddModal from './components/AddModal';
import { PageContainer } from '@ant-design/pro-layout';
import { brandApi } from '@/services/api';
import type { API } from './typings';
import { useAccess, Access } from 'umi';

/** 产品品牌管理 */

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
    const res = await brandApi.onDelete({ brandId: id });
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
    const parameter = (({ brandName }) => ({ brandName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };

    const msg = await brandApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '产品品牌',
      dataIndex: 'brandName',
      valueType: 'text',
    },
    {
      title: '厂家名称',
      dataIndex: 'factoryName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '厂家电话',
      dataIndex: 'factoryTel',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '厂家地址',
      dataIndex: 'factoryAddress',
      valueType: 'text',
      hideInSearch: true
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
            // <Access accessible={access.auth('base.brand.edit')}>
              <AddModal title="编辑" id={r?.brandId} refreshTable={refreshTable} />
            // </Access>
            {/* 删除 */}
            // <Access accessible={access.auth('base.brand.delete')}>
              <a onClick={() => handleDelete(r?.brandId)}>删除</a>
            // </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="brandId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          // <Access accessible={access.auth('base.brand.add')}>
            <AddModal title="新增" refreshTable={refreshTable} />
          // </Access>
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