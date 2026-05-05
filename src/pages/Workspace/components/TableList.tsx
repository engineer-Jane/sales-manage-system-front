import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

interface TableListProps {
  /** 标题 */
  title: string;
  /** api */
  api: any;
  /** 传参 */
  param?: any
}

const TableList: React.FC<TableListProps> = (props) => {
  const { title, api, param } = props;
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const msg = await api(param);
    await setTotal(msg.data?.monthOrderNumber || 0);

    return {
      data: msg.data?.dataList || [],
      total: Number(msg?.data?.monthOrderNumber) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      valueType: 'text',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'text',
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
    },
    {
      title: '下单日期',
      dataIndex: 'orderTime',
      valueType: 'text',
    },
  ]

  return (
    <>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 5
        }}
        headerTitle={
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            {`${title}：${total}单`}
          </span>
        }
        // toolBarRender={false}
        options={false}
        request={(params, sorter, filter) =>
          getPage({ ...params, sorter, filter })
        }
        columns={columns}
      />
    </>
  );
};

export default TableList;