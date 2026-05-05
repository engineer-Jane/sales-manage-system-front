import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import ExWarehouse from '@/components/Pdf/ExWarehouse';
import type { API } from './typings';
import { saleApi } from '@/services/api';
import { useAccess, Access } from 'umi';

/** 销售出库单 */

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

  /** 跳转页面 */
  const onJump = (id?: string) => {
    let params = '';
    if (id) params = `?id=${id}`;
    history.push(`/sale/storage/add${params}`)
  }

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await saleApi.onDelete({ saleStockOrderId: id });
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
    const parameter = (({ beginTime, endTime, customerName, orderNo }) => ({ beginTime, endTime, customerName, orderNo }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      saleStockOrderType: 'SALES_STORAGE',
      ...parameter
    };
    setParam(request);

    const msg = await saleApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '出库单编号',
      dataIndex: 'saleStockOrderNo',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      valueType: 'text',
    },
    {
      title: '发货数量',
      dataIndex: 'deliveryAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '出库日期',
      dataIndex: 'deliveryTime',
      valueType: 'dateTimeRange',
      width: 120,
      search: {
        transform: (value: any) => ({
          beginTime: value[0],
          endTime: value[1],
        }),
      },
      render: (t: any, r: any) => {
        return (
          <span> {r.deliveryTime} </span>
        );
      },
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
      width: 130,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            // <Access accessible={access.auth('sale.storage.edit')}>
              <a onClick={() => onJump(r?.saleStockOrderId)}>编辑</a>
            // </Access>
            {/* 出库单 */}
            // <Access accessible={access.auth('sale.storage.exWarehouse')}>
              <ExWarehouse id={r?.saleStockOrderId} />
            // </Access>
            {/* 删除 */}
            // <Access accessible={access.auth('sale.storage.delete')}>
              <a onClick={() => handleDelete(r?.saleStockOrderId)}>删除</a>
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
        rowKey="saleStockOrderId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          // <Access accessible={access.auth('sale.storage.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          // </Access>
        }
        toolBarRender={() => [
          // <Access accessible={access.auth('sale.storage.export')}>
            <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL['SALE'], param)}>
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