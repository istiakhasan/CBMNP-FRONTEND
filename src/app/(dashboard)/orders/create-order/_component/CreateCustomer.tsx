import GbForm from '@/components/forms/GbForm';
import GbDrawer from '@/components/ui/GbDrawer';
import { useCreateCustomerMutation, useGetAllCustomersQuery } from '@/redux/api/customerApi';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import CreateCustomerDrawar from './CreateCustomerDrawar';
import { Input, message } from 'antd';
import { createCustomerSchema } from '@/schema/schema';

const CreateCustomer = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const containerRef: any = useRef(null);
    const { data: customerData, isLoading } = useGetAllCustomersQuery(
        {
          searchTerm,
          limit: 20,
        },
        {
          refetchOnMountOrArgChange: true,
          refetchOnReconnect: true,
          refetchOnFocus: true,
        }
      );
      const [handleCreateCustomer]=useCreateCustomerMutation()
      const handleClickOutside = (event: any) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsFocus(false);
        }
      };
      useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);


      const formSubmit = async (data: any,reset:any) => {
        try {
          const payload={...data}
          payload["customerType"]=data?.customerType?.value
          payload["district"]=data?.district?.label
          payload["division"]=data?.division?.label
          payload["thana"]=data?.thana?.label
          if(!!data?.country){
              payload['country']=data?.country?.value
          }
          const res=await handleCreateCustomer(payload).unwrap()
          if(res?.success===true){
            message.success('Customer create successfully')
            setDrawerOpen(false)
            reset()
          }
    
        } catch (error:any) {
            if(error?.data?.errorMessages?.length>0){
                error?.data?.errorMessages?.forEach((item:any)=>{
                    message.error(item?.message)
                })
            }
            console.log(error,"error");
            message.error('Something went wrong')
            reset()
        }
      };
    return (
        <div>
        <div>
          <div ref={containerRef} className="relative">
            <div className="floating-label-input">
              <label
                htmlFor="customerSearch"
                className="text-[#999] text-[12px]"
              >
                Search customer
              </label>
              <Input
                id="customerSearch"
                autoComplete="off"
                size="large"
                style={{
                  boxShadow: "none",
                  border: "none",
                }}
                onChange={(e)=>setSearchTerm(e.target.value)}
                onFocus={() => setIsFocus(true)}
              />
            </div>
            {isFocus && (
              <div className="h-[300px] overflow-y-scroll border w-full absolute bg-white">
                {
                  customerData?.data<1?<> <div className=" h-full flex items-center justify-center">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="bg-[#47a2b3] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
                  >
                    Add customer
                  </button>
                </div></>:<> {
                  customerData?.data?.map((item: any) => (
                    <div
                     
                      key={item?.id}
                      className="flex justify-between items-center border-b px-[20px] py-[10px] hover:bg-gray-100 cursor-pointer"
                    >
                      <div>
                        <h1 className="bg-gray-500 px-[10px] py-[5px] text-white text-[10px] w-fit">
                          {item?.customerType}
                        </h1>
                        <h1 className="text-[12px] text-gray-500">
                          {item?.customerName}
                        </h1>
                        <h1 className="text-[12px] text-gray-500">
                          {item?.customerPhoneNumber}
                        </h1>
                      </div>
                    </div>
                  ))
                }</>
                }
               
              </div>
            )}
          </div>
        </div>
        {/* create customer drawer  */}
        <GbDrawer
          open={drawerOpen}
          setOpen={setDrawerOpen}
          title={"Add customer"}
        >
          <GbForm
            resolver={yupResolver(createCustomerSchema)}
            submitHandler={formSubmit}
          >
            <CreateCustomerDrawar />
          </GbForm>
        </GbDrawer>
      </div>
    );
};

export default CreateCustomer;