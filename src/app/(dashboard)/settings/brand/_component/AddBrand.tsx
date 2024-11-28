import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useCreateBrandMutation } from "@/redux/api/brandApi";
import {
    brandSchemaValidation
} from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

const AddBrand = ({
    setOpenModal,
}: {
    setOpenModal: (openModal: boolean) => void;
}) => {
    const [createMainCategoryData] = useCreateBrandMutation();
    const submitForm = async (data:any) => {
        try {
            await createMainCategoryData(data).unwrap();
            setOpenModal(false);
            message.success("Brand created successfully...");
        } catch (error) {
            message.error("Something went wrong");
        }
    };
    
    return (
        <div>
            <GbForm
                submitHandler={submitForm}
                resolver={yupResolver(brandSchemaValidation)}
            >
                <div className="mb-2 ">
                    <GbFormInput required={true} name="name" label="Brand Name" />
                </div>
                <div className="mb-2 ">
                    <GbFormTextArea
                        rows={5}
                        required={true}
                        name="description"
                        label="Description"
                    />
                </div>
                <button className="cm_button mt-[30px] px-[50px] ml-auto block">
                    Save
                </button>
            </GbForm>
        </div>
    );
};

export default AddBrand;
