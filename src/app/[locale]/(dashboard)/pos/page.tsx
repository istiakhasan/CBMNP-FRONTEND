"use client"
import React from 'react';
import ProductShowcase from './_component/ProductShowcase';
import './_component/style.css'
import PosPrint from './_component/PosPrint';
const page = () => {
    return (
        <div>
            <ProductShowcase /> 
            {/* <PosPrint /> */}
        </div>
    );
};

export default page;