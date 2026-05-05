import React, { useState, useRef, useEffect } from 'react';
import FontTitle from '@/components/FontTitle';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Space } from 'antd';
import AddModal from './AddModal';
import type { API } from './typings';

/** 费用信息 */

type ExpenseInfoProps = {
  /** 标题名称 */
  title: string;
  /** 选中数据 */
  list: API.TableItem[];
  /** 选择产品成功回调 */
  onChange?: (val: API.TableItem[]) => void;
  /** 是否只读 */
  disable?: boolean;
}

const ExpenseInfo: React.FC<ExpenseInfoProps> = (props) => {
  const { title, list, onChange, disable } = props;
  const actionRef = useRef<ActionType>();
  const [costList, setCostList] = useState<API.TableItem[]>([]);

  useEffect(() => {
    setCostList(list);
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
    costList.forEach((v) => {
      if (v.costId !== record.costId) {
        newList.push(v);
      }
    })

    await setCostList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  const onChangeList = async (record: API.TableItem, current?: API.TableItem) => {
    await setCostList([]);
    let newList: API.TableItem[] = [];
    if (!current) {
      newList = costList;
      newList.push(record);
    } else {
      newList = costList.map((v: API.TableItem) => {
        if (v.costId === current?.costId) {
          return record;
        } else {
          return v;
        }
      })
    }
    await setCostList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    return {
      data: costList || [],
      total: costList.length || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '费用名称',
      dataIndex: 'costName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '票据数量',
      dataIndex: 'invoiceNumber',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '参与人员',
      dataIndex: 'costUse',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '报销金额（元）',
      dataIndex: 'applyAmount',
      valueType: 'text',
      hideInSearch: true
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
              selectList={costList}
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
        {/* 选择费用 */}
        {!disable && <AddModal selectList={costList} onChange={onChangeList} />}
        {costList.length > 0 &&
          <ProTable<API.TableItem, API.Params>
            actionRef={actionRef}
            rowKey="id"
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

export default ExpenseInfo;