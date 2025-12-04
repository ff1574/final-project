import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Sparkles } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const tabs = [
    { name: "Dashboard", path: "/", icon: Activity },
    { name: "Visualizations", path: "/visualizations", icon: Sparkles },
  ];

  return (
    <nav className="h-16 bg-slate-900/50 border-b border-slate-800/60 backdrop-blur-md px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Distillation Control</h1>
          <p className="text-[10px] text-slate-500 font-mono">v2.4.1</p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link key={tab.path} to={tab.path} className="relative">
              <motion.button
                className={`relative z-10 px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                {tab.name}
              </motion.button>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 rounded-lg border border-cyan-500/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-slate-400">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400">ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
