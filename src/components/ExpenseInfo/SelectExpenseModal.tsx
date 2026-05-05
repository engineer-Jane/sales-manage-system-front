import React, { useRef } from 'react';
import { Button, Modal, Space, Tag } from 'antd';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useToggle } from 'ahooks';

/** 选择订单 */

type SelectOrderModalProps = {
  /** 已选择费用数据 */
  feeList: any[];
  /** 选择产品成功回调 */
  onChange: (val: API.TableItem[]) => void;
}

const SelectOrderModal: React.FC<SelectOrderModalProps> = (props) => {
  const { feeList, onChange } = props;
  const actionRef = useRef<ActionType>();
  const [visible, { toggle }] = useToggle(false);

  /** 刷新表格 */
  const refreshTable = () => {
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  };

  /** 获取费用数据 */
  const getFeeList = () => {
    // workspaceApi.info({ id }).then((res: any) => {
    //   if (res && res?.code === 1) {
    //     setInfo(res.data);
    //     form.setFieldsValue({
    //       ...res.data,
    //       parentId: res.data.parent.id
    //     });
    //   } else {
    //     message.error(res?.msg);
    //   }
    // })
  }

  /** 打开弹窗 */
  const openModal = async () => {
    // await getFeeList();
    if (feeList.length > 0) {
      refreshTable();
    }
    toggle();
  }

  /** 关闭弹窗 */
  const onCancel = () => toggle();

  /** 选择产品 */
  const onSelect = (record: API.TableItem) => {
    if (onChange) {
      onChange([record]);
      onCancel();
    }
  }

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
      title: '',
      dataIndex: 'keyword',
      valueType: 'text',
    },
    {
      title: '费用编号',
      dataIndex: 'keyword',
      valueType: 'text',
      hideInSearch: true,
      render: (t, r) => {
        if (feeList.length > 0 && feeList[0].id === r.id) {
          return <>
            <Tag color="blue" style={{ marginRight: 8 }}> 当前选择 </Tag>
            {t}
          </>
        }
        return t;
      }
    },
    {
      title: '费用名称',
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true
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
        {feeList.length > 0 ? '重新选择' : '选择订单'}
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
          rowKey="id"
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

export default SelectOrderModal;