"use client"
import GbHeader from '@/components/ui/dashboard/GbHeader';
import GbSteps from '@/components/ui/GbSteps';
import React from 'react';

const Page = () => {  
  return (
    <div>
      <GbHeader />
      <div className='p-[16px]'>
        <GbSteps />
      </div>
    </div>
  );
};

export default Page;