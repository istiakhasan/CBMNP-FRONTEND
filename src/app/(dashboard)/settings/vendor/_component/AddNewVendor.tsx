import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useCreateMainCategoryMutation } from "@/redux/api/categoryApi";
import { mainCategorySchemaValidation } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

const AddNewVendor = ({setOpenModal}:{setOpenModal:(openModal:boolean)=>void}) => {
    const [createMainCategoryData]=useCreateMainCategoryMutation()
    const submitForm=async(data:any)=>{
try {
    const formData=new FormData()
    formData.append('image',data['image'] as Blob)
    formData.append('name_bn',data['name_bn'])
    formData.append('name_en',data['name_en'])
    const res=await createMainCategoryData(formData).unwrap()
    if(res){
        setOpenModal(false)
       message.success("Category create successfully...")
    }
} catch (error) {
    message.error("Something went wrong")
}
     

       
    }
    return (
        <div>
             <GbForm submitHandler={submitForm} resolver={yupResolver(mainCategorySchemaValidation)}>
               <div className="mb-2 ">
               <GbFormInput required={true} name="name_en" label="Category Name English" />
               </div>
               <div className="mb-2 ">
               <GbFormInput required={true} name="name_bn" label="Category Name Bangle" />
               </div>
               <div className="mb-5 ">
               <GbFormSelect 
               options={[
                {
                    label:"item 1",
                    value:"1"
                },
                {
                    label:"item 2",
                    value:"2"
                },
                {
                    label:"item 3",
                    value:"3"
                },
               ]}
               
               name="main_categories" label="Category Name Bangle" />
               </div>
             <div className="mt-3">
             <GbFileUpload  name="image" />
             </div>
               <button  className='cm_button mt-[30px] px-[50px] ml-auto block'>Save</button> 
             </GbForm>
        </div>
    );
};

export default AddNewVendor;