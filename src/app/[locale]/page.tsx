import { getUserInfo } from "@/service/authService";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
export default function Home() {
 const locale = useLocale();
  return redirect(`/${locale}/dashboard`)
  const userInfo:any=getUserInfo()
  if(userInfo?.role==="cos"){
  }
  if(userInfo?.role==="agent"){
    return redirect('/subscription/customer_list')
  }
}
