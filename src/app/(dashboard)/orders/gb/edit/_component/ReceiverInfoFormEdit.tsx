import GbFormCheckbox from '@/components/forms/GbCheckbox';
import GbFormInput from '@/components/forms/GbFormInput';
import GbFormInputV2 from '@/components/forms/GbFormInputV2';
import GbFormRadioGroup from '@/components/forms/GbFormRadioGroup';
import GbFormSelect from '@/components/forms/GbFormSelect';
import GbFormSelectV2 from '@/components/forms/GbFormSelectV2';
import GbFormTextArea from '@/components/forms/GbFormTextArea';
import GbFormTextAreav2 from '@/components/forms/GbFormTextAreaV2';
import { useGetAllDivisionQuery, useGetDistrictByIdQuery, useGetThanaByIdQuery } from '@/redux/api/divisionsApi';
import axios from 'axios';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ReceiverInfoFormEdit = ({formData,setSameAsBilling,setFormData,setActive}:any) => {
    const [districtId, setDistrictId] = useState("");
    const [divisioinId, setDivisionId] = useState("");
    const { data: divisionData } = useGetAllDivisionQuery(undefined);
    const { data: districtData } = useGetDistrictByIdQuery({ id: divisioinId });
    const { data: thanaData } = useGetThanaByIdQuery({ id: districtId });
    const {watch,setValue,reset,formState:{isValid}}=useFormContext()
    return (
        <div className=''>
             {" "}
          <div className=" sticky top-0 bg-white pt-10 px-[20px] z-50 pb-3 font-semibold">
            <h1 className="text-2xl    text-primary mb-3  bg-light pb-3 font-semibold">
              Receiver Information
            </h1>
          </div>
          <div className="min-h-[80vh] px-[20px]">
            {watch()?.customerType === "NON_PROBASHI" && (
              <div>
                <div className="">
                  <div className="mb-4">
                    <GbFormInputV2 label='Full Name' disabled={watch()?.sameAsBilling} name="receiverName" />
                  </div>
                  <div className="mb-4">
                    <GbFormInputV2
                    disabled={watch()?.sameAsBilling}
                      name="receiverPhoneNumber"
                      label="Number"
                    />
                  </div>
                  <div className="mb-4">
                    <GbFormInputV2 
                      disabled={watch()?.sameAsBilling}
                      name="receiverAdditionalPhoneNumber"
                      label="Additional Number"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                      <GbFormSelectV2 
                      disabled={watch()?.sameAsBilling}
                        options={divisionData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(data: any) => {
                          setDivisionId(data?.value);
                        }}
                        name="shippingAddressDivision"
                        label="Division"
                      />
                    </div>
                    <div>
                      <GbFormSelectV2 
                      disabled={watch()?.sameAsBilling}
                        options={districtData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(data: any) => {
                          setDistrictId(data?.value);
                        }}
                        name="shippingAddressDistrict"
                        label="District"
                      />
                    </div>
                    <div>
                      <GbFormSelectV2
                        disabled={watch()?.sameAsBilling}
                        options={thanaData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        name="shippingAddressThana"
                        label="Thana"
                        handleChange={async (option: any) => {
                          // const response = await axios.get(
                          //   `https://ghorerbazartech.xyz/delivary-charge/${option?.value}`
                          // );
                          // setValue("newDeliveryCharge", response?.data?.prices);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <GbFormTextAreav2
                    rows={3}
                       disabled={watch()?.sameAsBilling}
                      name="shippingAddressTextArea"
                      placeholder="Address"
                    />
                  </div>
                </div>
              </div>
            )}

            {watch()?.customerType === "PROBASHI" && (
              <div className="">
                <h1 className="font-semibold text-[18px] mt-3">Receiver</h1>

                <div className="">
                  <div className="mb-4">
                    <GbFormInputV2 name="receiverName" label="Full Name" />
                  </div>
                  <div className="mb-4">
                    <GbFormInputV2
                      name="receiverPhoneNumber"
                      label="Number"
                    />
                  </div>
                  <div className="mb-4">
                    <GbFormInputV2
                      name="receiverAdditionalPhoneNumber"
                      label="Additional Number"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                      <GbFormSelectV2
                        options={divisionData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(data: any) => {
                          setDivisionId(data?.value);
                        }}
                        name="shippingAddressDivision"
                        label="Division"
                      />
                    </div>
                    <div>
                      <GbFormSelectV2
                        options={districtData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(data: any) => {
                          setDistrictId(data?.value);
                        }}
                        name="shippingAddressDistrict"
                        label="district"
                      />
                    </div>
                    <div>
                      <GbFormSelectV2
                        options={thanaData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        name="shippingAddressThana"
                        label="Thana"
                        handleChange={async (option: any) => {
                          // const response = await axios.get(
                          //   `https://ghorerbazartech.xyz/delivary-charge/${option?.value}`
                          // );
                          // setValue("newDeliveryCharge", response?.data?.prices);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <GbFormTextAreav2
                      name="shippingAddressTextArea"
                      label="Address"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-[#FFFFFF]  sticky bottom-0 border-t pt-5">

            <div className="flex justify-end items-end  h-full gap-2 mb-4">
              <button 
                type='button'
                onClick={() => setActive(1)}
                className="border-1 text-[#278ea5] border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[12px]"
              >
                Back
              </button>

              <button
                type='submit'
                className={` ${isValid?"bg-[#278ea5]":"bg-[#CACACA]"} text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[12px]`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
    );
};

export default ReceiverInfoFormEdit;