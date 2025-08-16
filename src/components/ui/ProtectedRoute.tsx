// components/ProtectedRoute.tsx
"use client";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { getUserInfo } from "@/service/authService";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const userInfo: any = getUserInfo();
  const local=useLocale()
  const { data: userData, isLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });

  useEffect(() => {
    if (!isLoading && userData) {
      const userRole = userInfo?.role;
      const permissions = userData?.permission?.map((p: any) => p.label) || [];

      const pathSegments = pathname.split("/").filter(Boolean);
      const currentSegment = pathSegments[1]; // For example: /en/orders => "orders"
      if (userRole !== "admin" && !permissions.includes(capitalize(currentSegment))) {
        router.replace(`/${local}/not-authorized`);
      }
    }
  }, [pathname, userData, isLoading]);

  const capitalize = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);

  if (isLoading) return null; // or loader

  return <>{children}</>;
};

export default ProtectedRoute;
