import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import React from "react";
import { useFormContext } from "react-hook-form";

const CubicMeters = () => {
  const { watch } = useFormContext();
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="mb-4">
          <GbFormInput name="weight" size="small" label="Weight" />
        </div>
        <div className="mb-4">
          <GbFormSelect
            options={[
              {
                label: "Grams",
                value: "Grams",
              },
              {
                label: "Kilograms",
                value: "Kilograms",
              },
              {
                label: "Pounds",
                value: "Pounds",
              },
              {
                label: "Ounces",
                value: "Ounces",
              },
              {
                label: "Tonnes",
                value: "Tonnes",
              },
            ]}
            name="weightUnit"
            size="small"
            label="Unit"
          />
        </div>
        <div className="mb-4">
          <GbFormInput 
            disabled={watch()?.volumeUnit?.value === "Cubic Meters"}
            value={
              watch()?.volumeUnit?.value === "Cubic Meters"
                ? (
                    (watch()?.volumeHeight || 0) *
                    (watch()?.volumeWidth || 0) *
                    (watch()?.volumeLength || 0)
                  ).toString()
                : ""
            }
            name="volume"
            size="small"
            label="Volume"
          />
        </div>
        <div className="mb-4">
          <GbFormSelect
            options={[
              {
                label: "Cubic Meters",
                value: "Cubic Meters",
              },
              {
                label: "Litres",
                value: "Litres",
              },
              {
                label: "Millilitres",
                value: "Millilitres",
              },
              {
                label: "Cubic Centimetres",
                value: "Cubic Centimetres",
              },
              {
                label: "Cubic Inches",
                value: "Cubic Inches",
              },
              {
                label: "Cubic Feet",
                value: "Cubic Feet",
              },
            ]}
            name="volumeUnit"
            size="small"
            label="Unit"
          />
        </div>
      </div>
      <div>
        {watch()?.volumeUnit?.value === "Cubic Meters" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <GbFormInput name="volumeHeight" size="small" label="Height" />
              </div>
              <div className="mb-4">
                <GbFormInput name="volumeWidth" size="small" label="Width" />
              </div>
            </div>
            <div className="mb-4">
              <GbFormInput name="volumeLength" size="small" label="Length" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CubicMeters;
