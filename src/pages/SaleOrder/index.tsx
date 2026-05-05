import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { INVOICE_STATUS, PAYMENT_STATUS } from '@/constants';
import { downloadExcel } from '@/utils/file';
import { EXPORT_URL } from '@/constants/api';
import Contract from '@/components/Pdf/Contract';

/** 销售订单 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 跳转页面 */
  const onJump = (id?: string) => {
    history.push(`/order/sale/add?id=${id}`)
  }

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
      title: '客户名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '合同金额',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '付款状态',
      dataIndex: 'code',
      valueType: 'text',
      valueEnum: PAYMENT_STATUS
    },
    {
      title: '订单状态',
      dataIndex: 'code',
      valueType: 'text',
      valueEnum: INVOICE_STATUS
    },
    {
      title: '销售人员',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '创建时间',
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
    {
      title: '备注',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '操作',
      hideInSearch: true,
      valueType: 'text',
      fixed: 'right',
      width: 150,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            <a onClick={() => onJump(r?.id)}>编辑</a>
            {/* 合同 */}

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
          <Button type="primary" onClick={() => onJump()}>
            <PlusOutlined />
            新增
          </Button>
        }
        toolBarRender={() => [
          <Button key="" onClick={() => downloadExcel('POST', EXPORT_URL.ORDER, { orderType: 'SALES_ORDER' })}>
            <DownloadOutlined />
            导出明细
          </Button>,
          <Contract />
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