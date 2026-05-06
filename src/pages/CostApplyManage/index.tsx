import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, message, Modal, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { STATUS } from '@/constants';
import type { API } from './typings';
import { costApplyApi } from '@/services/api';
import { TransfArrObj } from '@/utils';
import DetailsDrawer from './components/DetailsDrawer';
import { useAccess, Access } from 'umi';

/** 费用报销管理 */

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
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
    history.push(`/daily/costApply/add${params}`)
  }

  /** 提交*/
  const onSubmit = async (id: string) => {
    const res = await costApplyApi.submit({ costApplyId: id });
    if (res && res.code === 200) {
      message.success(res.msg);
      refreshTable();
    }
  };

  /** 逻辑删除数据 */
  const onDelete = async (id: string) => {
    const res = await costApplyApi.onDelete({ costApplyId: id });
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
    const parameter = (({ applyStatus, beginTime, endTime, userName }) => ({ applyStatus, beginTime, endTime, userName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };

    const msg = await costApplyApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '报销单编号',
      dataIndex: 'costApplyNo',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '报销人',
      dataIndex: 'userName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '报销金额',
      dataIndex: 'applyAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '报销状态',
      dataIndex: 'applyStatus',
      valueType: 'text',
      valueEnum: TransfArrObj(STATUS),
    },
    {
      title: '报销日期',
      dataIndex: 'applyTime',
      valueType: 'dateTimeRange',
      width: 150,
      hideInSearch: true,
      render: (t: any, r: any) => {
        return (
          <span> {r.applyTime} </span>
        );
      },
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
            {/* 0-草稿， 1-审核中，2-未通过，3-已通过，4-已生效 */}
            {/* 编辑 -  */}
            <Access accessible={access.auth('daily.costApply.edit')}>
              {[0, 2].indexOf(r?.applyStatus) > -1 && <a onClick={() => onJump(r?.costApplyId)}>编辑</a>}
            </Access>
            {/* 提交审核 */}
            <Access accessible={access.auth('daily.costApply.submit')}>
              {r?.applyStatus === 0 && <a onClick={() => handleConfirm(r?.costApplyId, '提交')}>提交</a>}
            </Access>
            {/* 审核 */}
            <Access accessible={access.auth('daily.costApply.audit')}>
              {r?.applyStatus === 1 && <DetailsDrawer title="审核" id={r?.costApplyId} refreshTable={refreshTable} />}
            </Access>
            {/* 详情 */}
            <Access accessible={access.auth('daily.costApply.details')}>
              <DetailsDrawer title="查看详情" id={r?.costApplyId} refreshTable={refreshTable} />
            </Access>
            {/* 删除 */}
            <Access accessible={access.auth('daily.costApply.delete')}>
              {[0, 2].indexOf(r?.applyStatus) > -1 && <a onClick={() => handleConfirm(r?.costApplyId, '删除')}>删除</a>}
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
        rowKey="costApplyId"
        search={{
          span: 6
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle={
          <Access accessible={access.auth('daily.costApply.add')}>
            <Button type="primary" onClick={() => onJump()}>
              <PlusOutlined />
              新增
            </Button>
          </Access>
        }
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