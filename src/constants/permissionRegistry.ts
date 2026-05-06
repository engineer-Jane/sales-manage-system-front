/**
 * 与 config/routes.ts 中 route.auth、各页 Access 权限码保持一致。
 * 一级：侧栏模块；二级：页面菜单；三级：操作按钮。
 */

export type PermissionButton = { code: string; label: string };

/** 二级菜单（页面）及其按钮 */
export type PermissionPage = {
  /** 路由 access 码，与 routes 中子路由 auth 一致 */
  menuCode: string;
  label: string;
  buttons: PermissionButton[];
};

export type PermissionModule = {
  /** 一级侧栏分组权限码 */
  code: string;
  label: string;
  pages: PermissionPage[];
};

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    code: 'workspace',
    label: '工作台',
    pages: [{ menuCode: 'workspace', label: '工作台', buttons: [] }],
  },
  {
    code: 'base',
    label: '基础信息管理',
    pages: [
      {
        menuCode: 'base.department',
        label: '部门管理',
        buttons: [
          { code: 'base.department.add', label: '新增' },
          { code: 'base.department.edit', label: '编辑' },
          { code: 'base.department.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.user',
        label: '员工管理',
        buttons: [
          { code: 'base.user.add', label: '新增' },
          { code: 'base.user.edit', label: '编辑' },
          { code: 'base.user.setDepartment', label: '设置部门' },
          { code: 'base.user.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.role',
        label: '角色管理',
        buttons: [
          { code: 'base.role.add', label: '新增' },
          { code: 'base.role.edit', label: '编辑' },
          { code: 'base.role.setFun', label: '功能设置' },
          { code: 'base.role.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.resource',
        label: '菜单管理',
        buttons: [
          { code: 'base.resource.add', label: '新增' },
          { code: 'base.resource.edit', label: '编辑' },
          { code: 'base.resource.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.auth',
        label: '权限管理',
        buttons: [{ code: 'base.auth.configRole', label: '配置角色' }],
      },
      {
        menuCode: 'base.brand',
        label: '产品品牌管理',
        buttons: [
          { code: 'base.brand.add', label: '新增' },
          { code: 'base.brand.edit', label: '编辑' },
          { code: 'base.brand.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.product',
        label: '产品管理',
        buttons: [
          { code: 'base.product.add', label: '新增' },
          { code: 'base.product.edit', label: '编辑' },
          { code: 'base.product.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.customer',
        label: '客户管理',
        buttons: [
          { code: 'base.customer.add', label: '新增' },
          { code: 'base.customer.edit', label: '编辑' },
          { code: 'base.customer.delete', label: '删除' },
        ],
      },
      {
        menuCode: 'base.costType',
        label: '费用类型管理',
        buttons: [
          { code: 'base.costType.add', label: '新增' },
          { code: 'base.costType.edit', label: '编辑' },
          { code: 'base.costType.delete', label: '删除' },
        ],
      },
    ],
  },
  {
    code: 'order',
    label: '订单管理',
    pages: [
      {
        menuCode: 'order.sale',
        label: '销售订单',
        buttons: [
          { code: 'order.sale.add', label: '新增' },
          { code: 'order.sale.edit', label: '编辑' },
          { code: 'order.sale.contract', label: '合同' },
          { code: 'order.sale.delete', label: '删除' },
          { code: 'order.sale.export', label: '导出' },
        ],
      },
      {
        menuCode: 'order.purchase',
        label: '采购订单',
        buttons: [
          { code: 'order.purchase.add', label: '新增' },
          { code: 'order.purchase.edit', label: '编辑' },
          { code: 'order.purchase.contract', label: '合同' },
          { code: 'order.purchase.delete', label: '删除' },
          { code: 'order.purchase.export', label: '导出' },
        ],
      },
    ],
  },
  {
    code: 'sale',
    label: '销售管理',
    pages: [
      {
        menuCode: 'sale.storage',
        label: '销售出库单',
        buttons: [
          { code: 'sale.storage.add', label: '新增' },
          { code: 'sale.storage.edit', label: '编辑' },
          { code: 'sale.storage.exWarehouse', label: '出库' },
          { code: 'sale.storage.delete', label: '删除' },
          { code: 'sale.storage.export', label: '导出明细' },
        ],
      },
      {
        menuCode: 'sale.retrieval',
        label: '销售退库单',
        buttons: [
          { code: 'sale.retrieval.add', label: '新增' },
          { code: 'sale.retrieval.edit', label: '编辑' },
          { code: 'sale.retrieval.delete', label: '删除' },
          { code: 'sale.retrieval.export', label: '导出明细' },
        ],
      },
    ],
  },
  {
    code: 'stock',
    label: '库存管理',
    pages: [
      {
        menuCode: 'stock.storage',
        label: '采购入库单',
        buttons: [
          { code: 'stock.storage.add', label: '新增' },
          { code: 'stock.storage.edit', label: '编辑' },
          { code: 'stock.storage.delete', label: '删除' },
          { code: 'stock.storage.export', label: '导出明细' },
        ],
      },
      {
        menuCode: 'stock.retrieval',
        label: '采购退库单',
        buttons: [
          { code: 'stock.retrieval.add', label: '新增' },
          { code: 'stock.retrieval.edit', label: '编辑' },
          { code: 'stock.retrieval.delete', label: '删除' },
          { code: 'stock.retrieval.export', label: '导出明细' },
        ],
      },
      {
        menuCode: 'stock.details',
        label: '库存明细表',
        buttons: [{ code: 'stock.details.export', label: '导出' }],
      },
    ],
  },
  {
    code: 'bills',
    label: '财务管理',
    pages: [
      {
        menuCode: 'bills.paymentRecord',
        label: '收付款记录管理',
        buttons: [
          { code: 'bills.paymentRecord.add', label: '新增' },
          { code: 'bills.paymentRecord.edit', label: '编辑' },
          { code: 'bills.paymentRecord.delete', label: '删除' },
          { code: 'bills.paymentRecord.export', label: '导出' },
        ],
      },
      {
        menuCode: 'bills.prepayment',
        label: '待收待付款明细',
        buttons: [{ code: 'bills.prepayment.export', label: '导出' }],
      },
      {
        menuCode: 'bills.invoice',
        label: '发票管理',
        buttons: [
          { code: 'bills.invoice.add', label: '新增' },
          { code: 'bills.invoice.edit', label: '编辑' },
          { code: 'bills.invoice.submit', label: '提交' },
          { code: 'bills.invoice.audit', label: '审核' },
          { code: 'bills.invoice.details', label: '详情' },
          { code: 'bills.invoice.delete', label: '删除' },
          { code: 'bills.invoice.export', label: '导出' },
        ],
      },
    ],
  },
  {
    code: 'daily',
    label: '日常管理',
    pages: [
      {
        menuCode: 'daily.costApply',
        label: '费用报销管理',
        buttons: [
          { code: 'daily.costApply.add', label: '新增' },
          { code: 'daily.costApply.edit', label: '编辑' },
          { code: 'daily.costApply.submit', label: '提交' },
          { code: 'daily.costApply.audit', label: '审核' },
          { code: 'daily.costApply.details', label: '详情' },
          { code: 'daily.costApply.delete', label: '删除' },
        ],
      },
    ],
  },
  {
    code: 'inquiry',
    label: '询价管理',
    pages: [
      {
        menuCode: 'inquiry',
        label: '询价管理',
        buttons: [
          { code: 'inquiry.add', label: '新增' },
          { code: 'inquiry.edit', label: '编辑' },
          { code: 'inquiry.submit', label: '提交' },
          { code: 'inquiry.audit', label: '审核' },
          { code: 'inquiry.details', label: '详情' },
          { code: 'inquiry.delete', label: '删除' },
        ],
      },
    ],
  },
];

/** 某模块下全部权限码（含一级、各二级菜单、各按钮） */
export function collectModuleCodes(mod: PermissionModule): string[] {
  const set = new Set<string>([mod.code]);
  mod.pages.forEach((p) => {
    set.add(p.menuCode);
    p.buttons.forEach((b) => set.add(b.code));
  });
  return Array.from(set);
}

/** 某页面及其按钮（不含一级模块码） */
export function collectPageCodes(page: PermissionPage): string[] {
  const set = new Set<string>([page.menuCode]);
  page.buttons.forEach((b) => set.add(b.code));
  return Array.from(set);
}

export function getAllRegisteredCodes(): string[] {
  const set = new Set<string>();
  PERMISSION_MODULES.forEach((m) => {
    collectModuleCodes(m).forEach((c) => set.add(c));
  });
  return Array.from(set);
}
