import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import type { API } from './typings';
import { productStockApi } from '@/services/api';
import { useAccess, Access } from 'umi';

/** 库存明细表 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const access = useAccess(); // access 实例的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ productCode, productName }) => ({ productCode, productName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };
    setParam(request);

    const msg = await productStockApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
    },
    {
      title: '产品编号',
      dataIndex: 'productCode',
      valueType: 'text',
    },
    {
      title: '产品品牌',
      dataIndex: 'productBrand',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '库存数量',
      dataIndex: 'stockNumber',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '基本单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '批次号',
      dataIndex: 'productBatchNumber',
      valueType: 'text',
      hideInSearch: true
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
          // <Access accessible={access.auth('stock.details.export')}>
            <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL['PRODUCT_STOCK'], param)}>
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