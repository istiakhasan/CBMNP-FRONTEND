"use client";
import React from "react";
import { getUserInfo } from "@/service/authService";
import Dashboard from "./_component/Dashboard";
import AgentDashboard from "./_component/AgentDashboard";
import EmployeeDashboard from "./_component/EmployeeDashboard";
import HrDashboardPage from "../hr/dashboard/page";

const OWNER_ADMIN_ROLES = ["owner", "admin","master_admin"];

const DashboardRouter = () => {
  const userInfo: any = getUserInfo();
  const role = userInfo?.role?.toLowerCase();

  if (OWNER_ADMIN_ROLES.includes(role)) {
    return <Dashboard />;
  }
  if (role === "hr") return <HrDashboardPage />;
  if (role === "employee") return <EmployeeDashboard />;
  return <AgentDashboard />;

};

export default DashboardRouter;
