"use client";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { toggleSidebar } from "@/redux/feature/menuSlice";
import { RootState } from "@/redux/store";
import { getUserInfo } from "@/service/authService";
import { Tooltip } from "antd";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
interface MenuItem {
  href: string;
  title: string;
  icon: string;
  children?: any;
}

const GbSidebar = () => {
  const userInfo: any = getUserInfo();
  const rstate=useSelector((state:RootState)=>state.menu)
  const dispatch=useDispatch()
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  const menuItems: any[] = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: "ri-bar-chart-box-line",
    },
    {
      href: "/orders",
      title: "Orders",
      icon: "ri-shopping-bag-3-line",
    },
    {
      href: "/inventory",
      title: "Inventory",
      icon: "ri-ancient-gate-line",
    },
    {
      href: "/products",
      title: "Products",
      icon: "ri-box-3-line",
    },
    {
      href: "/access",
      title: "Access",
      icon: "ri-git-repository-private-line",
      children: [
        {
          href: "/access/users",
          title: "Users",
        },
        //  {
        //   href:"/access/group-permission",
        //   title:"Group Permission"
        //  }
      ],
    },
    {
      href: "/requisition",
      title: "Requisitions",
      icon: "ri-store-2-line",
      children: [
        {
          href: "/requisition/manage",
          title: "Manage Requisitions",
        },
      ],
    },

    {
      href: "/warehouse",
      title: "Warehouse",
      icon: "ri-map-pin-line ",
    },
    {
      href: "/delivery-partner",
      title: "Delivery Partner",
      icon: "ri-truck-line",
    },
    {
      href: "/procurement",
      title: "Procurement",
      icon: "ri-luggage-cart-line",
      children: [
        {
          href: "/procurement/purchase-order",
          title: "PO",
        },
        {
          href: "/procurement/purchase-approved",
          title: "Purchase Approved",
        },
        {
          href: "/procurement/purchase-receive",
          title: "Purchase Receive",
        },
        {
          href: "/procurement/purchase-cancel",
          title: "Purchase Canceled",
        },
        {
          href: "/procurement/purchase-completed",
          title: "Purchase Completed",
        },
        {
          href: "/procurement/purchase-report",
          title: "Purchase Report",
        },
        {
          href: "/procurement/supplier",
          title: "Supplier",
        },
      ],
    },
    {
      href: "/customers",
      title: "Customers",
      icon: "ri-group-line",
    },
    {
      href: "/configuration",
      title: "Configuration",
      icon: "ri-settings-2-line",
      children: [
        {
          href: "/configuration/category",
          title: "Category",
        },
      ],
    },
    {
      href: "/pos",
      title: "Pos",
      icon: "ri-computer-line",
    },
    {
      href: "/reports",
      title: "Reports",
      icon: "ri-folder-chart-line",
      children: [
        {
          href: "/reports/sales-reports",
          title: "Sales Reports",
        },
        {
          href: "/reports/agent-reports",
          title: "Agent Reports",
        },
      ],
    },
  ].filter(
    (mi: any) => permission?.includes(mi.title) || userInfo?.role === "admin"
  );

  const pathName = usePathname();
  const local = useLocale();
  const [isActive, setIsActive] = useState(true);
  const [subMenuActive, setSubMenuActive] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setSubMenuActive(null);
    setLoading(false);
  }, [pathName]);
  const handleButtonClick = (path: any) => {
    if (pathName !== "/" + local + path) {
      setLoading(true);
      router.push(`/${local}/${path}`);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(toggleSidebar({show:false}))
        setIsActive(false);
      } else {
        dispatch(toggleSidebar({show:true}))
        setIsActive(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(rstate?.toggle);
  return (
    <>
      {loading && <Loader />}
       {rstate?.toggle &&   <aside
        className={`gb_sidebar h-[100vh]    ${
          isActive ? "show overflow-y-scroll" : "hide "
        }`}
      >
         <div className="toggle_btn">
          <i
            onClick={() => setIsActive(!isActive)}
            className="ri-menu-fill hidden md:block"
          ></i>
          <i
            onClick={() => dispatch(toggleSidebar({show:false}))}
            className="ri-close-large-fill md:hidden"
          ></i>
        </div>

        <div className="menu_list_wraper">
          {menuItems?.map((item, index) => {
            return (
              <Fragment key={index}>
                {item?.children ? (
                  <>
                    <div
                      key={index}
                      className={`${
                        ((index === subMenuActive && isActive) ||
                          pathName
                            ?.split("/")
                            .includes(
                              item?.href?.slice(1, item?.href?.length)
                            )) &&
                        "border"
                      } duration-300 relative`}
                    >
                      <Tooltip
                        placement="right"
                        title={isActive ? "" : item.title}
                      >
                        <div
                          onClick={() => {
                            console.log("click");
                            if (index === subMenuActive) {
                              console.log("1");

                              setSubMenuActive(null);
                            } else {
                              console.log("2");

                              setSubMenuActive(index);
                            }
                          }}
                          className={`cursor-pointer menu_list ${
                            pathName
                              ?.split("/")
                              .includes(
                                item?.href?.slice(1, item?.href?.length)
                              )
                              ? "active"
                              : ""
                          }`}
                        >
                          <i className={item.icon}></i>{" "}
                          <p className="ml-[10px]">{item.title}</p>
                        </div>
                      </Tooltip>

                      {isActive && (
                        <div
                          className={`sub_menu ${
                            subMenuActive === index ||
                            pathName
                              ?.split("/")
                              .includes(item?.href?.split("/")[1])
                              ? "active"
                              : ""
                          }`}
                        >
                          {item?.children?.map((child: any, count: any) => {
                            return (
                              // work here
                              <div
                                className={`${
                                  pathName
                                    ?.split("/")
                                    .includes(child?.href?.split("/")[2])
                                    ? "font-bold"
                                    : ""
                                }`}
                                key={count}
                                onClick={() => handleButtonClick(child?.href)}
                              >
                                <li
                                  className={`${
                                    pathName === child?.href &&
                                    "sum_link_active"
                                  }`}
                                >
                                  {child?.title}
                                </li>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!isActive && (
                        <div
                          className={`sub_menu_collaps ${
                            subMenuActive === index ? "active" : ""
                          }`}
                        >
                          {item?.children?.map((child: any, count: any) => (
                            <div
                              className={`${
                                pathName
                                  ?.split("/")
                                  .includes(child?.href?.split("/")[2])
                                  ? "font-bold"
                                  : ""
                              } whitespace-nowrap`}
                              onClick={() => handleButtonClick(child?.href)}
                              key={count}
                            >
                              <li
                                className={`${
                                  pathName === child?.href && "sum_link_active"
                                }`}
                              >
                                {child?.title}
                              </li>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => handleButtonClick(item?.href)}
                    key={index}
                  >
                    <Tooltip
                      placement="right"
                      title={isActive ? "" : item.title}
                    >
                      <div
                        className={`menu_list ${
                          pathName
                            ?.split("/")
                            .includes(item?.href?.slice(1, item?.href?.length))
                            ? "active"
                            : ""
                        }`}
                      >
                        <i className={item.icon}></i>{" "}
                        <p className="ml-[10px]">{item.title}</p>
                      </div>
                    </Tooltip>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </aside>}
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
