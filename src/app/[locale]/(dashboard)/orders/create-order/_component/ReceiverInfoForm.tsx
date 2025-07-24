import GbFormCheckbox from '@/components/forms/GbCheckbox';
import GbFormInput from '@/components/forms/GbFormInput';
import GbFormSelect from '@/components/forms/GbFormSelect';

import GbFormTextArea from '@/components/forms/GbFormTextArea';
import { getBaseUrl } from '@/helpers/config/envConfig';

import { useGetAllDivisionQuery, useGetDistrictByIdQuery, useGetThanaByIdQuery } from '@/redux/api/divisionsApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ReceiverInfoForm = ({formData,setSameAsBilling,setFormData,setActive}:any) => {
    const {watch,setValue,reset,formState:{isValid}}=useFormContext()
    const [divisionData,setDivisionData]=useState([])
    const [districtData,setdistrictData]=useState([])
    const [thanaData,setThanaData]=useState([])
    useEffect(()=>{
      axios.get(`${getBaseUrl()}/divisions`)
      .then(res=>setDivisionData(res?.data))
      .catch(error=>console.log(error))
    },[])
    return (
        <div className=''>
             {" "}
          <div className=" sticky top-0 bg-white pt-10 px-[20px] z-50 pb-3 font-semibold">
            <h1 className="text-2xl    text-primary mb-3  bg-light pb-3 font-semibold">
              Receiver Information
            </h1>
          </div>
          <div className="min-h-[70vh] px-[20px]">
            {watch()?.customerType === "NON_PROBASHI" && (
              <div>
                <h1 className="flex items-center gap-2 text-[16px] mb-2">
                  <GbFormCheckbox name="sameAsBilling"  handleChange={(e:any)=>{
                       setSameAsBilling(e)
                       setValue('sameAsBilling',e)
                       setFormData({})
                       reset()
                  }} label="Same as billing" />
                </h1>
                <div className="">
                  <div className="mb-4">
                    <GbFormInput label='Full Name' disabled={watch()?.sameAsBilling} name="receiverName" />
                  </div>
                  <div className="mb-4">
                    <GbFormInput
                    disabled={watch()?.sameAsBilling}
                      name="receiverPhoneNumber"
                      label="Number"
                    />
                  </div>
                  <div className="mb-4">
                    <GbFormInput
                      disabled={watch()?.sameAsBilling}
                      name="receiverAdditionalPhoneNumber"
                      label="Additional Number"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                      <GbFormSelect
                      disabled={watch()?.sameAsBilling}
                        options={divisionData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(option: any) => {
                          axios.get(`${getBaseUrl()}/divisions/${option?.value}`)
                         .then(res=>setdistrictData(res?.data?.district_info))
                         .catch(error=>console.log(error))
                        }}
                        name="shippingAddressDivision"
                        label="Division"
                      />
                    </div>
                    <div>
                      <GbFormSelect
                      disabled={watch()?.sameAsBilling}
                        options={districtData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(option: any) => {
                          axios.get(`${getBaseUrl()}/districts/${option?.value}`)
                         .then(res=>setThanaData(res?.data?.thana_info))
                         .catch(error=>console.log(error))
                        }}
                        name="shippingAddressDistrict"
                        label="District"
                      />
                    </div>
                    <div>
                      <GbFormSelect
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
                          const response = await axios.get(
                            `${getBaseUrl()}/delivary-charge/${option?.value}`
                          );
                          setValue("newDeliveryCharge", response?.data?.prices);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <GbFormTextArea
                    rows={3}
                      //  disabled={watch()?.sameAsBilling}
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
                    <GbFormInput name="receiverName" label="Full Name" />
                  </div>
                  <div className="mb-4">
                    <GbFormInput
                      name="receiverPhoneNumber"
                      label="Number"
                    />
                  </div>
                  <div className="mb-4">
                    <GbFormInput
                      name="receiverAdditionalPhoneNumber"
                      label="Additional Number"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                      <GbFormSelect
                        options={divisionData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(option: any) => {
                          axios.get(`${getBaseUrl()}/divisions/${option?.value}`)
                         .then(res=>setdistrictData(res?.data?.district_info))
                         .catch(error=>console.log(error))
                        }}
                        name="shippingAddressDivision"
                        label="Division"
                      />
                    </div>
                    <div>
                      <GbFormSelect
                        options={districtData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        handleChange={(option: any) => {
                          axios.get(`${getBaseUrl()}/districts/${option?.value}`)
                         .then(res=>setThanaData(res?.data?.thana_info))
                         .catch(error=>console.log(error))
                        }}
                        name="shippingAddressDistrict"
                        label="district"
                      />
                    </div>
                    <div>
                      <GbFormSelect
                        options={thanaData?.map((db: any) => {
                          return {
                            label: db?.name_en,
                            value: db?.id,
                          };
                        })}
                        name="shippingAddressThana"
                        label="Thana"
                        handleChange={async (option: any) => {
                          const response = await axios.get(
                            `${getBaseUrl()}/delivary-charge/${option?.value}`
                          );
                          setValue("newDeliveryCharge", response?.data?.prices);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <GbFormTextArea
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
                className="border-1 color_primary border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[5px]"
              >
                Back
              </button>

              <button
                type='submit'
                className={` ${isValid?"bg-[#4F8A6D]":"bg-[#CACACA]"} text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[5px]`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
    );
};

export default ReceiverInfoForm;