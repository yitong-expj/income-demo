export function cents(value) {
  const text = String(value).trim();
  if (text === '') return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error('请输入非负金额，最多两位小数');
  const [whole, fraction = ''] = text.split('.');
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(result) || result > 99999999999) throw new Error('金额不能超过 999,999,999.99 元');
  return result;
}
export function calculate(income, expenses) {
  const totalIncome = cents(income);
  if (!Array.isArray(expenses) || expenses.length > 30) throw new Error('最多添加 30 项支出');
  const items = expenses.map(item => {
    if (typeof item.name !== 'string' || !item.name.trim() || item.name.length > 20) throw new Error('支出名称需为 1–20 个字');
    return { name: item.name.trim(), amount: cents(item.amount) };
  });
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return { income: totalIncome, total, balance: totalIncome - total, rate: totalIncome ? (totalIncome - total) / totalIncome * 100 : null, items };
}
export const money = value => (value / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
