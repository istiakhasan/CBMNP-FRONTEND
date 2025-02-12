"use client";
import GbCheckboxGroup from "@/components/forms/GbCheckboxGroup";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbRadioButton from "@/components/forms/GbRadioButton";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useCreateVendorMutation, useGetVendorByIdQuery, useUpdateVendorMutation } from "@/redux/api/vendorApi";
import { vendorValidationSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
   const [createvendor]=useCreateVendorMutation()  
   const [updateVendor]=useUpdateVendorMutation()  
   const router=useRouter()
   const search=useSearchParams()
   const id=search.get('id')
   
    const {data:vendorDataById}=useGetVendorByIdQuery({id})
    const submitForm = async (data:any) => {
      try {
          const res = id ? await updateVendor({ data, id }) : await createvendor(data);
  
          if (res) {
              message.success(`Vendor ${id ? 'update' : 'create'} successfully..`);
              router.push('/settings/vendor');
          }
      } catch (error) {
          message.error('Something went wrong');
      }
  };
  
  return (
    <div>
      <GbHeader title={"Add Vendor"} />
      <GbForm defaultValues={vendorDataById} submitHandler={submitForm} resolver={yupResolver(vendorValidationSchema)}>
          {/* business info */}
          <h1 className="box_title mb-[10px]">Business Info</h1>
          <Row className="mb-[20px]" gutter={16}>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Org.name" name="organization_name" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Org.address" name="organization_address" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                {" "}
                <GbFormInput label="Bin Number" name="bin_number" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Tin Number" name="tin_number" />
              </div>
            </Col>
          </Row>
          {/* Banking info */}
          <h1 className="box_title mb-[10px]">Bank Info</h1>
          <Row className="mb-[20px]" gutter={16}>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Bank Name" name="bank_name" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Branch Name" name="branch_name" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                {" "}
                <GbFormInput label="Account Name" name="account_name" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Bank Account Number" name="bank_account_number" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Routing number" name="routing_number" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Mobile banking type" name="mobile_banking_type" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Mobile banking number" name="mobile_banking_number" />
              </div>
            </Col>
          </Row>
    
          {/* Contact person info */}
          <h1 className="box_title mb-[10px]">Contact Person Info</h1>
          <Row className="mb-[20px]" gutter={16}>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Name" name="name" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Present address" name="permanent_address" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                {" "}
                <GbFormInput label="Permanent address" name="present_address" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Mobile number" name="phone_number" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Additional number" name="additional_number" />
              </div>
            </Col>
            <Col className="" md={6}>
              <div className="mb-[4px]">
                <GbFormInput label="Email" name="email" />
              </div>
            </Col>
          </Row>
          {/* Contact person info */}
          <h1 className="box_title mb-[10px]">Adjust specify</h1>
           <div className="flex gap-[100px]">
           <div>
             <h1 className="text-[#343434] font-[500] text-[16px] mb-[12px]">Damage</h1>
             <div><GbRadioButton classString="flex" options={[
                {
                    label:"Return",
                    value:"Return"
                },
                {
                    label:"Replace",
                    value:"Replace"
                },
             ]} name="damage" /></div>
          </div>
          <div>
             <h1 className="text-[#343434] font-[500] text-[16px] mb-[12px]">Slow moving</h1>
             <div>
              <GbRadioButton classString="flex"  options={[
                {
                    label:"Return",
                    value:"Return"
                },
                {
                    label:"Replace",
                    value:"Replace"
                },
             ]} name="slow_moving" />
             </div>
          </div>
          <div>
             <h1 className="text-[#343434] font-[500] text-[16px] mb-[12px]">Short dated</h1>
             <div><GbRadioButton  options={[
                {
                    label:"Return",
                    value:"Return"
                },
                {
                    label:"Replace",
                    value:"Replace"
                },
             ]} name="short_dated" classString="flex" /></div>
          </div>
          <div>
             <h1 className="text-[#343434] font-[500] text-[16px] mb-[12px]">Expire product</h1>
             <div><GbRadioButton classString="flex" options={[
                {
                    label:"Return",
                    value:"Return"
                },
                {
                    label:"Replace",
                    value:"Replace"
                },
             ]} name="expire_product" /></div>
          </div>
           </div>

          <button  className='cm_button text-[12px] py-2 px-[50px] block ml-auto'> Save</button>
    
      </GbForm>
    </div>
  );
};

export default Page;
