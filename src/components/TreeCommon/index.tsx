/** 公共tree组件 */
import { Tree } from 'antd';
import React from 'react';

interface TreeCommonProps {
  isDefaultSelectedKeys?: boolean;
  isCheckbox?: boolean;
  treeData: any;
  checkStrictly?: boolean;
  checkedKeys?: any;
  fieldNames?: any;
  onSelect?: (values: string) => void;
  onCheckbox?: (values: string[]) => void;
}

const TreeCommon: React.FC<TreeCommonProps> = (props) => {
  const {
    isDefaultSelectedKeys,
    isCheckbox,
    treeData,
    checkStrictly,
    checkedKeys,
    fieldNames,
    onSelect,
    onCheckbox,
    ...otherProps
  } = props;

  /** 点击树节点触发 */
  const handleSelect = (e: any) => {
    if (e && e.length > 0) {
      if (onSelect) onSelect(e[0]);
    }
  };

  /** 选中复选框 */
  const handleCheck = (e: any) => {
    if (onCheckbox) {
      onCheckbox(e);
    }
  };
  const keyField = fieldNames?.key ?? 'key';
  const firstNode = Array.isArray(treeData) && treeData.length > 0 ? treeData[0] : undefined;
  const firstKey = firstNode != null && firstNode[keyField] != null ? String(firstNode[keyField]) : undefined;

  return (
    <>
      {treeData?.length > 0 &&
        <Tree
          {...otherProps}
          fieldNames={fieldNames}
          defaultSelectedKeys={isDefaultSelectedKeys && firstKey ? [firstKey] : []}
          defaultExpandedKeys={firstKey ? [firstKey] : []}
          treeData={treeData}
          checkStrictly={checkStrictly}
          checkedKeys={checkedKeys}
          checkable={isCheckbox}
          onSelect={handleSelect}
          onCheck={handleCheck}
          style={{ height: '100%' }}
        />
      }
    </>
  );
};

export default TreeCommon;