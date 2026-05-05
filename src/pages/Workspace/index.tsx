import React from 'react';
import { Col, Row } from 'antd';
import TableList from './components/TableList';
import TypeTitle from './components/TypeTitle';
import { workspaceApi } from '@/services/api';

/** 工作台 */

const ProductManage: React.FC = () => {
  const workList = [
    {
      title: '订单事项',
      tableArr: [
        {
          title: '本月销售订单',
          api: workspaceApi.queryOrder,
          param: { orderType: 'SALES_ORDER' }
        }, {
          title: '本月采购订单',
          api: workspaceApi.queryOrder,
          param: { orderType: 'PURCHASE_ORDER' }
        }
      ]
    }, {
      title: '收付款事项',
      tableArr: [
        {
          title: '待收款订单',
          api: workspaceApi.queryPendingPayOrReceiveOrders,
          param: { paymentOperateType: 'PAYMENT_RECEIVE' }
        }, {
          title: '待付款订单',
          api: workspaceApi.queryPendingPayOrReceiveOrders,
          param: { paymentOperateType: 'PAYMENT_PAY' }
        }
      ]
    }, {
      title: '待办事项',
      tableArr: [
        {
          title: '待审核询价单',
          api: workspaceApi.queryPendingAuditQueryOrders,
          param: {}
        }, {
          title: '待审核销售单',
          api: workspaceApi.queryPendingAuditOrders,
          param: {}
        }
      ]
    }
  ]

  return (
    <div style={{ backgroundColor: '#fff', padding: 24 }}>
      {workList.map((item) => {
        return <>
          <TypeTitle title={item.title} />
          <Row gutter={96} style={{ marginBottom: 32 }}>
            {item.tableArr.map((v) => {
              return <Col span={12} key={v.title}>
                <TableList title={v.title} api={v.api} param={v?.param} />
              </Col>
            })}
          </Row>
        </>
      })}
    </div>
  );
};

export default ProductManage;
