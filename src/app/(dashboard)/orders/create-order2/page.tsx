import React from 'react';
import OrderCreate from './_component/OrderCreate';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Create Order",
  };
const page = () => {
    return (
        <div>
            <OrderCreate />
        </div>
    );
};

export default page;