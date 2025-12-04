import React from "react";

// SVG-based circular gauge using stroke-dasharray technique [web:23][web:24]
export default function CircularGauge({
  value,
  max,
  label,
  unit,
  color = "#22d3ee",
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono" style={{ color }}>
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">{unit}</span>
        </div>
      </div>

      {/* Label */}
      <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}
