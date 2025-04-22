import React, { useState } from "react";
import { Checkbox, Divider } from "antd";

const CustomTree = ({ treeData, defaultKey,checkedKeys, setCheckedKeys }: any) => {
  const defaultCheckedKeys = defaultKey.map((p: any) => p.permissinId); // ✅ fix here

  // const [checkedKeys, setCheckedKeys] = useState<number[]>(defaultCheckedKeys);

  const handleCheck = (key: number, checked: boolean) => {
    if (checked) {
      setCheckedKeys((prev:any) => [...prev, key]);
    } else {
      setCheckedKeys((prev:any) => prev.filter((k:any) => k !== key));
    }
  };

  return (
    <div style={{  }}>
      {treeData?.map((node: any) => (
        <>
        <div  key={node.key} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 12,textTransform:"uppercase" }}>{node.title}</div>
            <Divider style={{padding:0,height:0,margin:0,marginBottom:"10px"}}/>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {node?.children.map((child: any) => (
              <Checkbox 
              className="w-[300px] text-[12px] bg-gray-100 p-[10px]"
              key={child.key}
              checked={checkedKeys.includes(child.key)}
              onChange={(e) => handleCheck(child.key, e.target.checked)}
              >
                {child.title}
              </Checkbox>
            ))}
          </div>
        </div>
            </>
      ))}
    </div>
  );
};

export default CustomTree;
