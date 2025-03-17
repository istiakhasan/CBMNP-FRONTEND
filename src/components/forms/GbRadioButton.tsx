import {  Radio } from "antd";
import { useFormContext, Controller } from "react-hook-form"

type checkboxFieldProps = {
  name: string;
  checked?: boolean;
  placeholder?: string;
  label?: string;
  defaultValue?: boolean;
  handleChange?: () => void;
  options: { label: string; value: any }[];
  value?:string
  classString?:string
};

const GbRadioButton = ({
  name,
  label,
  classString,
  defaultValue,
  handleChange,
  options,
  value
}: checkboxFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
          <div className="">
        {label ? <span className="mb-[4px]">{label}</span> : null}
      </div>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue !== undefined ? defaultValue : false}
        render={({ field: { onChange, value: fieldValue } }) => (
        <Radio.Group style={{display:classString,flexDirection:"column"}} onChange={handleChange !== undefined ? handleChange : onChange} value={value?value:fieldValue}>
        {
            options.map((item,i)=>(
                <Radio key={i} value={item?.value}>{item?.label}</Radio>
            ))
        }
      </Radio.Group>
        )}
      />
    </>
  );
};

export default GbRadioButton;
