"use client";
import React from "react";
import { getUserInfo } from "@/service/authService";
import Dashboard from "./_component/Dashboard";
import AgentDashboard from "./_component/AgentDashboard";

const OWNER_ADMIN_ROLES = ["owner", "admin"];

const DashboardRouter = () => {
  const userInfo: any = getUserInfo();
  const role = userInfo?.role?.toLowerCase();

  if (OWNER_ADMIN_ROLES.includes(role)) {
    return <Dashboard />;
  }
  return <AgentDashboard />;

};

export default DashboardRouter;