import moment from 'moment';

const formatDate = (val: string | number, formatStr?: string) => {
  if (!val || isNaN(moment(val).valueOf()) || val < 0) {
    return undefined;
  }
  return moment(val).format(formatStr || 'YYYY-MM-DD');
};

/** 日期展示 */
export const dateShow = (val: string | number) => formatDate(val);

/** 日期展示（带时分秒） */
export const dateTimeShow = (val: string | number) => formatDate(val, 'YYYY-MM-DD HH:mm:ss');

/** 格式化日期时间入参【用于处理接口入参】 */
export const formatDateTime = (val: string | number) => formatDate(val, 'YYYY-MM-DD 00:00:00');

export const formatDateTimeForQuery = (val: string | number) => new Date(val).getTime();

/** dateRange 参数转换；配合Table的搜索栏使用 */
export const dateRangeValueTrf = ({ name, value }: any) => {
  const names = name.split(',');
  let value1 = value?.[0];
  let value2 = value?.[1];
  if (moment.isMoment(value1)) {
    value1 = moment(value1).format('YYYY-MM-DD 00:00:00');
  }
  if (moment.isMoment(value2)) {
    value2 = moment(value2).format('YYYY-MM-DD 23:59:59');
  }
  return {
    [names[0]]: value1,
    [names[1]]: value2,
  };
};
