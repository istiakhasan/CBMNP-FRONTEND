"use client"
import { getUserInfo } from '@/service/authService';
import React from 'react';
import HrmProfile from './HrmProfile';
import AgentProfile from './AgentProfile';

const Profile = () => {
    const userInfo:any=getUserInfo()
    if(userInfo?.role==="hr"){
     return <HrmProfile />
    }
    if(userInfo?.role==="agent" || userInfo?.role==="admin" || userInfo?.role==="ctgadmin"){
        return <AgentProfile />
    }
};

export default Profile;