import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import { RECORDS_TYPE } from '@/constants';

/** 待收待付款明细 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
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
      title: '订单编号',
      dataIndex: 'code',
      valueType: 'text',
    },
    {
      title: '收付款类型',
      dataIndex: 'code',
      valueType: 'text',
      valueEnum: RECORDS_TYPE
    },
    {
      title: '收付款公司',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '收付款金额',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '到期时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      width: 120,
      search: {
        transform: (value: any) => ({
          createStartTime: value[0],
          createEndTime: value[1],
        }),
      },
      render: (t: any, r: any) => {
        return (
          <span> {r.createTime} </span>
        );
      },
    },
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
        headerTitle={false}
        toolBarRender={() => [
          <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL.PREPAYMENT, {})}>
            <DownloadOutlined />
            导出明细
          </Button>
        ]}
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