"use client";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { textEditorModule } from "./contentConstant";
import { Divider, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import GbModal from "@/components/ui/GbModal";
import UpdateHealthBenifits from "./UpdateHealthBenifits";
import { useUpdateProductMutation } from "@/redux/api/productApi";
interface HealthBenefit {
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
}

interface HealthBenefitsProps {
  data: any;
}

const HealthBenefits: React.FC<HealthBenefitsProps> = ({ data }) => {
  const [updateProductHandle] = useUpdateProductMutation();
  const [healthBenefits, setHealthBenefits] = useState<HealthBenefit[]>(
    data?.health_benefits
  );
  const [titleEn, setTitleEn] = useState<string>("");
  const [titleBn, setTitleBn] = useState<string>("");
  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const [descriptionBn, setDescriptionBn] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [rowDta, setRowDta] = useState<
    | {
        title_en: string;
        title_bn: string;
        description_en: string;
        description_bn: string;
      }
    | {}
  >({});
  const [rowIndex, setRowIndex] = useState<any>("");
  const handleChangeTitleEn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEn(e.target.value);
  };

  const handleChangeTitleBn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleBn(e.target.value);
  };

  const handleChangeDescriptionEn = (content: string) => {
    setDescriptionEn(content);
  };

  const handleChangeDescriptionBn = (content: string) => {
    setDescriptionBn(content);
  };

  const submitHandler = () => {
    const newBenefit: HealthBenefit = {
      title_en: titleEn,
      title_bn: titleBn,
      description_en: descriptionEn,
      description_bn: descriptionBn,
    };

    setHealthBenefits([...healthBenefits, newBenefit]);

    setTitleEn("");
    setTitleBn("");
    setDescriptionEn("");
    setDescriptionBn("");
  };

  return (
    <div className="grid grid-cols-2 gap-[40px]">
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "5px",
          padding: "15px",
          marginBottom: "10px",
        }}
        className="h-fit"
      >
        <InputField
          label="Title English"
          value={titleEn}
          onChange={handleChangeTitleEn}
        />
        <EditorField
          label="Description English"
          value={descriptionEn}
          onChange={handleChangeDescriptionEn}
        />
        <InputField
          label="Title Bangla"
          value={titleBn}
          onChange={handleChangeTitleBn}
        />
        <EditorField
          label="Description Bangla"
          value={descriptionBn}
          onChange={handleChangeDescriptionBn}
        />
        <button
          onClick={submitHandler}
          className="cm_button mt-[30px] px-[50px] ml-auto block"
        >
          Add
        </button>
      </div>
      <div>
        {healthBenefits?.map((item, index) => (
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
            }}
            key={index}
            className="health-benefit-item"
          >
            <div className="flex items-center justify-end gap-[10px]">
              <EditOutlined
                onClick={() => {
                  setOpenModal(true);
                  setRowDta(item);
                  setRowIndex(index);
                }}
                style={{ fontSize: "18px", cursor: "pointer" }}
              />
              <i
                onClick={() => {
                  const _data = [...healthBenefits];
                  _data.splice(index, 1);
                  setHealthBenefits(_data);
                  message.success("Benifits remove successfully...");
                }}
                className="ri-delete-bin-line text-[18px] cursor-pointer"
              ></i>
            </div>
            <h1 className="text-[14px] font-bold text-[#343434] mb-[12px]">
              Title English
            </h1>
            <p className="text-[14px] font-[500] text-[#7D7D7D] mb-[12px]">
              {item.title_en}
            </p>
            <h1 className="text-[14px] font-bold text-[#343434] mb-[12px]">
              Description English
            </h1>
            <div className="ql-editor">
              <div dangerouslySetInnerHTML={{ __html: item.description_en }} />
            </div>
            <Divider />
            <h1 className="text-[14px] font-bold text-[#343434] mb-[12px]">
              Title Bangla
            </h1>
            <p className="text-[14px] font-[500] text-[#7D7D7D] mb-[12px]">
              {item.title_bn}
            </p>
            <h1 className="text-[14px] font-bold text-[#343434] mb-[12px]">
              Description Bangla
            </h1>
            <div className="ql-editor">
              <div dangerouslySetInnerHTML={{ __html: item.description_bn }} />
            </div>
          </div>
        ))}
        {healthBenefits?.length > 0 && (
          <button
            onClick={async () => {
              const health_benefits = JSON.stringify(healthBenefits);
              const formData = new FormData();
              formData.append("discount_type", "%");
              formData.append("health_benefits", health_benefits);
              const res = await updateProductHandle({
                id: data?.id,
                data: formData,
              });
            }}
            className="cm_button mb-[30px] px-[50px] ml-auto block"
          >
            Save Health Benefits
          </button>
        )}
      </div>

      {/* update health benifits  */}
      <GbModal
        isModalOpen={openModal}
        openModal={() => setOpenModal(true)}
        closeModal={() => setOpenModal(false)}
        width="600px"
      >
        <UpdateHealthBenifits
          setOpenModal={setOpenModal}
          rowData={rowDta}
          setRowData={setRowDta}
          rowIndex={rowIndex}
          setHealthBenifits={setHealthBenefits}
          healthBenifits={healthBenefits}
        />
      </GbModal>
    </div>
  );
};

export default HealthBenefits;

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="mb-[16px]">
    <h1 className="text-[#343434] text-[20px] font-bold">{label}</h1>
    <Input
      onChange={onChange}
      value={value}
      style={{
        borderRadius: "4px",
        padding: "9px",
        background: "white",
        fontSize: "14px",
        fontWeight: "400",
      }}
    />
  </div>
);

const EditorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (content: string) => void;
}) => (
  <div className="mb-[16px]">
    <h1 className="text-[#343434] text-[20px] font-bold">{label}</h1>
    <ReactQuill
      placeholder="Write something.."
      value={value}
      onChange={onChange}
      modules={textEditorModule}
    />
  </div>
);
