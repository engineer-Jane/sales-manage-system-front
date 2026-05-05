import React, { useState, useRef, useEffect } from 'react';
import FontTitle from '@/components/FontTitle';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { DatePicker, Form, Input, InputNumber, Popconfirm, Space, Typography } from 'antd';
import SelectOrderModal from './SelectOrderModal';
import type { API } from './typings';
import AddModal from './AddModal';

/** 订单信息 */

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'date';
  record: API.TableItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> :
    inputType === 'date' ? <DatePicker allowClear /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

type OrderInfoProps = {
  /** 标题名称 */
  title: string;
  /** 选中数据 */
  list: API.TableItem[];
  /** 选择产品成功回调 */
  onChange?: (val: API.TableItem[]) => void;
  /** 是否只读 */
  disable?: boolean;
}

const OrderInfo: React.FC<OrderInfoProps> = (props) => {
  const { title, list, onChange, disable } = props;
  const actionRef = useRef<ActionType>();
  const [orderList, setOrderList] = useState<API.TableItem[]>([]);

  useEffect(() => {
    setOrderList(list);
  }, [list])

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 移除数据 */
  const onDelete = async (record: API.TableItem) => {
    const newList: any[] = [];
    orderList.forEach((v) => {
      if (v.orderId !== record.orderId) {
        newList.push(v);
      }
    })

    await setOrderList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  const onChangeList = async (record: API.TableItem, current?: API.TableItem) => {
    await setOrderList([]);
    let newList: API.TableItem[] = [];
    if (!current) {
      newList = orderList;
      newList.push(record);
    } else {
      newList = orderList.map((v: API.TableItem) => {
        if (v.orderId === current?.orderId) {
          return record;
        } else {
          return v;
        }
      })
    }
    await setOrderList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    return {
      data: orderList || [],
      total: orderList.length || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true
    },
    // {
    //   title: '客户名称',
    //   dataIndex: 'customerName',
    //   valueType: 'text',
    //   hideInSearch: true
    // },
    {
      title: '销售人员',
      dataIndex: 'salesName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '订单日期',
      dataIndex: 'orderTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '发票名称',
      dataIndex: 'invoiceName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '发票编号',
      dataIndex: 'invoiceNo',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '开票金额',
      dataIndex: 'invoiceAmount',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '开票日期',
      dataIndex: 'invoiceDate',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      valueType: 'text',
      // fixed: 'right',
      width: 80,
      hideInTable: disable ? true : false,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            <AddModal
              title="编辑"
              current={r}
              selectList={orderList}
              onChange={onChangeList}
            />
            {/* 删除 */}
            <a onClick={() => onDelete(r)}>移除</a>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <FontTitle title={title} />
      <div className="sales-form-content">
        {/* 选择订单 */}
        {!disable && <AddModal selectList={orderList} onChange={onChangeList} />}
        {orderList.length > 0 &&
          <ProTable<API.TableItem, API.Params>
            actionRef={actionRef}
            rowKey="orderId"
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
        }
      </div>
    </>
  )
}

export default OrderInfo;