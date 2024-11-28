import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useUpdateMainCategoryMutation } from "@/redux/api/categoryApi";
import { message } from "antd";
const EditCategory = ({
  setOpenModal,
  rowData,
}: {
  setOpenModal: (openModal: boolean) => void;
  rowData: any;
}) => {
  const [updateMainCategory] = useUpdateMainCategoryMutation();
  const submitForm = async (data: any) => {
    try {
      const formData=new FormData()
      let _data: any = {};
      _data["name_bn"] = data["name_bn"];
      _data["name_en"] = data["name_en"];
      formData.append("name_bn",_data["name_bn"])
      formData.append("name_en",_data["name_en"])
      if(data['image'] instanceof File ){
          formData.append('image',data['image'])
          _data['image']=data['image']
      }

      const res = await updateMainCategory({
        data: formData,
        id: rowData?.id,
      }).unwrap();
      if (res) {
        setOpenModal(false);
        message.success("Category updated successfully...");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  return (
    <div>
      <GbForm submitHandler={submitForm} defaultValues={rowData}>
        <div className="mb-2 ">
          <GbFormInput
            required={true}
            name="name_en"
            label="Category Name English"
          />
        </div>
        <div className="mb-2 ">
          <GbFormInput
            required={true}
            name="name_bn"
            label="Category Name Bangle"
          />
        </div>
        <GbFileUpload name="image" />
        <button className="cm_button mt-[30px] px-[50px] ml-auto block">
          Save
        </button>
      </GbForm>
    </div>
  );
};

export default EditCategory;
