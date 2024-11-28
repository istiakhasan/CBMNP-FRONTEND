import { Checkbox } from "antd";
import { useFormContext, Controller } from "react-hook-form";

type checkboxFieldProps = {
  name: string;
  checked?: boolean;
  placeholder?: string;
  label?: string;
  defaultValue?: boolean;
  handleChange?: any;
};

const GbFormCheckbox = ({
  name,
  label,
  checked,
  defaultValue,
  handleChange,
}: checkboxFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue !== undefined ? defaultValue : false}
        render={({ field: { onChange, value: fieldValue } }) => (
          <Checkbox
            checked={checked !== undefined ? checked : fieldValue}
            onChange={handleChange !== undefined ?()=> handleChange(fieldValue) : onChange}
          >
            <span className="text-[#7D7D7D] text-[16px] font-[500]">{label}</span>
          </Checkbox>
        )}
      />
    </>
  );
};

export default GbFormCheckbox;
