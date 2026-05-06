import React, { useRef, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Badge, message, Modal, Space } from 'antd';
import AddModal from './AddModal';
import { resourceApi } from '@/services/api';
import type { API } from '../typings';
import { RESOURCE_STATUS, RESOURCE_TYPE } from '@/constants';
import { TransfArrObj } from '@/utils';
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
    const res = await resourceApi.onDelete({ resourceId: id });
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
    const parameter = (({ resourceCode, resourceName }) => ({ resourceCode, resourceName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      parentId,
      ...parameter
    };

    const msg = await resourceApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'resourceName',
      valueType: 'text',
    },
    {
      title: '菜单编码',
      dataIndex: 'resourceCode',
      valueType: 'text'
    },
    {
      title: '菜单类型',
      dataIndex: 'resourceType',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: TransfArrObj(RESOURCE_TYPE)
    },
    {
      title: '菜单状态',
      dataIndex: 'resourceStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: TransfArrObj(RESOURCE_STATUS),
      render: (text: any, record: any) => {
        return (
          <Badge
            color={record?.resourceStatus === 'DISPLAY' ? 'green' : 'red'}
            text={record?.resourceStatus === 'DISPLAY' ? '显示' : '隐藏'}
          />
        )
      }
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
            <Access accessible={access.auth('base.resource.edit')}>
              <AddModal
                title="编辑"
                parentId={parentId}
                treeData={treeData}
                id={r?.resourceId}
                refreshTable={refreshTable}
              />
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('base.resource.delete')}>
              <a onClick={() => handleDelete(r?.resourceId)}>删除</a>
            </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="resourceId"
        search={{
          span: 8
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <Access accessible={access.auth('base.resource.add')}>
            <AddModal
              title="新增"
              parentId={parentId}
              treeData={treeData}
              refreshTable={refreshTable}
            />
          </Access>
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