// 请输入正确的邮箱地址
export const email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
export const phone = /^1\d{10}$/;
export const code = /^\d{6}$/;
export const emailOrPhone = /(^1\d{10}$)|(^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$)/;
// export const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
// 请输入6-32位由数字与字母组合的密码
// export const password = /^(?![a-zA-Z]+$)(?![0-9]+$)[0-9a-zA-Z]{8,16}$/;
// 密码至少包含大写字母，小写字母，数字，且不少于8位
export const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
// export const password = /^(?![0-9a-zA-Z]+$)(?![0-9`~!#\$%\^&\*\(\)_=\-@\+\[\]\{\}\|\\;:<>,\.\?/'"]+$)(?![a-zA-Z`~!#\$%\^&\*\(\)_=\-@\+\[\]\{\}\|\\;:<>,\.\?/'"]+$)[0-9a-zA-Z`~!#\$%\^&\*\(\)_=\-@\+\[\]\{\}\|\\;:<>,\.\?/'"]{8,16}$/;
export const userName = /^([A-Za-z]|[\u4E00-\u9FA5])+$/i;
// 前后不能包含空格
export const trim = /^\S+(\s+\S+)*$/;
export const taxReg = /^[0-9a-zA-z_]{18}$/;
export const bankReg = /^([1-9]{1})(\d{14}|\d{18})$/;

// 请输入正确的联系电话
export const regPhoneAndTel = /(^([0,4]{1}[0-9]{2,3}-)?([1-9][0-9]{6,7})$)|(^1\d{10}$)/;
export const regTel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
export const regEmail = /^[\w.-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/;
// export const regEmail = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/;
export const regName = /^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/;
// 银行账号仅允许数字、字母和符号“-”，请确认并修改
export const regAccountCode = /^[a-zA-Z0-9-]+$/;
// export const regAccountCode = /^[a-zA-Z0-9\-]+$/;

export const regMoney = {
  money: {
    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    message: '请输入正确的金额',
  },
};
export const regPassword = {
  password: {
    pattern: password,
    message: '请输入长度8-16位，含大小写字母、数字组合的密码',
  },
};
export const regRules = {
  IDCard: {
    // /(^([0-9]{17}[0-9X]{1})$)/
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/,
    message: '请输入正确的身份证号号码（应为18位数字或17位数字+最末1位 X）！',
  },
  cnAndEn: {
    pattern: /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,
    message: '请输入中文、英文，2-20个字符',
  },
  trimReg: {
    pattern: trim,
    message: '前后不能包含空格',
  },
  trimAllReg: {
    pattern: /^[^ ]+$/g,
    message: '不能包含空格',
  },
  specialReg: {
    pattern: /^([\u4e00-\u9fa5a-zA-Z0-9]+)$/,
    message: '不能输入特殊字符',
  },
  codeReg: {
    pattern: /^([a-zA-Z0-9]+)$/,
    message: '不能输入特殊字符和中文',
  },
  numReg: {
    pattern: /^([0-9]+)$/,
    message: '只能输入数字',
  },
  phone: {
    pattern: regPhoneAndTel,
    message: '请输入正确的联系电话',
  }
};

// 将“true“转化为Boolean类型
export const isBoolean = (text: string) => {
  return /^true$/.test(text);
};
