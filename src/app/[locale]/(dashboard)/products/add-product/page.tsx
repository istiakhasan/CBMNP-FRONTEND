// "use client"
// import GbHeader from '@/components/ui/dashboard/GbHeader';
// import GbSteps from '@/components/ui/GbSteps';
// import React from 'react';

// const Page = () => {
//   return (
//     <div>
//       <GbHeader />
//       <div  className='p-[16px] h-[90vh]'>
//         <GbSteps />
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";

import { useState } from "react";
import { Tabs, Card } from "antd";
import { AppstoreAddOutlined, ApartmentOutlined } from "@ant-design/icons";

// import VTwoAddVariantProduct from "./VTwoAddVariantProduct";
import VTwoAddSimpleProuct from "../_component/VTwoSimpleProduct";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbSteps from "@/components/ui/GbSteps";

const AddProductPage = () => {
  const [activeTab, setActiveTab] = useState("simple");

  const items = [
    {
      key: "simple",
      label: (
        <span className="flex items-center gap-1">
          <AppstoreAddOutlined className="text-blue-500" />
          Simple Product
        </span>
      ),
      children: <VTwoAddSimpleProuct />,
    },
    {
      key: "variant",
      label: (
        <span className="flex items-center gap-1">
          <ApartmentOutlined className="text-green-500" />
          Variant Product
        </span>
      ),
      children: (
        <div className="overflow-scroll h-[560px]">
          <GbSteps />
        </div>
      ),
    },
  ];

  return (
    <div>
      <GbHeader title="Add Product" />
      <div className="p-[16px] h-[85vh] overflow-hidden">
        <Tabs 
          defaultActiveKey="simple"
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={items}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default AddProductPage;
