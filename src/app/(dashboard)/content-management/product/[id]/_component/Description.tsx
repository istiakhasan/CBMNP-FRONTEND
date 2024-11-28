
import { useUpdateProductMutation } from "@/redux/api/productApi";
import { message } from "antd";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" },
     { font: [] }
    ],
    [{ size: ["small", false, "large", "huge"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    // ["link", "image", "video"],
    ["clean"],
  ],
};

const Description = ({ data }: any) => {
  // Sanitize the initial content
  const [toggle, setToggle] = useState("1");
//   For bangla description 
  // const sanitizedInitialContent = DOMPurify.sanitize(
  //   data?.product_dec_bn || ""
  // );
 const [value,setValue]=useState('')
  const [descriptionBangla, setrdescriptionBangla] = useState(data?.product_dec_bn || "");

//   for english description
  // const sanitizedInitialContentEnglish = DOMPurify.sanitize(
  //   data?.product_dec_en || ""
  // );
  const [descriptionEnglish, setrdescriptionEnglish] = useState(data?.product_dec_en || "");
  const [updateProductHandle] = useUpdateProductMutation();
  const handleChangeBangla = (content: any) => {
    setrdescriptionBangla(content)
    // setValue(content)
};
  const handleChangeEnglish = (content: any) => {
    setrdescriptionEnglish(content)
};



  return (
    <>
      <select
        onChange={(e) => {
          setToggle(e.target.value);
        }}
      >
        <option value="1">Bangla</option>
        <option value="2">English</option>
      </select>
      {toggle === "1" && (
        <>
          <h1 className="text-[#343434]  text-[24px] font-[500] mb-[8px]">
            Descriptions Bangla
          </h1>
          <div className="w-6/12">
            <ReactQuill
              placeholder="Write something.."
              value={descriptionBangla}
              onChange={handleChangeBangla}
              modules={modules}
            />
            <button
              onClick={async () => {
                const formData = new FormData();
                formData.append("discount_type", "%");
                formData.append("product_dec_bn", descriptionBangla);
                const res = await updateProductHandle({
                  id: data?.id,
                  data: formData,
                });
                if (res) {
                  message.success("Description updated successfully...");
                }
              }}
              className="cm_button mt-[30px] px-[50px] ml-auto block"
            >
              Save
            </button>
          </div>
        </>
      )}
      {toggle === "2" && (
        <>
          <h1 className="text-[#343434]  text-[24px] font-[500] mb-[8px]">
            Descriptions English
          </h1>
          <div className="w-6/12">
            <ReactQuill
              placeholder="Write something.."
              value={descriptionEnglish}
              onChange={handleChangeEnglish}
              modules={modules}
            />
            <button
              onClick={async () => {
                const formData = new FormData();
                formData.append("discount_type", "%");
                formData.append("product_dec_en", descriptionEnglish);
                const res = await updateProductHandle({
                  id: data?.id,
                  data: formData,
                });
                if (res) {
                  message.success("Description updated successfully...");
                }
              }}
              className="cm_button mt-[30px] px-[50px] ml-auto block"
            >
              Save
            </button>
          </div>
        </>
      )}
      {/* <div className="ql-show">
        <div className="ql-editor">
        <h3>Sanitized Content</h3>
        <div dangerouslySetInnerHTML={{ __html:data?.product_dec_en}} />
      </div>
      </div> */}
    </>
  );
};

export default Description;
