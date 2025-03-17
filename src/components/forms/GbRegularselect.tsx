"use client"
import { getErrorMessageByPropertyName } from "@/util/schema-validator";
import { ConfigProvider, Select } from "antd";
import { useFormContext, Controller } from "react-hook-form";

export type SelectOptions = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  size?: "large" | "small";
  value?: SelectOptions | SelectOptions[] | undefined;
  placeholder?: string;
  label?: string;
  defaultValue?: SelectOptions;
  handleChange?: (option: SelectOptions | SelectOptions[] | undefined) => void;
  multiple?:any,
  disabled?:any
  cl?:any
};

const GbRegularselect = ({
  name,
  size = "large",
  placeholder = "select",
  options,
  disabled,
  label,
  value,
  defaultValue,
  handleChange,
  multiple,
  cl
}: SelectFieldProps) => {
  const { control ,formState:{errors}} = useFormContext();

	const handleSelectChange = (
		selectedOption: SelectOptions | SelectOptions[]
	) => {
		if (handleChange) {
			handleChange(selectedOption);
		}
	};
	const errorMessage = getErrorMessageByPropertyName(errors, name);
	return (
		<>
            <label className="block w-full">{label}</label>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					// <div>
					<div style={{padding:"5px 0"}} className="floating-label-input px-0">
					<Select 
					 dropdownStyle={{
						borderRadius:"0px"
					 }}
					// showSearch
					disabled={disabled}
					className={`${errorMessage && "custom_select"} custom_select`}
					
					onChange={(selectedValue, selectedOption:any) => {
						onChange(selectedOption);
						handleSelectChange(selectedOption);
					}}
					mode={multiple && "multiple"}
					size={size}
					options={options}
					value={value}
					style={{ width: "100%",minWidth:"200px"}}
					placeholder={placeholder}
					/>
					</div>
				)}
			/>
		</>
	);
};

export default GbRegularselect;