import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme } from 'antd';
import CollapsChildren from './CollapsChildren';
const GbCollaps = ({attributes,setAttributes}:any) => {
  const { token } = theme.useToken();
  const {Panel}=Collapse
  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) => <CaretRightOutlined style={{color:"#288ea5"}} rotate={isActive ? 90 : 0} />}
      style={{ background: token.colorBgContainer }}
    > 
    {
      attributes?.map((item:any,i:any)=>(
         <Panel header={<div className="flex justify-between items-center">
          {item?.label}{" "}
          <div>
            <i onClick={(e)=>{
              e.stopPropagation()
               const _data=[...attributes]
               _data.splice(i,1)
               setAttributes(_data)    
            }} className="ri-delete-bin-line"></i>
          </div>
        </div>} key={i}>
          <CollapsChildren index={i} setAttributes={setAttributes} attributes={attributes} />
        </Panel>
      ))
    }
    
    </Collapse>
  );
};

export default GbCollaps;

