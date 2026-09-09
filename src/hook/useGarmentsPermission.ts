"use client";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/service/authService";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";

export const useGarmentsPermission = () => {
  const [userInfo, setUserInfo] = useState<any>(() => {
    try {
      const u = getUserInfo();
      return u && typeof u === "object" ? u : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const u = getUserInfo();
      if (u && typeof u === "object") {
        setUserInfo(u);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const userId = userInfo?.userId || userInfo?.id;

  const { data: userData, isLoading } = useGetUserByIdQuery(
    { id: userId },
    { skip: !userId }
  );

  const role = String(userInfo?.role || userData?.role || "").toLowerCase();
  const isAdmin = ["admin", "super_admin", "owner"].includes(role);

  const permissions: string[] = (userData?.permission || []).map(
    (p: any) => p?.label || p?.permission?.label || ""
  );

  const has = (permissionLabel: string) => {
    if (isAdmin) return true;
    return permissions.includes(permissionLabel);
  };

  return {
    isLoading,
    isAdmin,
    role,
    permissions,
    has,
    // Granular Garments capabilities
    canViewOrders: isAdmin || has("VIEW_GARMENTS_ORDERS") || has("Garments"),
    canCreateOrders: isAdmin || has("CREATE_GARMENTS_ORDERS"),
    canEditOrders: isAdmin || has("EDIT_GARMENTS_ORDERS"),
    canDeleteOrders: isAdmin || has("DELETE_GARMENTS_ORDERS"),
    canApproveSamples: isAdmin || has("APPROVE_GARMENTS_SAMPLES"),
    canCreateBom: isAdmin || has("CREATE_GARMENTS_BOM"),
    canApproveBom: isAdmin || has("APPROVE_GARMENTS_BOM"),
    canCreatePo: isAdmin || has("CREATE_GARMENTS_PO"),
    canCheckPo: isAdmin || has("CHECK_GARMENTS_PO"),
    canApprovePo: isAdmin || has("APPROVE_GARMENTS_PO"),
    canReceiveMaterials: isAdmin || has("RECEIVE_GARMENTS_MATERIALS"),
    canCreateSampleInward: isAdmin || has("CREATE_SAMPLE_INWARD"),
    canApproveSampleInward: isAdmin || has("APPROVE_SAMPLE_INWARD"),
    canIssueMaterials: isAdmin || has("ISSUE_GARMENTS_FLOOR_MATERIALS"),
  };
};
