import React, { useState, useEffect } from 'react';
import { Button, Form, message, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import BasicInfo from './components/BasicInfo';
import ExpenseInfo from '@/components/ExpenseInfo';
import { costApplyApi } from '@/services/api';
import { getPageQuery } from '@/utils';
import { dateShow, dateTimeShow } from '@/utils/date';
import moment from 'moment';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const Add: React.FC = () => {
  const { id } = getPageQuery();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [costList, setostList] = useState<API.TableItem[]>([]);
  const [info, setInfo] = useState<any>({});

  /** 获取详情数据 */
  const getInfo = () => {
    costApplyApi.info({ costApplyId: id }).then((res: any) => {
      if (res && res?.code === 200) {
        setInfo(res.data);
        setostList(res.data?.costs);
        form.setFieldsValue({
          ...res.data,
          applyTime: moment(dateShow(res.data?.applyTime))
        });
      } else {
        message.error(res?.msg);
      }
    })
  }

  useEffect(() => {
    if (id) {
      getInfo();
    }
  }, [id])

  /** 取消 */
  const onCancel = () => {
    history.push(`/daily/costApply`);
  };

  /** 提交 */
  const onSubmit = () => {
    setConfirmLoading(true);
    form.validateFields().then((values: any) => {
      costApplyApi.save({
        ...info,
        ...values,
        applyTime: dateTimeShow(values?.applyTime),
        userName: form.getFieldValue('userName'),
        costs: costList
      }).then((res: any) => {
        if (res && res?.code === 200) {
          message.success(`保存成功！`);
          onCancel();
        } else {
          message.error(res?.msg);
        }
      })
      setConfirmLoading(false);
    }).catch(() => {
      setConfirmLoading(false);
    })
  };

  return (
    <PageContainer>
      <div className="sales-form">
        <Form
          {...layout}
          form={form}
          name="form"
          scrollToFirstError={true}
        >
          {/* 报销单基本信息 */}
          <BasicInfo form={form} />
          {/* 费用项目信息 */}
          <ExpenseInfo title="费用项目信息" list={costList} onChange={(list: API.TableItem[]) => setostList(list)} />
        </Form>

        <div className="sales-form-footer">
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" loading={confirmLoading} onClick={onSubmit}>
              保存
            </Button>
          </Space>
        </div>
      </div>
    </PageContainer>
  )
}

export default Add;