import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import { OPERATE_TYPE } from '@/constants';
import { prepaymentApi } from '@/services/api';
import { TransfArrObj } from '@/utils';
import { useAccess, Access } from 'umi';

/** 待收待付款明细 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ companyName, operateType, orderNo }) => ({ companyName, operateType, orderNo }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };
    setParam(request);

    const msg = await prepaymentApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
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
      title: '收付款类型',
      dataIndex: 'operateType',
      valueType: 'text',
      valueEnum: TransfArrObj(OPERATE_TYPE)
    },
    {
      title: '收付款公司',
      dataIndex: 'companyName',
      valueType: 'text',
      // hideInSearch: true
    },
    {
      title: '收付款金额',
      dataIndex: 'paymentAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '到期时间',
      dataIndex: 'expirationTime',
      valueType: 'dateTimeRange',
      width: 120,
      hideInSearch: true,
      render: (t: any, r: any) => {
        return (
          <span> {r.expirationTime} </span>
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
          // <Access accessible={access.auth('bills.prepayment.export')}>
            <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL['PREPAYMENT'], param)}>
              <DownloadOutlined />
              导出明细
            </Button>
          // </Access>
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