import GbFormInput from '@/components/forms/GbFormInput';
import GbFormSelect from '@/components/forms/GbFormSelect';
import { useGetAllDivisionQuery, useGetDistrictByIdQuery, useGetThanaByIdQuery } from '@/redux/api/divisionsApi';
import { Col } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';


const NonProbashiForm = () => {
    const [divisioinId, setDivisionId] = useState("");
    const [districtId,setDistrictId]=useState('')
    const {data:divisionData}=useGetAllDivisionQuery(undefined)
    const { data: districtData } = useGetDistrictByIdQuery({ id: divisioinId });
    const { data: thanaData } = useGetThanaByIdQuery({id:districtId});
    const {setValue}=useForm()
    return (
        <>
            <Col md={12} className='mb-[12px]'>
                <GbFormInput name='customerPhoneNumber' placeholder='Number' />
            </Col>
            <Col md={12} className='mb-[12px]'>
                <GbFormInput name='customerAdditionalPhoneNumber' placeholder='Additional number' />
            </Col>
            <Col md={24} className='mb-[12px]'>
                <GbFormInput name='customerName' placeholder='Name' />
            </Col>
            <Col md={24} className='mb-[12px]'>
                <GbFormInput name='billingAddressTextArea' placeholder='Address' />
            </Col>

            <Col md={8} className='mb-[12px]'>
                <GbFormSelect
                      options={divisionData?.map((db: any) => {
                        return {
                          label: db?.name_en,
                          value: db?.id,
                        };
                      })}
                      handleChange={(data: any) => {
                        setDivisionId(data?.value);
                      }}
                    name='billingAddressDivision' placeholder='Division' />
            </Col>
            <Col md={8} className='mb-[12px]'>
                <GbFormSelect
                    options={districtData?.map((db: any) => {
                        return {
                          label: db?.name_en,
                          value: db?.id,
                        };
                      })}
                      handleChange={(data:any)=>{
                        setDistrictId(data?.value)
                      }}
                    name='billingAddressDistrict' placeholder='District' />
            </Col>
            <Col md={8} className='mb-[12px]'>
                <GbFormSelect
                     options={thanaData?.map((db: any) => {
                        return {
                          label: db?.name_en,
                          value: db?.id,
                        };
                      })}
                      handleChange={ async(option:any)=>{
                        const response=  await  axios.get(`https://ghorerbazartech.xyz/delivary-charge/${option?.value}`)
                        setValue('newDeliveryCharge',response?.data?.prices)
                        }}
                    name='billingAddressThana' placeholder='Thana' />
            </Col>
        </>
    );
};

export default NonProbashiForm;