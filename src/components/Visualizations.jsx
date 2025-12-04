import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  RefreshCw,
  Wine,
  Target,
  TrendingUp,
  Clock,
  Droplets,
  Wind,
} from "lucide-react";
import { useSystem } from "../context/SystemContext";

const GlassCard = ({ children, className = "", title }) => (
  <div
    className={`bg-slate-900/40 border border-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col shadow-lg ${className}`}
  >
    {title && (
      <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/30">
        <h3 className="text-sm font-bold text-slate-300 text-center">
          {title}
        </h3>
      </div>
    )}
    <div className="flex-1 relative min-h-0 p-6">{children}</div>
  </div>
);

// Circular Gauge Component
const CircularGauge = ({ value, max, label, color, unit }) => {
  const percentage = (value / max) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    cyan: { stroke: "#22d3ee", glow: "rgba(34, 211, 238, 0.5)" },
    rose: { stroke: "#f43f5e", glow: "rgba(244, 63, 94, 0.5)" },
    amber: { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)" },
    emerald: { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.5)" },
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colors[color].stroke}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors[color].glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </div>
  );
};

// Particle Component
const Particle = ({ delay, intensity, startY = 0 }) => (
  <motion.div
    className="absolute size-1.5 rounded-full bg-cyan-400 blur-[0.5px]"
    initial={{
      bottom: `${startY}%`,
      left: `${30 + Math.random() * 40}%`,
      opacity: 0.9 * intensity,
      scale: Math.random() * 0.5 + 0.5,
    }}
    animate={{
      bottom: `${startY + 100}%`,
      opacity: [0.9 * intensity, 0.6 * intensity, 0],
      x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5],
    }}
    transition={{
      duration: 2 + Math.random(),
      delay: delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Interactive Quick Controls
const QuickControls = ({
  heaterPower,
  setHeaterPower,
  refluxRatio,
  setRefluxRatio,
  isCollecting,
  setIsCollecting,
}) => {
  return (
    <div className="space-y-6">
      {/* Heater Power Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Zap
              size={16}
              className={heaterPower > 0 ? "text-amber-400" : "text-slate-500"}
            />
            Heater Power
          </label>
          <span className="text-2xl font-mono font-bold text-white">
            {heaterPower}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={heaterPower}
          onChange={(e) => setHeaterPower(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>OFF</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>MAX</span>
        </div>
      </div>

      {/* Reflux Ratio Buttons */}
      <div>
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
          <RefreshCw size={16} className="text-cyan-400" />
          Reflux Ratio
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 0, label: "Open Flow" },
            { value: 3, label: "3:1 Ratio" },
            { value: 10, label: "Full Reflux" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setRefluxRatio(option.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                refluxRatio === option.value
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Toggle */}
      <div>
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
          <Wine size={16} className="text-emerald-400" />
          Collection Control
        </label>
        <button
          onClick={() => setIsCollecting(!isCollecting)}
          className={`w-full px-6 py-4 rounded-xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-3 ${
            isCollecting
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              : "border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600"
          }`}
        >
          {isCollecting ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              COLLECTING
            </>
          ) : (
            <>START COLLECTION</>
          )}
        </button>
      </div>
    </div>
  );
};

// Completely Reworked Distillation Column
const DistillationColumn = ({
  tempBoiler,
  tempColumn,
  heaterPower,
  isCollecting,
  refluxRatio,
}) => {
  const [selectedStage, setSelectedStage] = useState(null);

  // Calculate temperatures for each stage
  const stages = Array.from({ length: 8 }, (_, i) => {
    const ratio = (7 - i) / 7;
    return tempBoiler + (tempColumn - tempBoiler) * ratio;
  });

  const getHeatIntensity = (temp) => {
    if (temp < 40) return 0.1;
    if (temp < 60) return 0.3;
    if (temp < 80) return 0.6;
    return 1;
  };

  const getColor = (temp) => {
    if (temp < 40) return "from-slate-700 to-slate-800";
    if (temp < 60) return "from-purple-900/50 to-slate-800";
    if (temp < 80) return "from-rose-900/50 to-purple-900/50";
    return "from-amber-600/50 to-rose-900/50";
  };

  return (
    <div className="flex items-center justify-center h-full gap-12">
      {/* Main Column Structure */}
      <div className="flex flex-col items-center gap-4">
        {/* Condenser Unit */}
        <div className="relative">
          <motion.div
            className="w-48 h-20 bg-slate-800/80 border-2 rounded-2xl flex items-center justify-center relative overflow-hidden"
            animate={{
              borderColor: isCollecting
                ? "rgba(59, 130, 246, 0.8)"
                : "rgba(71, 85, 105, 0.5)",
              boxShadow: isCollecting
                ? "0 0 30px rgba(59, 130, 246, 0.4)"
                : "0 0 0px",
            }}
            onHoverStart={() => setSelectedStage("condenser")}
            onHoverEnd={() => setSelectedStage(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent" />

            <div className="relative z-10 text-center">
              <Droplets className="mx-auto mb-1 text-blue-400" size={20} />
              <span className="text-xs font-bold text-blue-300">CONDENSER</span>
            </div>

            {/* Cooling waves */}
            {isCollecting && (
              <>
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400/30 rounded-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400/30 rounded-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </>
            )}
          </motion.div>

          {/* Collection Pipe */}
          {isCollecting && (
            <motion.div
              className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Vapor Line */}
        <div className="relative w-2 h-8 bg-slate-700 rounded-full overflow-hidden">
          {heaterPower > 20 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-cyan-400 to-transparent"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Fractionating Column - 8 stages */}
        <div className="relative w-32 border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
          <div className="absolute inset-0 flex flex-col">
            {stages.map((temp, i) => (
              <motion.div
                key={i}
                className={`flex-1 relative border-b border-slate-700/50 last:border-b-0 cursor-pointer bg-gradient-to-r ${getColor(temp)}`}
                onHoverStart={() => setSelectedStage(i)}
                onHoverEnd={() => setSelectedStage(null)}
                animate={{
                  backgroundColor:
                    selectedStage === i
                      ? "rgba(20, 184, 166, 0.1)"
                      : "transparent",
                }}
              >
                {/* Stage tray */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-600/50" />

                {/* Heat glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0"
                  animate={{
                    opacity: [
                      getHeatIntensity(temp) * 0.3,
                      getHeatIntensity(temp) * 0.6,
                      getHeatIntensity(temp) * 0.3,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />

                {/* Vapor particles in each stage */}
                {heaterPower > 20 && i < 6 && (
                  <>
                    <Particle
                      delay={i * 0.15}
                      intensity={heaterPower / 100}
                      startY={0}
                    />
                    <Particle
                      delay={i * 0.15 + 0.3}
                      intensity={heaterPower / 100}
                      startY={0}
                    />
                  </>
                )}

                {/* Stage number */}
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] font-mono text-slate-500">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Reflux indicator */}
          {refluxRatio > 0 && (
            <motion.div
              className="absolute top-0 right-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent"
              animate={{
                height: `${refluxRatio * 10}%`,
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                height: { duration: 0.5 },
                opacity: { duration: 1.5, repeat: Infinity },
              }}
            />
          )}
        </div>

        {/* Boiler Connection Pipe */}
        <div className="relative w-2 h-6 bg-slate-700 rounded-full overflow-hidden">
          {heaterPower > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-amber-500 to-rose-500"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Boiler */}
        <motion.div
          className="w-48 h-32 bg-slate-800/80 border-2 rounded-3xl flex items-center justify-center relative overflow-hidden"
          animate={{
            borderColor:
              heaterPower > 0
                ? "rgba(245, 158, 11, 0.8)"
                : "rgba(71, 85, 105, 0.5)",
            boxShadow:
              heaterPower > 0
                ? `0 0 40px rgba(245, 158, 11, ${heaterPower / 200})`
                : "0 0 0px",
          }}
          onHoverStart={() => setSelectedStage("boiler")}
          onHoverEnd={() => setSelectedStage(null)}
        >
          {/* Liquid level */}
          <motion.div
            className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600/60 via-rose-600/40 to-transparent"
            animate={{ height: `${60 + heaterPower * 0.2}%` }}
            transition={{ duration: 1 }}
          />

          {/* Heat waves */}
          {heaterPower > 30 && (
            <>
              <motion.div
                className="absolute bottom-0 w-full h-1 bg-amber-500/60 blur-sm"
                animate={{
                  y: [-10, -40, -10],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 w-full h-1 bg-rose-500/60 blur-sm"
                animate={{
                  y: [-10, -40, -10],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Heating Element Icon */}
          <div className="relative z-10 text-center">
            <Zap className="mx-auto mb-2 text-amber-400" size={32} />
            <span className="text-xs font-bold text-amber-300">BOILER</span>
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <div className="flex flex-col gap-3 min-w-[220px]">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
            <Wind size={14} />
            <span>System Status</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">
                Vapor Temperature
              </div>
              <div className="text-2xl font-mono font-bold text-cyan-400">
                {tempColumn.toFixed(1)}°C
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">
                Boiler Temperature
              </div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                {tempBoiler.toFixed(1)}°C
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Reflux Mode</div>
              <div className="text-lg font-bold text-fuchsia-400">
                {refluxRatio === 0
                  ? "Open Flow"
                  : refluxRatio === 3
                    ? "3:1 Ratio"
                    : "Full Reflux"}
              </div>
            </div>
          </div>
        </div>

        {/* Stage Detail on Hover */}
        {selectedStage !== null && (
          <motion.div
            className="bg-teal-900/30 rounded-xl p-4 border border-teal-500/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xs font-bold text-teal-300 mb-2">
              {selectedStage === "condenser"
                ? "Condenser Unit"
                : selectedStage === "boiler"
                  ? "Boiler Unit"
                  : `Stage ${selectedStage + 1}`}
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {selectedStage === "condenser"
                ? (tempColumn - 10).toFixed(1)
                : selectedStage === "boiler"
                  ? tempBoiler.toFixed(1)
                  : stages[selectedStage].toFixed(1)}
              °C
            </div>
          </motion.div>
        )}

        {/* Process Indicators */}
        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
              heaterPower > 0
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-500 border border-slate-700"
            }`}
          >
            <div
              className={`size-2 rounded-full ${heaterPower > 0 ? "bg-amber-400" : "bg-slate-600"}`}
            />
            <span>Heating {heaterPower > 0 ? "Active" : "Idle"}</span>
          </div>

          <div
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
              isCollecting
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-800/50 text-slate-500 border border-slate-700"
            }`}
          >
            <div
              className={`size-2 rounded-full ${isCollecting ? "bg-emerald-400" : "bg-slate-600"}`}
            />
            <span>Collection {isCollecting ? "Active" : "Standby"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preset Profiles with better padding
const PresetProfiles = ({
  setHeaterPower,
  setRefluxRatio,
  setIsCollecting,
  setAlerts,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(null);

  const presets = [
    {
      id: 1,
      name: "Foreshots Strip",
      icon: "🔥",
      description: "High heat, open reflux",
      settings: { heater: 90, reflux: 0, collecting: true },
    },
    {
      id: 2,
      name: "Hearts Collection",
      icon: "💎",
      description: "Moderate heat, 3:1 reflux",
      settings: { heater: 65, reflux: 3, collecting: true },
    },
    {
      id: 3,
      name: "Precision Run",
      icon: "🎯",
      description: "Low heat, full reflux",
      settings: { heater: 45, reflux: 10, collecting: true },
    },
    {
      id: 4,
      name: "Idle/Standby",
      icon: "⏸️",
      description: "Minimal heat, no collection",
      settings: { heater: 15, reflux: 0, collecting: false },
    },
  ];

  const loadPreset = (preset) => {
    setSelectedPreset(preset.id);
    setHeaterPower(preset.settings.heater);
    setRefluxRatio(preset.settings.reflux);
    setIsCollecting(preset.settings.collecting);
    setAlerts((prev) => [
      {
        id: Date.now(),
        msg: `PRESET LOADED: ${preset.name.toUpperCase()}`,
        type: "info",
      },
      ...prev,
    ]);

    setTimeout(() => setSelectedPreset(null), 1000);
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full p-4">
      {presets.map((preset) => (
        <motion.button
          key={preset.id}
          onClick={() => loadPreset(preset)}
          className={`p-8 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
            selectedPreset === preset.id
              ? "border-cyan-500 bg-cyan-500/20"
              : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-5xl mb-4">{preset.icon}</div>
          <h4 className="text-xl font-bold text-white mb-2">{preset.name}</h4>
          <p className="text-sm text-slate-400 mb-4">{preset.description}</p>

          <div className="flex gap-3 text-xs font-mono text-slate-500">
            <span>Heat: {preset.settings.heater}%</span>
            <span>•</span>
            <span>
              Reflux:{" "}
              {preset.settings.reflux === 0
                ? "Open"
                : preset.settings.reflux === 3
                  ? "3:1"
                  : "Full"}
            </span>
          </div>

          {selectedPreset === preset.id && (
            <motion.div
              className="absolute inset-0 border-2 border-cyan-500 rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// ABV Target Setter
const ABVTargetSetter = ({ currentABV, isCollecting, tankLevelCollection }) => {
  const [targetABV, setTargetABV] = useState(90);

  const estimatedTime =
    isCollecting && currentABV > 0
      ? Math.max(0, (((targetABV - currentABV) / 0.1) * 0.15) / 60)
      : 0;

  const progress = isCollecting
    ? Math.min(100, (currentABV / targetABV) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Target Setter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Target size={16} className="text-emerald-400" />
            Target ABV
          </label>
          <span className="text-3xl font-mono font-bold text-emerald-400">
            {targetABV}%
          </span>
        </div>
        <input
          type="range"
          min="70"
          max="95"
          value={targetABV}
          onChange={(e) => setTargetABV(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>70%</span>
          <span>80%</span>
          <span>90%</span>
          <span>95%</span>
        </div>
      </div>

      {/* Progress Display */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-slate-400">Current ABV</span>
          <span className="text-2xl font-mono font-bold text-white">
            {isCollecting ? currentABV.toFixed(1) : "--"}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent"
            animate={{
              width: `${progress}%`,
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              width: { duration: 0.5 },
              opacity: { duration: 1.5, repeat: Infinity },
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Clock size={12} />
              Est. Time to Target
            </div>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {isCollecting ? `${estimatedTime.toFixed(1)} min` : "--"}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Collection Level</div>
            <span className="text-lg font-mono font-bold text-amber-400">
              {tankLevelCollection.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={`text-center py-3 rounded-xl border-2 font-bold ${
          isCollecting
            ? progress >= 100
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
              : "border-cyan-500 bg-cyan-500/20 text-cyan-400"
            : "border-slate-700 bg-slate-800/30 text-slate-500"
        }`}
      >
        {!isCollecting
          ? "AWAITING START"
          : progress >= 100
            ? "✓ TARGET REACHED"
            : "IN PROGRESS"}
      </div>
    </div>
  );
};

export default function Visualizations() {
  const {
    heaterPower,
    setHeaterPower,
    refluxRatio,
    setRefluxRatio,
    isCollecting,
    setIsCollecting,
    data,
    tempBoilerRef,
    tempColumnRef,
    tankLevelCollection,
    setAlerts,
  } = useSystem();

  const current = data[data.length - 1] || {};
  const tempBoiler = tempBoilerRef.current;
  const tempColumn = tempColumnRef.current;
  const pressure = 101 + heaterPower * 0.03;
  const flowRate = isCollecting ? 2.5 + heaterPower * 0.02 : 0;
  const efficiency = isCollecting
    ? Math.min(95, 70 + (current.abv || 0) * 0.25)
    : 0;

  return (
    <div className="h-full w-full p-6 overflow-auto">
      <div className="grid grid-cols-2 gap-6">
        {/* Real-time Gauges */}
        <GlassCard title="System Metrics" className="row-span-2">
          <div className="grid grid-cols-2 gap-8 h-full items-center">
            <CircularGauge
              value={tempBoiler}
              max={100}
              label="Boiler Temperature"
              color="rose"
              unit="°C"
            />
            <CircularGauge
              value={pressure}
              max={110}
              label="System Pressure"
              color="amber"
              unit="kPa"
            />
            <CircularGauge
              value={flowRate}
              max={5}
              label="Collection Rate"
              color="cyan"
              unit="L/h"
            />
            <CircularGauge
              value={efficiency}
              max={100}
              label="Process Efficiency"
              color="emerald"
              unit="%"
            />
          </div>
        </GlassCard>

        {/* Quick Controls */}
        <GlassCard title="Interactive Controls">
          <QuickControls
            heaterPower={heaterPower}
            setHeaterPower={setHeaterPower}
            refluxRatio={refluxRatio}
            setRefluxRatio={setRefluxRatio}
            isCollecting={isCollecting}
            setIsCollecting={setIsCollecting}
          />
        </GlassCard>

        {/* ABV Target */}
        <GlassCard title="Target Management">
          <ABVTargetSetter
            currentABV={current.abv || 0}
            isCollecting={isCollecting}
            tankLevelCollection={tankLevelCollection}
          />
        </GlassCard>

        {/* Distillation Column - COMPLETELY REWORKED */}
        <GlassCard title="Distillation Column" className="col-span-2">
          <DistillationColumn
            tempBoiler={tempBoiler}
            tempColumn={tempColumn}
            heaterPower={heaterPower}
            isCollecting={isCollecting}
            refluxRatio={refluxRatio}
          />
        </GlassCard>

        {/* Preset Profiles - WITH BETTER PADDING */}
        <GlassCard title="Preset Profiles" className="col-span-2">
          <PresetProfiles
            setHeaterPower={setHeaterPower}
            setRefluxRatio={setRefluxRatio}
            setIsCollecting={setIsCollecting}
            setAlerts={setAlerts}
          />
        </GlassCard>
      </div>
    </div>
  );
}
