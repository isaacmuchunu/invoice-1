import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Settings,
  User,
} from "lucide-react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FFF1F1]">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#FF4545] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <h1 className="text-2xl font-bold text-[#FF4545]">HELIOS</h1>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
                      isActive
                        ? "bg-[#FFF1F1] text-[#FF4545]"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-white border-t py-4 px-8 text-center text-sm text-gray-600">
        <p>© 2024 HELIOS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
