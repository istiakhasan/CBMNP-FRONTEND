import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useUpdateBrandMutation } from "@/redux/api/brandApi";
import { useUpdateOfficeMutation } from "@/redux/api/officeApi";
import { officeSchemaValidation } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
const EditOffice = ({
  setOpenModal,
  rowData,
}: {
  setOpenModal: (openModal: boolean) => void;
  rowData: any;
}) => {
  const [updateHandler] = useUpdateOfficeMutation();
  const submitForm = async (data: any) => {
    try {
      const payload: any={}
      payload['phoneNumber']=data?.phoneNumber
      payload['location']=data?.location
      payload['name']=data?.name
      const res = await updateHandler({
        data: payload,
        id: rowData?.id,
      }).unwrap();
      if (res) {
        setOpenModal(false);
        message.success("Office updated successfully...");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  return (
    <div>
    <GbForm
       defaultValues={rowData}
        submitHandler={submitForm}
        resolver={yupResolver(officeSchemaValidation)}
    >
        <div className="mb-2 ">
            <GbFormInput required={true} name="name" label="Office Name" />
        </div>
        <div className="mb-2 ">
            <GbFormInput required={true} name="location" label="Locatioin" />
        </div>
        <div className="mb-2 ">
            <GbFormInput required={true} name="phoneNumber" label="Phone Number" />
        </div>
        <button className="cm_button mt-[30px] px-[50px] ml-auto block">
            Save
        </button>
    </GbForm>
</div>
  );
};

export default EditOffice;
