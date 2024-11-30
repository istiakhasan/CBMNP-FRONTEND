import { Tooltip } from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
];
const GbSidebar = () => {
  const pathName=usePathname()
  const [isActive, setIsActive] = useState(false);
  const [subMenuActive,setSubMenuActive]=useState<any>(null)
  useEffect(()=>{
    setSubMenuActive(null)
  },[pathName])
  return (
    <aside className={`gb_sidebar ${isActive ? "show" : "hide"}`}>
      <div className="toggle_btn">
        <i onClick={() => setIsActive(!isActive)} className="ri-menu-fill"></i>
      </div>
      <ul className="menu_list_wraper">
        {menuItems.map((item, index) => (
          <>
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
            
             {isActive && <ul className={`sub_menu ${subMenuActive===index?'active':''}`}>
             {
              item?.children?.map((child:any,count:any)=>(
                <Link key={count} href={child?.href}>
                <li  className={`${pathName===child?.href&&"sum_link_active"}`}>{child?.title}</li>
                </Link>
              ))
             }
             </ul>}
             {!isActive && <ul className={`sub_menu_collaps ${subMenuActive===index?'active':''}`}>
             {
              item?.children?.map((child:any,count:any)=>(
                <Link key={count} href={child?.href}>
                <li  className={`${pathName===child?.href&&"sum_link_active"}`}>{child?.title}</li>
                </Link>
              ))
             }
             </ul>}
          </div>
          </>:<Link key={index} href={item.href}>
            <Tooltip placement="right" title={isActive ? '' : item.title}>
              <div className={`menu_list ${pathName?.split('/').includes(item?.href?.slice(1,item?.href?.length))   ? 'active' : ''}`}>
                <i className={item.icon}></i>{" "}
                <p className="ml-[10px]">{item.title}</p>
              </div>
            </Tooltip>
          </Link>}
          </>
        ))}
      </ul>
    </aside>
  );
};

export default GbSidebar;
