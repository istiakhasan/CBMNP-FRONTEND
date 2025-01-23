"use client";
import GbSidebar from "@/components/ui/dashboard/GbSidebar";
import { isLoggedIn } from "@/service/authService";
import { Row, Space, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const App: React.FC = ({ children }: any) => {
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const userLoggedIn=isLoggedIn()
    if(!userLoggedIn){
      router.push('/login')
    }else{
      setLoading(false)
    }

  },[router])

  if(loading){
   return (
    <Row
    justify="center"
    align="middle"
    style={{
      height: "100vh",
    }}
  >
    <Space>
      <Spin tip="Loading" size="small"></Spin>
    </Space>
  </Row>
   )
  }
  return (
    <div style={{ height: "100vh" }}>
      <GbSidebar />
      <div style={{ width: "calc(100% - 75px)", marginLeft: "auto" }}>
        {children}
      </div>
    </div>
  );
};

export default App;
