import GbCheckboxGroup from "@/components/forms/GbCheckboxGroup";
import GbForm from "@/components/forms/GbForm";
import GbRadioButton from "@/components/forms/GbRadioButton";
import React from "react";

const Certification = () => {
  return (
    <div>
      <GbForm submitHandler={(data:any) => console.log(data)}>
        <GbCheckboxGroup
          name="certification"
        
          options={[
            {
              label: "BSTI",
              value: "BSTI",
            },
            {
              label: "ISO",
              value: "ISO",
            },
            {
              label: "USAD",
              value: "USAD",
            },
            {
              label: "HALAL",
              value: "HALAL",
            },
            {
              label: "ORGANIC",
              value: "ORGANIC",
            },
          ]}
        />
      </GbForm>
    </div>
  );
};

export default Certification;
