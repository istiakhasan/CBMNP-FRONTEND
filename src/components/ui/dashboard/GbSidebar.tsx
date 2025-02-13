"use client"
import { Tooltip } from "antd";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

// Define the type for menu items
interface MenuItem {
  href: string;
  title: string;
  icon: string;
  children?:any
}

const menuItems: MenuItem[] = [
  {
    href: '/dashboard',
    title: 'Dashboard',
    icon: 'ri-bar-chart-box-line',
  },
  {
    href: '/orders',
    title: 'Orders',
    icon: 'ri-shopping-bag-3-line',
  },
  {
    href: '/inventory',
    title: 'Inventory',
    icon: 'ri-ancient-gate-line',
  },
  {
    href: '/product',
    title: 'Products',
    icon: 'ri-box-3-line',
  },
  {
    href: '/access',
    title: 'Access',
    icon: 'ri-git-repository-private-fill',
    children:[
             {
              href:"/access/users",
              title:"Users"
             },
             {
              href:"/access/group-permission",
              title:"Group Permission"
             }
    ]
  },
  {
    href: '/requisition',
    title: 'Requisitions', // Plural to indicate multiple requisitions
    icon: 'ri-store-2-line',
    children: [
      {
        href: "/requisition/manage",
        title: "Manage Requisitions" // More descriptive
      }
    ]
  },
  
  {
    href: '/warehouse',
    title: 'Warehouse',
    icon: 'ri-map-pin-fill'
  },
  {
    href: '/delivery-partner',
    title: 'Delivery Partner',
    icon: 'ri-truck-line'
  },
];
const GbSidebar = () => {
  const pathName=usePathname()
  const local=useLocale()
  const [isActive, setIsActive] = useState(false);
  const [subMenuActive,setSubMenuActive]=useState<any>(null)
  const [loading, setLoading] = useState(false);
  const router=useRouter()
  useEffect(()=>{
    setSubMenuActive(null)
    setLoading(false);
  },[pathName])
  const handleButtonClick = (path:any) => {
    if(pathName !==path){
      setLoading(true);
      router.push(`/${local}/${path}`);
    }
  };

  return (
    <>
     {loading && <Loader />} {/* Show Loader when loading */}
    <aside className={`gb_sidebar ${isActive ? "show" : "hide"}`}>
      <div className="toggle_btn">
        <i onClick={() => setIsActive(!isActive)} className="ri-menu-fill"></i>
      </div>
      <div className="menu_list_wraper">
        {menuItems?.map((item, index) => (
          <Fragment key={index}>
          {item?.children?<>
            <div key={index} className={`${(index===subMenuActive && isActive)&&"border"} duration-300 relative`}>
            <Tooltip placement="right" title={isActive ? '' : item.title}>
              <div onClick={()=>{
                if(index===subMenuActive){
                  setSubMenuActive(null)
                }else{
                  setSubMenuActive(index)
                }
              }} className={`cursor-pointer menu_list ${pathName?.split('/').includes(item?.href?.slice(1,item?.href?.length))   ? 'active' : ''}`}>
                <i className={item.icon}></i>{" "}
                <p className="ml-[10px]">{item.title}</p>
              </div>
            </Tooltip>
            
             {isActive && <div className={`sub_menu ${subMenuActive===index?'active':''}`}>
             {
              item?.children?.map((child:any,count:any)=>(
                <div key={count} onClick={()=>handleButtonClick(child?.href)}>
                <li  className={`${pathName===child?.href&&"sum_link_active"}`}>{child?.title}</li>
                </div>
              ))
            }
             </div>}
             {!isActive && <div className={`sub_menu_collaps ${subMenuActive===index?'active':''}`}>
             {
               item?.children?.map((child:any,count:any)=>(
                 <div onClick={()=>handleButtonClick(child?.href)} key={count}>
                <li  className={`${pathName===child?.href&&"sum_link_active"}`}>{child?.title}</li>
                </div>
              ))
            }
             </div>}
          </div>
          </>:<div onClick={()=>handleButtonClick(item?.href)} key={index} >
            <Tooltip placement="right" title={isActive ? '' : item.title}>
              <div className={`menu_list ${pathName?.split('/').includes(item?.href?.slice(1,item?.href?.length))   ? 'active' : ''}`}>
                <i className={item.icon}></i>{" "}
                <p className="ml-[10px]">{item.title}</p>
              </div>
            </Tooltip>
          </div>}
          </Fragment>
        ))}
      </div>
    </aside>
        </>
  );
};

export default GbSidebar;




export const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[1000001]">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #343434;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
