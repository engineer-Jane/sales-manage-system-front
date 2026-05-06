/**
 * 列表等只读场景的展示脱敏。表单编辑页勿使用，以免影响录入。
 * 构建时设置 REACT_APP_DESENSITIZE=false 可关闭脱敏（仅限调试环境）。
 */

function isMaskOff(): boolean {
  return process.env.REACT_APP_DESENSITIZE === 'false';
}

/** 统一入口：空值原样为空；关闭脱敏时返回原始字符串 */
export function displayMasked(value: unknown, maskFn: (plain: string) => string): string {
  if (value == null || value === '') return '';
  const s = String(value).trim();
  if (!s) return '';
  if (isMaskOff()) return s;
  return maskFn(s);
}

/** 手机号或固话等数字为主的号码 */
export function maskTel(plain: string): string {
  const digits = plain.replace(/\D/g, '');
  if (digits.length === 11 && /^1\d{10}$/.test(digits)) {
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  }
  if (plain.length <= 4) return '*'.repeat(plain.length);
  return `${plain.slice(0, 2)}****${plain.slice(-2)}`;
}

/** 中文姓名保留首字；英文等保留首尾 */
export function maskPersonName(plain: string): string {
  const s = plain.trim();
  if (!s) return '';
  if (/[\u4e00-\u9fa5]/.test(s)) {
    if (s.length <= 1) return '*';
    return `${s[0]}${'*'.repeat(s.length - 1)}`;
  }
  if (s.length <= 2) return `${s[0]}*`;
  return `${s[0]}***${s.slice(-1)}`;
}

/** 纳税人识别号 / 统一社会信用代码等 */
export function maskTaxpayerId(plain: string): string {
  const s = plain.trim();
  if (s.length <= 8) return '*'.repeat(s.length);
  return `${s.slice(0, 4)}${'*'.repeat(s.length - 8)}${s.slice(-4)}`;
}

/** 地址：保留前缀，后半省略 */
export function maskAddress(plain: string, headLen = 10): string {
  const s = plain.trim();
  if (!s) return '';
  if (s.length <= headLen) return `${s.slice(0, Math.min(4, s.length))}***`;
  return `${s.slice(0, headLen)}…`;
}

/** 银行账号：保留前四后四 */
export function maskBankAccountNo(plain: string): string {
  const d = plain.replace(/\s/g, '');
  if (d.length <= 8) return '*'.repeat(d.length);
  return `${d.slice(0, 4)} **** **** ${d.slice(-4)}`;
}
