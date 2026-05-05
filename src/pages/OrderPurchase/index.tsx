import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { INVOICE_STATUS, ORDER_STATUS } from '@/constants';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import Contract from '@/components/Pdf/Contract';
import { orderApi } from '@/services/api';
import type { API } from './typings';
import { TransfArrObj } from '@/utils';
import { useAccess, Access } from 'umi';

/** 采购订单 */

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
    history.push(`/order/purchase/add${params}`)
  }

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await orderApi.onDelete({ orderId: id });
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
    const parameter = (({ customerName, beginTime, endTime, invoiceStatus, orderStatus }) => ({ customerName, beginTime, endTime, invoiceStatus, orderStatus }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      orderType: 'PURCHASE_ORDER',
      ...parameter
    };
    setParam(request);

    const msg = await orderApi.query(request);

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
      title: '合同金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true
    },
    // {
    //   title: '付款状态',
    //   dataIndex: 'invoiceType',
    //   valueType: 'text',
    //   valueEnum: TransfArrObj(ORDER_STATUS)
    // },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      valueType: 'text',
      hideInTable: true,
      valueEnum: TransfArrObj(INVOICE_STATUS)
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      valueType: 'text',
      valueEnum: TransfArrObj(ORDER_STATUS)
    },
    {
      title: '采购人员',
      dataIndex: 'salesName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'orderTime',
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
          <span> {r.orderTime} </span>
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
      width: 120,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            // <Access accessible={access.auth('order.purchase.edit')}>
              <a onClick={() => onJump(r?.orderId)}>编辑</a>
            // </Access>
            {/* 合同 */}
            // <Access accessible={access.auth('order.purchase.contract')}>
              <Contract id={r?.orderId} />
            // </Access>
            {/* 删除 */}
            // <Access accessible={access.auth('order.purchase.delete')}>
              <a onClick={() => handleDelete(r?.orderId)}>删除</a>
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
        rowKey="orderId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          // <Access accessible={access.auth('order.purchase.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          // </Access>
        }
        toolBarRender={() => [
          // <Access accessible={access.auth('order.purchase.export')}>
            <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL['ORDER'], param)}>
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