import React from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import InvoiceChart from "@/components/dashboard/InvoiceChart";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-[#FF4545]">Dashboard</h1>
      <DashboardStats />
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <InvoiceChart />
      </div>
    </div>
  );
};

export default Dashboard;
