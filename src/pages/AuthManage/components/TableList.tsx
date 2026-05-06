import React, { useRef, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Space } from 'antd';
import { userApi } from '@/services/api';
import type { API } from '../typings';
import ConfigRole from './ConfigRole';
import { useAccess, Access } from 'umi';

type TableListProps = {
  /** 父级Id */
  parentId: string | undefined;
}

const TableList: React.FC<TableListProps> = (props) => {
  const { parentId } = props;
  const actionRef = useRef<ActionType>();
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.reset(); // 重置到默认值
      actionRef.current.reload(); // 刷新
    }
  }, [parentId]);

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    // const {current: any, pageSize, sorter, filter, ...parameter} = params;
    // const parameter = (({ departmentName }) => ({ departmentName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      // ...parameter
    };

    const msg = await userApi.selectUserListByDepartmentId(request);

    return {
      data: msg.data || [],
      total: Number(msg?.data?.length) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '员工名称',
      dataIndex: 'realName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '员工电话',
      dataIndex: 'phone',
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
            {/* 配置角色 */}
            <Access accessible={access.auth('base.auth.configRole')}>
              <ConfigRole id={r.userId} />
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
        rowKey="departmentId"
        // search={{
        //   span: 6
        // }}
        search={false}
        pagination={{
          pageSize: 10
        }}
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