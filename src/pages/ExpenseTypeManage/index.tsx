import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Modal, Space } from 'antd';
import AddModal from './components/AddModal';
import { PageContainer } from '@ant-design/pro-layout';

/** 费用类型管理 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };


  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const request = {
      id: id,
      // enableFlag: record.enableFlag ? false : true,
    };

    // const res = await groupApi.editEnableFlag(request);
    // if (res && res.code === 1) {
    //   message.success(res.msg);
    //   refreshTable();
    // }
  };

  /** 删除 */
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "删除",
      content: "是否确认删除改数据",
      okText: '确认',
      cancelText: '取消',
      onOk: () => onDelete(id)
    });
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const request = {};
    request.pageParam = {
      pageIndex: params.current,
      pageSize: params.pageSize,
    };
    // const {current: any, pageSize, sorter, filter, ...parameter} = params;
    const parameter = (({ keyword }) => ({ keyword }))(params);
    request.queryParam = parameter;

    let msgTotal;
    // if (params.current === 1) {
    //   msgTotal = await api.getTotal({ queryParam: parameter });
    //   await setTotal(Number(msgTotal?.data?.total));
    // }
    // const msgData = await api.getPage(request);

    // return {
    //   data: msgData.data?.data || [],
    //   total: params.current === 1 ? Number(msgTotal?.data?.total) : total,
    //   message: true,
    // };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '费用名称',
      dataIndex: 'keyword',
      valueType: 'text',
    },
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
      width: 120,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            <AddModal title="编辑" id={r?.id} refreshTable={refreshTable} />
            {/* 删除 */}
            <a onClick={() => handleDelete(r?.id)}>删除</a>
          </Space>
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="id"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <AddModal title="新增" refreshTable={refreshTable} />
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