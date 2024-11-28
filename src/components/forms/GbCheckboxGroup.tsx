import { Checkbox } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { CheckboxValueType } from 'antd/es/checkbox/Group';

type checkboxFieldProps = {
  name: string;
  checked?: boolean;
  placeholder?: string;
  label?: string;
  defaultValue?: boolean;
  handleChange?: () => void;
  options: { label: string; value: CheckboxValueType }[];
};

const GbCheckboxGroup = ({
  name,
  label,
  checked,
  defaultValue,
  handleChange,
  options
}: checkboxFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue !== undefined ? defaultValue : false}
        render={({ field: { onChange, value: fieldValue } }) => (
        <Checkbox.Group
         options={options} 
         style={{ display: 'flex', flexDirection: 'column' }}
         onChange={handleChange !== undefined ? handleChange : onChange}
        //  defaultValue={['Pear']}
          />
        )}
      />
    </>
  );
};

export default GbCheckboxGroup;
