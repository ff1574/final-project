import React from "react";
import {
  Zap,
  RefreshCw,
  Power,
  ThermometerSnowflake,
  Trash2,
  Wine,
} from "lucide-react";
import { motion } from "framer-motion";

const ControlButton = ({
  active,
  onClick,
  label,
  icon: Icon,
  color = "cyan",
}) => {
  const colors = {
    cyan: "border-cyan-500/50 text-cyan-400 bg-cyan-950/20",
    rose: "border-rose-500/50 text-rose-400 bg-rose-950/20",
    amber: "border-amber-500/50 text-amber-400 bg-amber-950/20",
    slate:
      "border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300",
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
        active ? colors[color] : colors.slate
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};

const Wind = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
    <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
  </svg>
);

export default function ManualOverride({
  heaterPower,
  setHeaterPower,
  refluxRatio,
  setRefluxRatio,
  isCollecting,
  setIsCollecting,
  onFlush,
}) {
  return (
    <div className="h-full flex flex-col gap-3">
      {/* 1. Heater Control with Pulsing Glow - ONLY THIS ONE */}
      <motion.div
        className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm"
        animate={
          heaterPower > 30
            ? {
                boxShadow: [
                  "0 0 15px rgba(251, 191, 36, 0.1)",
                  `0 0 ${15 + heaterPower * 0.2}px rgba(251, 191, 36, ${0.2 + heaterPower * 0.002})`,
                  "0 0 15px rgba(251, 191, 36, 0.1)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex justify-center items-center mb-3">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <Zap
              size={14}
              className={
                heaterPower > 0
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600"
              }
            />
            Boiler Element
          </label>
        </div>

        <div className="flex justify-center mb-2">
          <span className="font-mono text-3xl font-bold text-white">
            {heaterPower}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={heaterPower}
          onChange={(e) => setHeaterPower(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-2"
        />
        <div className="flex justify-between text-[10px] text-slate-600 font-mono">
          <span>OFF</span>
          <span>MAX</span>
        </div>
      </motion.div>

      {/* 2. Reflux Ratio - NO ANIMATION */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm h-32 flex flex-col">
        <div className="flex justify-center mb-3">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <RefreshCw size={14} className="text-cyan-400" /> Reflux Control
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          <ControlButton
            active={refluxRatio === 0}
            onClick={() => setRefluxRatio(0)}
            label="Open"
            icon={Wind}
            color="cyan"
          />
          <ControlButton
            active={refluxRatio === 3}
            onClick={() => setRefluxRatio(3)}
            label="3:1"
            icon={RefreshCw}
            color="cyan"
          />
          <ControlButton
            active={refluxRatio === 10}
            onClick={() => setRefluxRatio(10)}
            label="Full"
            icon={ThermometerSnowflake}
            color="cyan"
          />
        </div>
      </div>

      {/* 3. Process Actions - NO ANIMATION */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm h-32 flex flex-col">
        <div className="flex justify-center mb-3">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <Power size={14} className="text-rose-400" /> Override Actions
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1">
          <ControlButton
            active={isCollecting}
            onClick={() => setIsCollecting(!isCollecting)}
            label={isCollecting ? "Run" : "Start"}
            icon={Wine}
            color="cyan"
          />

          <ControlButton
            active={false}
            onClick={onFlush}
            label="Flush"
            icon={Trash2}
            color="rose"
          />

          <ControlButton
            active={false}
            onClick={() => {}}
            label="Cool"
            icon={ThermometerSnowflake}
            color="slate"
          />
        </div>
      </div>
    </div>
  );
}
