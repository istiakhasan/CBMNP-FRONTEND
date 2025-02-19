"use client"
import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import type { TreeProps } from 'antd';


const GbTree = ({ treeData, setCheckedKeys, checkedKeys,defaultKey }: any) => {
  // Function to recursively get all keys based on titles matching the array
  const getMatchingKeys = (data: any[], matchArray: any[]) => {
    let keys: React.Key[] = [];
    data?.forEach((item:any) => {
      if (matchArray?.find(jtem=>item.key===jtem?.permissinId)) {
        keys.push(item.key);
      }
      if (item.children) {
        keys = keys.concat(getMatchingKeys(item.children, matchArray));
      }
    });
    return keys;
  };

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    const allKeys = getMatchingKeys(treeData, defaultKey); // Get keys matching titles
    setCheckedKeys(allKeys); // Update checkedKeys with matching keys
    const expanded = getAllKeys(treeData); // Expand all nodes
    setExpandedKeys(expanded);
  }, [treeData,defaultKey]);

  const getAllKeys = (data: any[]) => {
    let keys: React.Key[] = [];
    data?.forEach(item => {
      keys.push(item.key);
      if (item.children) {
        keys = keys.concat(getAllKeys(item.children));
      }
    });
    return keys;
  };

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  );
};

export default GbTree;
