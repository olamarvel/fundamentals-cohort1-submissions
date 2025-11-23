import React from "react";
import { NavLink } from "react-router-dom";
import { GoPulse } from "react-icons/go";
import { LiaServerSolid } from "react-icons/lia";
import { FaChartLine } from "react-icons/fa6";

const NavItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? "bg-white shadow" : "text-slate-600 hover:bg-white/50"}`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          <GoPulse />
        </div>
        <div>
          <div className="font-semibold">DeployHub</div>
          <div className="text-xs text-slate-400">Monitoring</div>
        </div>
      </div>

      <nav className="space-y-2">
        <NavItem to="/overview">
          {" "}
          <span className="text-lg">
            <GoPulse />
          </span>{" "}
          Overview{" "}
        </NavItem>
        <NavItem to="/services">
          {" "}
          <span className="text-lg"><LiaServerSolid/></span> Services{" "}
        </NavItem>
        <NavItem to="/metrics">
          {" "}
          <span className="text-lg"><FaChartLine /></span> Metrics{" "}
        </NavItem>
      </nav>
    </aside>
  );
}
