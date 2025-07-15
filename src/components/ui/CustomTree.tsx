import { Checkbox, Divider } from "antd";
const CustomTree = ({ treeData, checkedKeys, setCheckedKeys }: any) => {
  const handleCheck = (key: number, checked: boolean) => {
    if (checked) {
      setCheckedKeys((prev: any) => [...prev, key]);
    } else {
      setCheckedKeys((prev: any) => prev.filter((k: any) => k !== key));
    }
  };

  return (
    <div style={{}}>
      {treeData?.map((node: any) => (
        <>
          <div key={node.key} style={{ marginBottom: 24 }}>
            <div className="flex items-center">
              <Checkbox
                checked={node.children.every((item: any) =>
                  checkedKeys.includes(item.key)
                )}
                onChange={(e) => {
                  if (!!e.target.checked) {
                    setCheckedKeys([
                      ...checkedKeys,
                      ...node.children.map((item: any) => item?.key),
                    ]);
                  } else {
                    const _data = [...checkedKeys];
                    const reminingData = _data.filter(
                      (abc: any) =>
                        !node.children.some((def: any) => def.key === abc)
                    );
                    setCheckedKeys(reminingData);
                  }
                }}
              >
                All
              </Checkbox>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                {node.title}
              </div>
            </div>
            <Divider
              style={{ padding: 0, height: 0, margin: 0, marginBottom: "10px" }}
            />
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
