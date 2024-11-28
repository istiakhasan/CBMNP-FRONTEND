import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { Col } from "antd";
import { useFormContext } from "react-hook-form";

const ProbashiForm = () => {
  const {watch}=useFormContext()
  return (
    <>
     <Col md={12} className="mb-[12px]">
        <GbFormInput name="probashi_number" placeholder="Number" />
      </Col>
      <Col md={12} className="mb-[12px]">
        <GbFormInput name="probashi_additional_number" placeholder="Additional number" />
      </Col>
      <Col md={12} className="mb-[12px]">
        <GbFormInput name="probashi_name" placeholder="Name" />
      </Col>
     
      <Col md={12} className="mb-[12px]">
        <GbFormInput name="probashi_address" placeholder="Address" />
      </Col>
    
      <Col md={12} className="mb-[12px]">
        <GbFormSelect
          options={[
            {
              label: "UAE",
              value: "UAE",
            },
          ]}
          name="probashi_uae"
          placeholder="country"
        />
      </Col>
      <Col md={12} className="mb-[12px]">
        <GbFormSelect
          options={[
            {
              label: "Dubai",
              value: "Dubai",
            },
          ]}
          name="probashi_state"
          placeholder="State"
        />
      </Col>
    
    </>
  );
};
export default ProbashiForm;
