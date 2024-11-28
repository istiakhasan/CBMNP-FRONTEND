import { DatePicker, DatePickerProps, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

type UMDatePikerProps = {
  onChange?: (valOne: Dayjs | null, valTwo: string) => void;
  name: string;
  label?: string;
  value?: Dayjs;
  size?: "large" | "small";
};

const FormDatePicker = ({
  name,
  label,
  onChange,
  size = "large",
}: UMDatePikerProps) => {
  const { control, setValue } = useFormContext();

  const handleOnChange: DatePickerProps["onChange"] = (date, dateString) => {
    //@ts-ignore
      onChange ? onChange(date, dateString) : new Date();
      setValue(name, dateString);

  };

  return (
    <div>
      {label ? label : null}
      <br />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            value={field.value?dayjs(field.value) : null}
            size={size}
            onChange={handleOnChange}
            style={{
              width:"100%",
              borderRadius: "4px",
              // background: "#F7F9FB",
              fontSize: "14px",
              fontWeight: "400",
              padding:"9px",
              // height:"48px",
              // border:"none"
            }}
          />
        )}
      />
    </div>
  );
};

export default FormDatePicker;