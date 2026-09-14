"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Row, Space, Spin } from "antd";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { getUserInfo } from "@/service/authService";
import { getRequiredPermission, MASTER_ADMIN_ROLE } from "@/lib/route-permissions";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const userInfo: any = getUserInfo();
  const local = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  const { data: userData, isLoading, isFetching } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });

  const permission: string[] = useMemo(
    () => userData?.permission?.map((item: any) => item?.label) || [],
    [userData]
  );

  const userRole = String(userInfo?.role || "").toLowerCase();
  const isMasterAdmin = userRole === MASTER_ADMIN_ROLE;

  const cleanPath = useMemo(() => {
    if (!pathName) return "/";
    const regex = new RegExp(`^/${local}(?=/|$)`);
    const stripped = pathName.replace(regex, "");
    return stripped === "" ? "/" : stripped;
  }, [pathName, local]);

  const requiredPermission = useMemo(
    () => getRequiredPermission(cleanPath),
    [cleanPath]
  );

  const isAuthorized =
    isMasterAdmin || !requiredPermission || permission.includes(requiredPermission);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!isAuthorized) {
      router.replace(`/${local}/unauthorized`);
    }
  }, [isAuthorized, isLoading, isFetching, local, router]);

  if (isLoading || isFetching || !isAuthorized) {
    return (
      <Row justify="center" align="middle" style={{ height: "70vh" }}>
        <Space>
          <Spin size="small" spinning={true}></Spin>
        </Space>
      </Row>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;