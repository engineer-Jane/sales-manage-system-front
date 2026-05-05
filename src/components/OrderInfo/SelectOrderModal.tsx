import React, { useRef, useState } from 'react';
import { Button, Modal, Space, Tag } from 'antd';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useToggle } from 'ahooks';
import type { API } from './typings';
import { orderApi } from '@/services/api';

/** 选择订单 */

type SelectOrderModalProps = {
  /** 已选择产品数据 */
  orderList: any[];
  /** 选择产品成功回调 */
  onChange: (val: API.TableItem[]) => void;
};

const SelectOrderModal: React.FC<SelectOrderModalProps> = (props) => {
  const { orderList, onChange } = props;
  const actionRef = useRef<ActionType>();
  const [visible, { toggle }] = useToggle(false);
  const [idList, setIdList] = useState<string[]>([]);

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 打开弹窗 */
  const openModal = async () => {
    if (orderList.length > 0) {
      refreshTable();
    }
    if (orderList.length > 0) {
      const idArr = orderList.map((v) => {
        return v.productId;
      });
      await setIdList(idArr);
    } else {
      await setIdList([]);
    }
    await refreshTable();
    toggle();
  };

  /** 关闭弹窗 */
  const onCancel = () => toggle();

  /** 选择产品 */
  const onSelect = (record: API.TableItem) => {
    const itemRecord = {
      ...record,
      buyNumber: 10,
      deliverAmount: 6,
    };
    const newList = orderList;
    newList.push(itemRecord);
    if (onChange) {
      onChange(newList);
      onCancel();
    }
  };

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ customerName, beginTime, endTime, invoiceStatus, orderStatus }) => ({
      customerName,
      beginTime,
      endTime,
      invoiceStatus,
      orderStatus,
    }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      // orderType: 'SALES_ORDER',
      ...parameter,
    };

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
      title: '订单编号',
      dataIndex: 'orderNo',
      valueType: 'text',
      hideInSearch: true,
      render: (t, r) => {
        if (idList.indexOf(r.productId) > -1) {
          return (
            <>
              <Tag color="blue" style={{ marginRight: 8 }}>
                {' '}
                当前选择{' '}
              </Tag>
              {t}
            </>
          );
        } else {
          return t;
        }
      },
    },
    // {
    //   title: '合同编号',
    //   dataIndex: 'name',
    //   valueType: 'text',
    //   hideInSearch: true
    // },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '客户地址',
    //   dataIndex: 'code',
    //   valueType: 'text',
    //   hideInSearch: true
    // },
    {
      title: '所属销售员',
      dataIndex: 'salesName',
      valueType: 'text',
      hideInSearch: true,
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
            {/* 选择 */}
            <a onClick={() => onSelect(r)}>选择</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Button type="default" onClick={() => openModal()}>
        {orderList.length > 0 ? '继续添加' : '选择订单'}
      </Button>

      <Modal
        width={1200}
        centered
        destroyOnClose
        maskClosable={false}
        title={`选择产品`}
        visible={visible}
        onCancel={onCancel}
        footer={false}
      >
        <ProTable<API.TableItem, API.Params>
          actionRef={actionRef}
          rowKey="orderId"
          // search={{
          //   labelWidth: 120,
          //   span: 12
          // }}
          search={false}
          pagination={{
            pageSize: 5,
          }}
          headerTitle={false}
          toolBarRender={false}
          options={false}
          request={(params, sorter, filter) => getPage({ ...params, sorter, filter })}
          columns={columns}
        />
      </Modal>
    </>
  );
};

export default SelectOrderModal;
