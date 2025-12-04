import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SystemProvider } from "./context/SystemContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Visualizations from "./components/Visualizations";

function App() {
  return (
    <Router>
      <SystemProvider>
        <div className="dark h-screen w-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-cyan-500/30">
          <Navbar />
          <div className="h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/visualizations" element={<Visualizations />} />
            </Routes>
          </div>
        </div>
      </SystemProvider>
    </Router>
  );
}

export default App;
