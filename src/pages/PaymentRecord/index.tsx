import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { OPERATE_TYPE, PAYMENT_TYPE } from '@/constants';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import type { API } from './typings';
import { paymentRecordApi } from '@/services/api';
import { TransfArrObj } from '@/utils';
import { useAccess, Access } from 'umi';

/** 收付款记录管理 */

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
  const onJump = (id?: string, disable?: boolean) => {
    let params = '';
    if (id) params = `?id=${id}`;
    if (disable) params += `&disable=${disable}`;
    history.push(`/bills/paymentRecord/add${params}`)
  }

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await paymentRecordApi.onDelete({ paymentId: id });
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
    const parameter = (({ companyName, operateType, orderNo }) => ({ companyName, operateType, orderNo }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };
    setParam(request);

    const msg = await paymentRecordApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      valueType: 'text',
      hideInTable: true
    },
    {
      title: '收付款编号',
      dataIndex: 'paymentId',
      valueType: 'text',
      hideInSearch: true
    },
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
      title: '付款公司',
      dataIndex: 'payorCompanyName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '收款公司',
      dataIndex: 'payeeCompanyName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '收付款方式',
      dataIndex: 'paymentType',
      valueType: 'text',
      valueEnum: TransfArrObj(PAYMENT_TYPE),
      hideInSearch: true
    },
    {
      title: '收付款金额',
      dataIndex: 'paymentAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '付款时间',
      dataIndex: 'paymentDate',
      valueType: 'dateTimeRange',
      width: 120,
      hideInSearch: true,
      render: (t: any, r: any) => {
        return (
          <span> {r.paymentDate} </span>
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
      width: 80,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            // <Access accessible={access.auth('bills.paymentRecord.edit')}>
              <a onClick={() => onJump(r?.paymentId)}>编辑</a>
            // </Access>
            {/* 删除 */}
            // <Access accessible={access.auth('bills.paymentRecord.delete')}>
              <a onClick={() => handleDelete(r?.paymentId)}>删除</a>
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
        rowKey="paymentId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          // <Access accessible={access.auth('bills.paymentRecord.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          // </Access>
        }
        toolBarRender={() => [
          // <Access accessible={access.auth('bills.paymentRecord.export')}>
            <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL['PREPAYMENT_RECORD'], param)}>
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