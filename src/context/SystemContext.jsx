import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within SystemProvider");
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [heaterPower, setHeaterPower] = useState(0);
  const [refluxRatio, setRefluxRatio] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);
  const [tankLevelBoiler, setTankLevelBoiler] = useState(85);
  const [tankLevelCollection, setTankLevelCollection] = useState(5);
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const tempBoilerRef = useRef(25);
  const tempColumnRef = useRef(25);

  const handleFlush = () => {
    setTankLevelCollection(0);
    setTankLevelBoiler(85);
    tempBoilerRef.current = 25;
    tempColumnRef.current = 25;
    setHeaterPower(0);
    setIsCollecting(false);
    setAlerts((p) => [
      { id: Date.now(), msg: "SYSTEM FLUSHED", type: "info" },
      ...p,
    ]);
  };

  useEffect(() => {
    const tick = setInterval(() => {
      if (!isRunning) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      });

      const targetTemp = 25 + heaterPower * 0.85;
      tempBoilerRef.current += (targetTemp - tempBoilerRef.current) * 0.08;

      let columnTarget = tempBoilerRef.current * 0.95;
      if (refluxRatio === 3) columnTarget -= 5;
      if (refluxRatio === 10) columnTarget -= 15;

      tempColumnRef.current += (columnTarget - tempColumnRef.current) * 0.12;

      if (heaterPower > 20) setTankLevelBoiler((l) => Math.max(0, l - 0.02));
      if (isCollecting && tempColumnRef.current > 78) {
        setTankLevelCollection((l) => Math.min(100, l + 0.05));
        setTankLevelBoiler((l) => Math.max(0, l - 0.03));
      }

      setData((prev) => {
        const newData = [
          ...prev,
          {
            time: timeStr,
            tempBoiler: tempBoilerRef.current + Math.random() * 0.05,
            tempColumn: tempColumnRef.current + Math.random() * 0.05,
            abv: Math.max(0, 94 - tankLevelCollection * 0.4),
          },
        ];
        if (newData.length > 50) newData.shift();
        return newData;
      });
    }, 150);

    return () => clearInterval(tick);
  }, [isRunning, heaterPower, refluxRatio, isCollecting, tankLevelCollection]);

  useEffect(() => {
    setData(Array(50).fill({ tempBoiler: 25, tempColumn: 25, abv: 0 }));
  }, []);

  const value = {
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
    setAlerts,
    handleFlush,
    tempBoilerRef,
    tempColumnRef,
  };

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};
