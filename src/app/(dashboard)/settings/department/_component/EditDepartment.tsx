import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useUpdateBrandMutation } from "@/redux/api/brandApi";
import { useUpdateDepartmentMutation } from "@/redux/api/departmentApi";
import { useGetAllOfficeQuery, useUpdateOfficeMutation } from "@/redux/api/officeApi";
import { officeSchemaValidation } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
const EditDepartment = ({
  setOpenModal,
  rowData,
}: {
  setOpenModal: (openModal: boolean) => void;
  rowData: any;
}) => {
  const [updateHandler] = useUpdateDepartmentMutation();
  const {data,isLoading}=useGetAllOfficeQuery(undefined)
  const submitForm = async (data: any) => {
    try {
      const payload: any={}
      payload['name']=data?.name
      payload['officeId']=data?.office?.value
      const res = await updateHandler({
        data: payload,
        id: rowData?.id,
      }).unwrap();
      if (res) {
        setOpenModal(false);
        message.success("Department updated successfully...");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  return (
    <div>
    <GbForm
        submitHandler={submitForm}
        defaultValues={{...rowData,office:{label:rowData?.office?.name,value:rowData?.office?.id}}}
        // resolver={yupResolver(officeSchemaValidation)}
    >
        <div className="mb-2 ">
            <GbFormInput required={true} name="name" label="Department Name" />
        </div>
        <div className="mb-2 ">
            <GbFormSelect  options={data?.data?.map((item:any)=>{
            return {
                label:item?.name,
                value:item?.id
            }
            })}  name="office" label="Office" />
        </div>
        <button className="cm_button mt-[30px] px-[50px] ml-auto block">
            Save
        </button>
    </GbForm>
</div>
  );
};

export default EditDepartment;
