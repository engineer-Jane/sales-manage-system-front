import React, { useState, useRef } from 'react';
import { Button, Modal, Space, Tag } from 'antd';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useToggle } from 'ahooks';
import { productApi } from '@/services/api';
import type { API } from './typings';

/** 选择产品 */

type SelectProductModalProps = {
  /** 已选择产品数据 */
  productList: any[];
  /** 选择产品成功回调 */
  onChange: (val: API.TableItem[]) => void;
}

const SelectProductModal: React.FC<SelectProductModalProps> = (props) => {
  const { productList, onChange } = props;
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
    if (productList.length > 0) {
      const idArr = productList.map((v) => {
        return v.productId;
      })
      await setIdList(idArr);
    } else {
      await setIdList([]);
    }
    await refreshTable();
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => toggle();

  /** 选择产品 */
  const onSelect = (record: API.TableItem) => {
    const itemRecord = {
      ...record,
      buyNumber: 10,
      deliverAmount: 6
    }
    const newList = productList;
    newList.push(itemRecord);
    if (onChange) {
      onChange(newList);
      onCancel();
    }
  }

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    const parameter = (({ productName }) => ({ productName }))(params);
    const request = {
      pageNumber: params.current,
      pageSize: params.pageSize,
      ...parameter
    };

    const msg = await productApi.query(request);

    return {
      data: msg.data?.records || [],
      total: Number(msg?.data?.total) || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '',
      dataIndex: 'productName',
      valueType: 'text',
      hideInTable: true
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
      render: (t, r) => {
        if (idList.indexOf(r.productId) > -1) {
          return <>
            <Tag color="blue" style={{ marginRight: 8 }}> 当前选择 </Tag>
            {t}
          </>
        } else {
          return t;
        }
      }
    },
    {
      title: '产品型号',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '产品品牌',
      dataIndex: 'productBrand',
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
      title: '含税单价（元）',
      dataIndex: 'productPrice',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '不含税单价（元）',
      dataIndex: 'code',
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
            {/* 选择 */}
            <a onClick={() => onSelect(r)}>选择</a>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <Button type="default" onClick={() => openModal()}>
        {productList.length > 0 ? '重新选择' : '选择产品'}
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
          rowKey="productId"
          // search={{
          //   labelWidth: 120,
          //   span: 12
          // }}
          search={false}
          pagination={{
            pageSize: 5
          }}
          headerTitle={false}
          toolBarRender={false}
          options={false}
          request={(params, sorter, filter) =>
            getPage({ ...params, sorter, filter })
          }
          columns={columns}
        />
      </Modal>
    </>
  )
}

export default SelectProductModal;