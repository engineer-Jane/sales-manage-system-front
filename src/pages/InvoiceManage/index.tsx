import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { STATUS, INVOICE_TYPE } from '@/constants';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import type { API } from './typings';
import { invoiceApi } from '@/services/api';
import { TransfArrObj } from '@/utils';
import DetailsDrawer from './components/DetailsDrawer';
import { useAccess, Access } from 'umi';

/** 发票管理 */

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
    if (disable) params = `&disable=${disable}`;
    history.push(`/bills/invoice/add${params}`)
  }

  /** 提交*/
  const onSubmit = async (id: string) => {
    const res = await invoiceApi.submit({ invoiceRecordId: id });
    if (res && res.code === 200) {
      message.success(res.msg);
      refreshTable();
    }
  };

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await invoiceApi.onDelete({ invoiceRecordId: id });
    if (res && res.code === 200) {
      message.success(res.msg);
      refreshTable();
    }
  };

  /** 操作提示 */
  const handleConfirm = async (id: string, btnName?: string) => {
    Modal.confirm({
      title: btnName,
      content: `是否确认${btnName}该数据`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (btnName === '提交') {
          onSubmit(id);
        } else if (btnName === '删除') {
          onDelete(id);
        }
      }
    });
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ customerName, status }) => ({ customerName, status }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };
    setParam(request);

    const msg = await invoiceApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '收付款编号',
      dataIndex: 'invoiceRecordCode',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      // hideInSearch: true
    },
    {
      title: '客户地址',
      dataIndex: 'customerNameAddress',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '开票人员',
      dataIndex: 'operatorName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '发票类型',
      dataIndex: 'invoiceType',
      valueType: 'text',
      valueEnum: TransfArrObj(INVOICE_TYPE),
      hideInSearch: true
    },
    {
      title: '发票金额',
      dataIndex: 'invoiceAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '开票日期',
      dataIndex: 'invoiceDate',
      valueType: 'dateTimeRange',
      width: 120,
      hideInSearch: true,
      render: (t: any, r: any) => {
        return (
          <span> {r.invoiceDate} </span>
        );
      },
    },
    {
      title: '开票状态',
      dataIndex: 'status',
      valueType: 'text',
      // valueEnum: TransfArrObj(INVOICE_STATUS),
      valueEnum: TransfArrObj(STATUS),
      hideInTable: true
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
            {/* 0-草稿， 1-审核中，2-未通过，3-已通过，4-已生效 */}
            {/* 编辑 -  */}
            <Access accessible={access.auth('bills.invoice.edit')}>
              {[0, 2].indexOf(r?.status) > -1 && <a onClick={() => onJump(r?.invoiceRecordId)}>编辑</a>}
            </Access>
            {/* 提交审核 */}
            <Access accessible={access.auth('bills.invoice.submit')}>
              {r?.status === 0 && <a onClick={() => handleConfirm(r?.invoiceRecordId, '提交')}>提交</a>}
            </Access>
            {/* 审核 */}
            <Access accessible={access.auth('bills.invoice.audit')}>
              {r?.status === 1 && <DetailsDrawer title="审核" id={r?.invoiceRecordId} refreshTable={refreshTable} />}
            </Access>
            {/* 详情 */}
            <Access accessible={access.auth('bills.invoice.details')}>
              <DetailsDrawer title="查看详情" id={r?.invoiceRecordId} refreshTable={refreshTable} />
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('bills.invoice.delete')}>
              {[0, 2].indexOf(r?.status) > -1 && <a onClick={() => handleConfirm(r?.invoiceRecordId, '删除')}>删除</a>}
            </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable<API.TableItem, API.Params>
        actionRef={actionRef}
        rowKey="invoiceRecordId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <Access accessible={access.auth('bills.invoice.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          </Access>
        }
        toolBarRender={() => [
          <Access key="export" accessible={access.auth('bills.invoice.export')}>
            <Button onClick={() => downloadExcel('POST', EXPORT_URL['INVOICE_RECORD'], param)}>
              <DownloadOutlined />
              导出明细
            </Button>
          </Access>
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