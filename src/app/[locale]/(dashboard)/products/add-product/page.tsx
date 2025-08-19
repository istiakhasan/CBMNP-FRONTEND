"use client"
import GbHeader from '@/components/ui/dashboard/GbHeader';
import GbSteps from '@/components/ui/GbSteps';
import React from 'react';

const Page = () => {  
  return (
    <div>
      <GbHeader />
      <div  className='p-[16px] h-[90vh]'>
        <GbSteps />
      </div>
    </div>
  );
};

export default Page;