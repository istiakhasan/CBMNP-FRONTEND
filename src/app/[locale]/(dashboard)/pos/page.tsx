"use client"
import React from 'react';
import ProductShowcase from './_component/ProductShowcase';
import './_component/style.css'
const page = () => {
    return (
        <div className='h-[100vh] overflow-y-auto custom_scroll'>
            <ProductShowcase /> 
        </div>
    );
};

export default page;