import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme } from "antd";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbRegularselect from "@/components/forms/GbRegularselect";
import GbBDTInput from "@/components/forms/GbBTDInput";

const VariantsCollaps = ({ remove, fields, attributes }: any) => {
  const { token } = theme.useToken();
  const { Panel } = Collapse;

  return (
    <>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            style={{ color: "#288ea5" }}
            rotate={isActive ? 90 : 0}
          />
        )}
        style={{ background: token.colorBgContainer }}
      >
        {fields.map((item: any, i: any) => (
          <Panel
            header={
              <div className="flex items-start gap-3">
                Variant {i + 1}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3"
                >
                  {attributes?.map((jt: any, j: any) => (
                    <div key={j}>
                      <GbRegularselect
                        size="small"
                        label={jt?.label}
                        name={`variants[${i}].attributes[${j}]`}
                        options={jt?.attributesvalue}
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-auto">
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                    className="ri-delete-bin-line"
                  ></i>
                </div>
              </div>
            }
            key={item.id}
          >
            <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-2">
              Variant Images
            </p>
            <GbFileUpload name={`variants[${i}].product_image`} />
            <p className="text-[#999] text-[12px]">
              Please upload maximum 6 images. (.jpeg, .jpg or .png. Max size
              3MB/file.)
            </p>

            <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-2 mt-4">
              Variant Details
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="mb-2">
                <GbFormInput
                  name={`variants[${i}].name`}
                  size="small"
                  label="Product Name"
                />
              </div>
              <div className="mb-2">
                <GbFormInput
                  name={`variants[${i}].description`}
                  size="small"
                  label="Product Description"
                />
              </div>
            </div>
            <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-2 mt-2">
              Product Specifications
            </p>

            <div className="grid grid-cols-1 gap-2">
              <div className="mb-2">
                <GbFormInput
                  name={`variants[${i}].weight`}
                  size="small"
                  label="Weight"
                />
              </div>
              <div className="mb-2">
                <GbFormSelect
                  options={[
                    { label: "Grams", value: "Grams" },
                    { label: "Kilograms", value: "Kilograms" },
                    { label: "Pounds", value: "Pounds" },
                    { label: "Ounces", value: "Ounces" },
                    { label: "Tonnes", value: "Tonnes" },
                  ]}
                  name={`variants[${i}].unit`}
                  size="small"
                  label="Unit"
                />
              </div>
              <div className="mb-2">
                <GbFormInput
                  name={`variants[${i}].volume`}
                  size="small"
                  label="Volume"
                />
              </div>
              <div className="mb-2">
                <GbFormSelect
                  options={[
                    { label: "Cubic Meters", value: "Cubic Meters" },
                    { label: "Litres", value: "Litres" },
                    { label: "Millilitres", value: "Millilitres" },
                    { label: "Cubic Centimetres", value: "Cubic Centimetres" },
                    { label: "Cubic Inches", value: "Cubic Inches" },
                    { label: "Cubic Feet", value: "Cubic Feet" },
                  ]}
                  name={`variants[${i}].volumeUnit`}
                  size="small"
                  label="Unit"
                />
              </div>
            </div>

            <p className="text-[rgba(0,0,0,.85)] text-[15px]    mt-2">Prices</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].regularPrice`}
                  size="small"
                  label="Regular"
                />
              </div>
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].salePrice`}
                  size="small"
                  label="Sale"
                />
              </div>
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].retailPrice`}
                  size="small"
                  label="Retail Price"
                />
              </div>
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].distributionPrice`}
                  size="small"
                  label="Distributor Price"
                />
              </div>
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].purchasePrice`}
                  size="small"
                  label="Purchase Price"
                />
              </div>
            </div>

            <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-2 mt-2">
              Additional Information
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].variantSku`}
                  size="small"
                  label="SKU"
                />
              </div>
              <div className="mb-2">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name={`variants[${i}].internalId`}
                  size="small"
                  label="Internal ID"
                />
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default VariantsCollaps;
