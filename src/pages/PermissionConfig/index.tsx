import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Alert, Button, Checkbox, Collapse, Space, Typography, message } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import {
  PERMISSION_MODULES,
  collectModuleCodes,
  collectPageCodes,
  getAllRegisteredCodes,
  type PermissionModule,
  type PermissionPage,
} from '@/constants/permissionRegistry';
import { getLocalData, setLocalData } from '@/utils';

const { Text } = Typography;

function normalizeCodes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === 'string');
}

function codesSubset(selected: string[], codes: string[]): boolean {
  return codes.every((c) => selected.includes(c));
}

function codesOverlap(selected: string[], codes: string[]): boolean {
  return codes.some((c) => selected.includes(c));
}

/** 顶层路由，无 access，避免锁权限后无法自助恢复 */

const PermissionConfigPage: FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const allCodes = useMemo(() => getAllRegisteredCodes(), []);
  const [checked, setChecked] = useState<string[]>([]);

  const moduleKeys = useMemo(() => PERMISSION_MODULES.map((m) => m.code), []);

  const [activeModules, setActiveModules] = useState<string[]>(() => [...moduleKeys]);
  const [activePagesByModule, setActivePagesByModule] = useState<Record<string, string[]>>(() => {
    const r: Record<string, string[]> = {};
    PERMISSION_MODULES.forEach((m) => {
      r[m.code] = m.pages.map((p) => p.menuCode);
    });
    return r;
  });

  useEffect(() => {
    const stored = normalizeCodes(getLocalData('permissionCodes'));
    const next = stored.length ? stored : allCodes;
    setChecked(next);
  }, [allCodes]);

  const setCheckedSet = useCallback((mutate: (s: Set<string>) => void) => {
    setChecked((prev) => {
      const s = new Set(prev);
      mutate(s);
      return Array.from(s);
    });
  }, []);

  const onSave = async (opts?: { reload?: boolean }) => {
    const codes = [...checked];
    await setLocalData('permissionCodes', codes);
    await setInitialState((s) => ({
      ...s,
      permissionCodes: codes,
    }));
    message.success('权限已保存');
    if (opts?.reload) {
      window.location.reload();
    }
  };

  const expandAll = () => {
    setActiveModules([...moduleKeys]);
    const r: Record<string, string[]> = {};
    PERMISSION_MODULES.forEach((m) => {
      r[m.code] = m.pages.map((p) => p.menuCode);
    });
    setActivePagesByModule(r);
  };

  const collapseAll = () => {
    setActiveModules([]);
    setActivePagesByModule({});
  };

  const moduleCheckboxState = (mod: PermissionModule) => {
    const all = collectModuleCodes(mod);
    const ok = codesSubset(checked, all);
    const some = codesOverlap(checked, all);
    return { checked: ok, indeterminate: !ok && some };
  };

  const pageCheckboxState = (mod: PermissionModule, page: PermissionPage) => {
    const pageCodes = collectPageCodes(page);
    const ok = codesSubset(checked, pageCodes);
    const some = codesOverlap(checked, pageCodes);
    return { checked: ok, indeterminate: !ok && some };
  };

  const toggleModuleAll = (mod: PermissionModule, select: boolean) => {
    const all = collectModuleCodes(mod);
    setCheckedSet((s) => {
      if (select) {
        all.forEach((c) => s.add(c));
      } else {
        all.forEach((c) => s.delete(c));
      }
    });
  };

  const onModuleCheckboxChange =
    (mod: PermissionModule) => (e: CheckboxChangeEvent) => {
      toggleModuleAll(mod, e.target.checked);
    };

  const togglePageAll = (mod: PermissionModule, page: PermissionPage, select: boolean) => {
    const pageCodes = collectPageCodes(page);
    setCheckedSet((s) => {
      if (select) {
        s.add(mod.code);
        pageCodes.forEach((c) => s.add(c));
      } else {
        pageCodes.forEach((c) => s.delete(c));
        const restInMod = collectModuleCodes(mod).filter((c) => !pageCodes.includes(c));
        const keepMod = restInMod.some((c) => s.has(c));
        if (!keepMod) {
          s.delete(mod.code);
        }
      }
    });
  };

  const onPageCheckboxChange =
    (mod: PermissionModule, page: PermissionPage) => (e: CheckboxChangeEvent) => {
      togglePageAll(mod, page, e.target.checked);
    };

  const renderPagePanel = (mod: PermissionModule, page: PermissionPage) => {
    const menuMergedWithModule = page.menuCode === mod.code;
    const ps = pageCheckboxState(mod, page);

    const header = (
      <Space align="start" wrap size="middle">
        {!menuMergedWithModule && (
          <Checkbox
            checked={ps.checked}
            indeterminate={ps.indeterminate}
            onChange={onPageCheckboxChange(mod, page)}
            onClick={(e) => e.stopPropagation()}
          >
            <Text strong>{page.label}</Text>
          </Checkbox>
        )}
        {menuMergedWithModule && (
          <Text strong>
            {page.label}
            <Text type="secondary" style={{ marginLeft: 8, fontWeight: 'normal' }}>
              （页面菜单与一级相同）
            </Text>
          </Text>
        )}
      </Space>
    );

    const body =
      page.buttons.length === 0 ? (
        <Text type="secondary">无单独按钮权限项</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%', paddingLeft: menuMergedWithModule ? 0 : 24 }}>
          <Text type="secondary">操作按钮</Text>
          <Checkbox.Group
            value={checked.filter((c) => page.buttons.some((b) => b.code === c))}
            style={{ width: '100%' }}
            onChange={(list) => {
              const next = list as string[];
              const btnCodes = new Set(page.buttons.map((b) => b.code));
              setChecked((prev) => {
                const s = new Set(prev.filter((c) => !btnCodes.has(c)));
                next.forEach((c) => s.add(c));
                if (next.length > 0) {
                  s.add(mod.code);
                  s.add(page.menuCode);
                }
                return Array.from(s);
              });
            }}
          >
            <Space direction="vertical">
              {page.buttons.map((b) => (
                <Checkbox key={b.code} value={b.code}>
                  {b.label}
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({b.code})
                  </Text>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Space>
      );

    return (
      <Collapse.Panel header={header} key={page.menuCode}>
        {body}
      </Collapse.Panel>
    );
  };

  return (
    <PageContainer title="权限配置" className="sales">
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="一级对应侧栏分组，二级对应页面菜单，其余为按钮。勾选后保存并刷新即可生效；取消「编辑」等按钮仅隐藏按钮，不影响进入列表页（若仍勾选页面菜单）。"
      />
      <ProCard>
        <Space style={{ marginBottom: 16 }} wrap>
          <Button onClick={() => setChecked(allCodes)}>全选</Button>
          <Button danger onClick={() => setChecked([])}>
            清空
          </Button>
          <Button onClick={expandAll}>展开一级与二级</Button>
          <Button onClick={collapseAll}>收起一级与二级</Button>
          <Button type="primary" onClick={() => onSave()}>
            保存（立即更新当前会话）
          </Button>
          <Button type="primary" ghost onClick={() => onSave({ reload: true })}>
            保存并刷新页面
          </Button>
        </Space>

        <Collapse activeKey={activeModules} onChange={(k) => setActiveModules(k as string[])}>
          {PERMISSION_MODULES.map((mod) => {
            const ms = moduleCheckboxState(mod);
            const innerActive = activePagesByModule[mod.code] ?? [];

            return (
              <Collapse.Panel
                key={mod.code}
                header={
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={ms.checked}
                      indeterminate={ms.indeterminate}
                      onChange={onModuleCheckboxChange(mod)}
                    >
                      <Text strong>{mod.label}</Text>
                      <Text type="secondary">一级 · {mod.code}</Text>
                    </Checkbox>
                  </Space>
                }
              >
                {mod.pages.length === 1 &&
                mod.pages[0].buttons.length === 0 &&
                mod.pages[0].menuCode === mod.code ? (
                  <Text type="secondary">仅需勾选上方一级即可访问该页面，无独立按钮权限。</Text>
                ) : (
                  <Collapse
                    bordered={false}
                    activeKey={innerActive}
                    onChange={(keys) =>
                      setActivePagesByModule((prev) => ({
                        ...prev,
                        [mod.code]: keys as string[],
                      }))
                    }
                  >
                    {mod.pages.map((page) => renderPagePanel(mod, page))}
                  </Collapse>
                )}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </ProCard>
    </PageContainer>
  );
};

export default PermissionConfigPage;
