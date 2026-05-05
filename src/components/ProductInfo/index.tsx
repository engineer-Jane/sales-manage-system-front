import React, { useState, useRef, useEffect } from 'react';
import FontTitle from '@/components/FontTitle';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Space } from 'antd';
import type { API } from './typings';
import AddModal from './AddModal';

/** 产品信息 */

type ProductInfoProps = {
  /** 标题名称 */
  title: string;
  /** 选中数据 */
  list: API.TableItem[];
  /** 选择产品成功回调 */
  onChange?: (val: API.TableItem[]) => void;
  /** 额外字段 */
  extra: 'saleStorage' | 'saleRetrieval' | 'stockStorage' | 'stockRetrieval' | 'inquiry';
  /** 是否只读 */
  disable?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = (props) => {
  const { title, list, onChange, extra, disable } = props;
  const actionRef = useRef<ActionType>();
  const [productList, setProductList] = useState<API.TableItem[]>([]);

  useEffect(() => {
    setProductList(list);
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
    productList.forEach((v) => {
      if (v.productId !== record.productId) {
        newList.push(v);
      }
    })

    await setProductList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  const onChangeList = async (record: API.TableItem, current?: API.TableItem) => {
    await setProductList([]);
    let newList: API.TableItem[] = [];
    if (!current) {
      newList = productList;
      newList.push(record);
    } else {
      newList = productList.map((v: API.TableItem) => {
        if (v.productId === current?.productId) {
          return record;
        } else {
          return v;
        }
      })
    }
    await setProductList(newList);
    await refreshTable();
    if (onChange) {
      onChange(newList);
    }
  }

  /** 查询表格数据 */
  const getPage = async (params: any) => {
    return {
      data: productList || [],
      total: productList.length || 0,
      message: true,
    };
  };

  // 配置完全透传antd table
  const columns: ProColumns<API.TableItem>[] = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true
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
      title: extra === 'inquiry' ? '询价数量' :
        extra === 'stockStorage' ? '已入库数量' :
          extra === 'stockRetrieval' ? '退库数量' :
            '数量',
      dataIndex: 'buyNumber',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: extra === 'stockStorage' ? '本次入库数量' :
        extra === 'stockRetrieval' ? '本次退库数量' :
          '已发货数量',
      dataIndex: 'deliverAmount',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: (extra === 'inquiry' || extra === 'saleRetrieval') ? true : false
    },
    {
      title: '含税单价（元）',
      dataIndex: 'productPrice',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '含税单总价（元）',
      dataIndex: 'totalAmount',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '目标售价',
      dataIndex: 'expectPrice',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: extra === 'inquiry' ? false : true // 询价管理
    },
    {
      title: '操作',
      hideInSearch: true,
      valueType: 'text',
      // fixed: 'right',
      hideInTable: disable ? true : false,
      width: 80,
      render: (t, r) => {
        return (
          <Space>
            {/* 编辑 */}
            <AddModal
              title="编辑"
              current={r}
              selectList={productList}
              onChange={onChangeList}
              extra={extra}
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
        {/* 选择产品 */}
        {!disable && <AddModal
          selectList={productList}
          onChange={onChangeList}
          extra={extra}
        />
        }
        {productList.length > 0 &&
          <ProTable<API.TableItem, API.Params>
            actionRef={actionRef}
            rowKey="productId"
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

export default ProductInfo;