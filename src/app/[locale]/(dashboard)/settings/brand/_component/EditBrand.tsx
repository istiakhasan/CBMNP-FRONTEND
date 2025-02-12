import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useUpdateBrandMutation } from "@/redux/api/brandApi";
import { message } from "antd";
const EditBrand = ({
  setOpenModal,
  rowData,
}: {
  setOpenModal: (openModal: boolean) => void;
  rowData: any;
}) => {
  const [updateBrand] = useUpdateBrandMutation();
  const submitForm = async (data: any) => {
    try {

      const res = await updateBrand({
        data: data,
        id: rowData?.id,
      }).unwrap();
      if (res) {
        setOpenModal(false);
        message.success("Brand updated successfully...");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  return (
    <div>
    <GbForm
        submitHandler={submitForm}
        defaultValues={rowData}
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
            Update
        </button>
    </GbForm>
</div>
  );
};

export default EditBrand;
