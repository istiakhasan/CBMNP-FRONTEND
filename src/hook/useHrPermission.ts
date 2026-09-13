"use client";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/service/authService";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";

export const useHrPermission = () => {
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
    // HR menu access
    canAccessHr: isAdmin || has("HR"),
    // Employee management
    canViewEmployees: isAdmin || has("VIEW_HR_EMPLOYEES") || has("HR"),
    canCreateEmployees: isAdmin || has("CREATE_HR_EMPLOYEES"),
    canEditEmployees: isAdmin || has("EDIT_HR_EMPLOYEES"),
    canDeleteEmployees: isAdmin || has("DELETE_HR_EMPLOYEES"),
    // Attendance
    canViewAttendance: isAdmin || has("VIEW_HR_ATTENDANCE") || has("HR"),
    canManageAttendance: isAdmin || has("MANAGE_HR_ATTENDANCE"),
    // Leaves
    canViewLeaves: isAdmin || has("VIEW_HR_LEAVES") || has("HR"),
    canApproveLeaves: isAdmin || has("APPROVE_HR_LEAVES"),
    // Payroll
    canViewPayroll: isAdmin || has("VIEW_HR_PAYROLL") || has("HR"),
    canManagePayroll: isAdmin || has("MANAGE_HR_PAYROLL"),
    // Recruitment
    canViewRecruitment: isAdmin || has("VIEW_HR_RECRUITMENT") || has("HR"),
    canManageRecruitment: isAdmin || has("MANAGE_HR_RECRUITMENT"),
    // Performance
    canViewPerformance: isAdmin || has("VIEW_HR_PERFORMANCE") || has("HR"),
    canManagePerformance: isAdmin || has("MANAGE_HR_PERFORMANCE"),
    // Training
    canViewTraining: isAdmin || has("VIEW_HR_TRAINING") || has("HR"),
    canManageTraining: isAdmin || has("MANAGE_HR_TRAINING"),
    // Overtime
    canManageOvertime: isAdmin || has("MANAGE_HR_OVERTIME"),
    // Transfers
    canManageTransfers: isAdmin || has("MANAGE_HR_TRANSFERS"),
    // Disciplinary
    canManageDisciplinary: isAdmin || has("MANAGE_HR_DISCIPLINARY"),
    // Reports
    canViewReports: isAdmin || has("VIEW_HR_REPORTS") || has("HR"),
  };
};
