import { Checkbox } from "antd";
import { useFormContext, Controller } from "react-hook-form";

type CheckboxFieldProps = {
  name: string;
  checked?: boolean;
  placeholder?: string;
  label?: string;
  defaultValue?: boolean;
  handleChange?: (checked: boolean) => void;
};

const GbFormCheckbox = ({
  name,
  label,
  checked,
  defaultValue,
  handleChange,
}: CheckboxFieldProps) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue !== undefined ? defaultValue : false}
      render={({ field: { onChange, value: fieldValue } }) => (
        <Checkbox
          checked={checked !== undefined ? checked : fieldValue}
          onChange={(e) => {
            const isChecked = e.target.checked; // Extract the updated value
            if (handleChange) {
              handleChange(isChecked);
            }
            setValue(name, isChecked); // Update the form state
          }}
        >
          <span className="text-[#7D7D7D] text-[16px] font-[500]">{label}</span>
        </Checkbox>
      )}
    />
  );
};

export default GbFormCheckbox;
