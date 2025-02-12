import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useCreateDepartmentMutation } from "@/redux/api/departmentApi";
import { useCreateOfficeMutation, useGetAllOfficeQuery } from "@/redux/api/officeApi";
import {
    officeSchemaValidation
} from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

const AddDepartment = ({
    setOpenModal,
}: {
    setOpenModal: (openModal: boolean) => void;
}) => {
    const [createHandler] = useCreateDepartmentMutation();
    const {data,isLoading}=useGetAllOfficeQuery(undefined)
    const submitForm = async (data:any) => {
        try {
            const payload:any={}
            payload['name']=data?.name
            payload['officeId']=data?.office?.value
            await createHandler(payload).unwrap();
            setOpenModal(false);
            message.success("Department created successfully...");
        } catch (error) {
            message.error("Something went wrong");
        }
    };
    if(isLoading){
        return 
    }
    
    return (
        <div>
            <GbForm
                submitHandler={submitForm}
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

export default AddDepartment;
