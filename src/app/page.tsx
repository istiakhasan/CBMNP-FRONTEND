import { getUserInfo } from "@/service/authService";
import { redirect } from "next/navigation";
export default function Home() {
  return redirect('/dashboard')
  const userInfo:any=getUserInfo()
  if(userInfo?.role==="cos"){
  }
  if(userInfo?.role==="agent"){
    return redirect('/subscription/customer_list')
  }
  
  // else{

  //   return redirect('/employee/profile')
  // } 
}
