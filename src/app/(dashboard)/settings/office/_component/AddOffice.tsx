import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useCreateOfficeMutation } from "@/redux/api/officeApi";
import {
    officeSchemaValidation
} from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

const AddOffice = ({
    setOpenModal,
}: {
    setOpenModal: (openModal: boolean) => void;
}) => {
    const [createOffice] = useCreateOfficeMutation();
    const submitForm = async (data:any) => {
        try {
            await createOffice(data).unwrap();
            setOpenModal(false);
            message.success("Office created successfully...");
        } catch (error) {
            message.error("Something went wrong");
        }
    };
    
    return (
        <div>
            <GbForm
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

export default AddOffice;
