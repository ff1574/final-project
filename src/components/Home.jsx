import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSystem } from "../context/SystemContext";
import ManualOverride from "./ManualOverride";

const GlassCard = ({ children, className = "", title }) => (
  <div
    className={`bg-slate-900/40 border border-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col shadow-lg ${className}`}
  >
    {title && (
      <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/30 flex justify-center">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase text-center">
          {title}
        </h3>
      </div>
    )}
    <div className="flex-1 relative min-h-0 p-4">{children}</div>
  </div>
);

const LiquidTank = ({ level, color = "cyan", label }) => (
  <div className="relative w-full flex-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden group">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    <motion.div
      className="absolute bottom-0 w-full"
      animate={{ height: `${level}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className={`w-full h-full opacity-80 ${color === "cyan" ? "bg-cyan-500" : "bg-amber-600"}`}
      />
      <div className="absolute top-0 w-full h-1 bg-white/30" />
    </motion.div>
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <span className="text-lg font-bold text-white drop-shadow-md">
        {Math.round(level)}%
      </span>
    </div>
    <div className="absolute bottom-2 w-full text-center z-10">
      <span className="text-[9px] font-bold uppercase text-white/50 tracking-widest">
        {label}
      </span>
    </div>
  </div>
);

export default function Home() {
  const {
    isRunning,
    setIsRunning,
    heaterPower,
    setHeaterPower,
    refluxRatio,
    setRefluxRatio,
    isCollecting,
    setIsCollecting,
    tankLevelBoiler,
    tankLevelCollection,
    data,
    alerts,
    handleFlush,
  } = useSystem();

  const current = data[data.length - 1] || {};

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200">
      <main className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
        <header className="flex justify-between items-center bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm min-h-[80px]">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Run Sequence <span className="text-cyan-400">#A-402</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-1">
              <Clock size={12} /> ELAPSED: 04:22:19
            </p>
          </div>

          <div className="flex gap-12 px-8 border-l border-r border-slate-800/50 mx-8 flex-1 justify-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-slate-500 font-bold">
                Vapor Temp
              </span>
              <span className="text-3xl font-mono text-fuchsia-400 font-bold">
                {current.tempColumn?.toFixed(1)}°C
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-slate-500 font-bold">
                Current ABV
              </span>
              <span className="text-3xl font-mono text-emerald-400 font-bold">
                {isCollecting ? current.abv?.toFixed(1) : "--"}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-slate-500 font-bold">
                Pressure
              </span>
              <span className="text-3xl font-mono text-amber-400 font-bold">
                101 kPa
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`relative px-5 py-2 rounded-full font-bold text-xs tracking-wider flex items-center gap-3 transition-all border backdrop-blur-sm overflow-hidden group
                ${
                  isRunning
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                }`}
          >
            <span className={`relative flex h-2 w-2`}>
              {isRunning && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? "bg-emerald-500" : "bg-amber-500"}`}
              ></span>
            </span>
            {isRunning ? "SYSTEM ACTIVE" : "SYSTEM PAUSED"}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-3 flex flex-col h-full min-h-0">
            <ManualOverride
              heaterPower={heaterPower}
              setHeaterPower={setHeaterPower}
              refluxRatio={refluxRatio}
              setRefluxRatio={setRefluxRatio}
              isCollecting={isCollecting}
              setIsCollecting={setIsCollecting}
              onFlush={handleFlush}
            />
          </div>

          <GlassCard className="col-span-7" title="Real-time Thermal Analysis">
            <div className="absolute inset-0 p-4 pb-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorBoiler"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorColumn"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis
                    domain={[20, 110]}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [Number(value).toFixed(2), "Temp"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="tempBoiler"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#colorBoiler)"
                    name="Boiler"
                    isAnimationActive={false}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="tempColumn"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#colorColumn)"
                    name="Vapor"
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-4 right-4 flex gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
                <span className="size-2 bg-rose-500 rounded-full" /> Boiler
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
                <span className="size-2 bg-cyan-500 rounded-full" /> Vapor
              </div>
            </div>
          </GlassCard>

          <div className="col-span-2 flex flex-col gap-4">
            <GlassCard
              className="flex-1 flex flex-col gap-4 p-4"
              title="Vessel Status"
            >
              <div className="flex gap-4 h-full">
                <LiquidTank
                  level={tankLevelBoiler}
                  color="amber"
                  label="Boiler"
                />
                <LiquidTank
                  level={tankLevelCollection}
                  color="cyan"
                  label="Spirit"
                />
              </div>
            </GlassCard>

            <GlassCard className="h-1/3" title="System Log">
              <div className="space-y-2 overflow-y-auto h-full pr-1 custom-scrollbar">
                {alerts.length === 0 && (
                  <p className="text-xs text-slate-600 italic p-2 text-center">
                    System nominal...
                  </p>
                )}
                <AnimatePresence>
                  {alerts.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500 text-slate-300"
                    >
                      {a.msg}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
