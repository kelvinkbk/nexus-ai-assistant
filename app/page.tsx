"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Smartphone, 
  Monitor, 
  Code2, 
  Terminal, 
  Zap, 
  MessageSquare, 
  Settings, 
  Activity,
  Layers,
  Play,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  ShieldCheck,
  Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const initialChartData = [
  { time: '10:00', usage: 45 },
  { time: '10:05', usage: 52 },
  { time: '10:10', usage: 48 },
  { time: '10:15', usage: 61 },
  { time: '10:20', usage: 55 },
  { time: '10:25', usage: 67 },
  { time: '10:30', usage: 58 },
];

const FILE_CONTENTS: Record<string, string> = {
  "NexusCore.tsx": `import { Nexus } from "@nexus/core";\n\nexport const NexusCore = () => {\n  return <div>Core Active</div>;\n};`,
  "NeuralLink.ts": `export const sync = async () => {\n  console.log("Neural link established");\n};`,
  "useNexus.ts": `export const useNexus = () => {\n  return { status: "online" };\n};`,
  "App.tsx": `import { NexusCore } from "./NexusCore";\n\nexport default function App() {\n  return <NexusCore />;\n}`,
  "nexus.config.ts": `export default {\n  mode: "quantum",\n  latency: "ultra-low"\n};`,
  "package.json": `{\n  "name": "nexus-project",\n  "version": "1.0.0"\n}`
};

type NeuralMode = "balanced" | "overdrive" | "stealth" | "quantum";

export default function Home() {
  const [command, setCommand] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeDevice, setActiveDevice] = useState<"pc" | "mobile">("pc");
  const [activeTab, setActiveTab] = useState<"chat" | "graph" | "metrics">("chat");
  const [activeFile, setActiveFile] = useState("NexusCore.tsx");
  const [showCode, setShowCode] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showExplorer, setShowExplorer] = useState(true);
  const [neuralMode, setNeuralMode] = useState<NeuralMode>("balanced");
  const [isDeploying, setIsDeploying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMountedRef = useRef(true);
  const [nowPlaying, setNowPlaying] = useState<{title: string, artist: string} | null>(null);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{id: number, text: string, type: 'info' | 'success'}[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [logs, setLogs] = useState<{text: string, time: string}[]>([]);
  const [chartData, setChartData] = useState(initialChartData);
  const [taskProgress, setTaskProgress] = useState({
    code: 85,
    test: 40,
    deploy: 0
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const addNotification = (text: string, type: 'info' | 'success' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      addNotification("Neural voice link active", "info");
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    addNotification("Initiating edge deployment...", "info");
    setTimeout(() => {
      setIsDeploying(false);
      addNotification("Deployment successful on 12 nodes", "success");
      setShowCode(false);
    }, 4000);
  };

  const modeColors = {
    balanced: "blue",
    overdrive: "red",
    stealth: "green",
    quantum: "purple"
  };

  const themeColor = modeColors[neuralMode];

  useEffect(() => {
    setMounted(true);
    isMountedRef.current = true;
    
    // Initialize logs on client side only once
    setLogs(prev => prev.length > 0 ? prev : [
      { text: "Nexus Neural Core v2.4.0 Online.", time: new Date().toLocaleTimeString([], { hour12: false }) },
      { text: "Autonomous reasoning engine initialized.", time: new Date().toLocaleTimeString([], { hour12: false }) },
      { text: "Contextual awareness: ACTIVE.", time: new Date().toLocaleTimeString([], { hour12: false }) }
    ]);

    // Use a very conservative interval for background updates to prevent dev server connection resets
    const intervalId = setInterval(() => {
      if (isMountedRef.current && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setTaskProgress(p => ({
          code: Math.min(100, p.code + 0.05),
          test: Math.min(100, p.test + 0.05),
          deploy: p.test > 80 ? Math.min(100, p.deploy + 0.1) : p.deploy
        }));
      }
    }, 60000); // 1 minute interval for maximum stability

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  // Remove the secondary update effect to minimize state churn

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isThinking]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    const userQuery = command.trim().toLowerCase();
    const currentTime = new Date().toLocaleTimeString([], { hour12: false });
    
    setIsThinking(true);
    setLogs(prev => [...prev, { text: `> ${command}`, time: currentTime }].slice(-50));
    setCommand("");

    setTimeout(() => {
      if (!isMountedRef.current) return;
      setIsThinking(false);
      const responseTime = new Date().toLocaleTimeString([], { hour12: false });
      
      let responses: string[] = [];

      // 1. Music Linking
      if (userQuery.includes("play") || userQuery.includes("music")) {
        const song = userQuery.replace("play", "").replace("music", "").trim() || "Neural Beats";
        setNowPlaying({ title: song.toUpperCase(), artist: "Nexus AI" });
        responses = [`Accessing media library...`, `Streaming "${song}" to ${activeDevice}.` ];
        addNotification(`Now playing: ${song}`, "success");
        setActiveTab("metrics"); // Auto-switch to see the player
      } 
      // 2. App Linking
      else if (userQuery.includes("open") || userQuery.includes("launch")) {
        const app = userQuery.replace("open", "").replace("launch", "").trim() || "Terminal";
        setOpenApps(prev => [...new Set([...prev, app])]);
        responses = [`Initializing ${app} environment...`, `${app} is now active on ${activeDevice}.` ];
        addNotification(`${app} launched`, "info");
        setActiveTab("metrics"); // Auto-switch to see the remote mirror
      } 
      // 3. Code & File Linking
      else if (userQuery.includes("create") || userQuery.includes("code") || userQuery.includes("edit")) {
        const targetFile = Object.keys(FILE_CONTENTS).find(f => userQuery.includes(f.toLowerCase())) || "App.tsx";
        setActiveFile(targetFile);
        setShowCode(true);
        responses = [`Analyzing ${targetFile} context...`, `Autonomous logic injected into ${targetFile}.` ];
        addNotification(`Editor synced: ${targetFile}`, "success");
      }
      // 4. System Control Linking
      else if (userQuery.includes("sync") || userQuery.includes("update")) {
        responses = ["Initiating global handshake...", "Neural weights synchronized across all nodes."];
        addNotification("System-wide sync complete", "success");
      }
      else {
        responses = ["Context analyzed.", "Executing requested sequence with neural optimization."];
      }

      setLogs(prev => [...prev, ...responses.map(r => ({ text: r, time: responseTime }))].slice(-50));
    }, 1200);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const cmd = terminalInput.trim().toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour12: false });
    
    setLogs(prev => [...prev, { text: `system@nexus:~$ ${cmd}`, time }].slice(-50));
    setTerminalInput("");

    // Simple terminal command logic
    setTimeout(() => {
      let response = "";
      if (cmd === "ls") response = "src/  public/  package.json  nexus.config.ts";
      else if (cmd === "whoami") response = "nexus_root_user";
      else if (cmd === "help") response = "Available: ls, whoami, clear, status, reboot";
      else if (cmd === "reboot") {
        window.location.reload();
        return;
      } else response = `Command not found: ${cmd}`;
      
      setLogs(prev => [...prev, { text: response, time }].slice(-50));
    }, 100);
  };

  return (
    <div 
      className={`min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-${themeColor}-500/30 overflow-hidden transition-colors duration-1000`}
      role="application"
      aria-label="Nexus AI Assistant Dashboard"
    >
      {/* Deployment Overlay */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="w-64 space-y-6 text-center">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`w-20 h-20 border-4 border-${themeColor}-500/20 border-t-${themeColor}-500 rounded-full mx-auto`}
                />
                <Cpu className={`absolute inset-0 m-auto w-8 h-8 text-${themeColor}-400 animate-pulse`} />
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Deploying to Edge</h2>
                <p className="text-[10px] text-zinc-500 font-mono">Syncing neural weights across clusters...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="xl:hidden h-14 border-b border-zinc-800 bg-[#0d0d0d] flex items-center justify-between px-4 z-[100] relative">
        <div className="flex items-center gap-3">
          <Cpu className={`w-6 h-6 text-${themeColor}-500`} />
          <span className="font-bold text-xs uppercase tracking-widest">Nexus</span>
        </div>
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 text-zinc-400">
          <Layers className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#0a0a0a] pt-20 p-6 xl:hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <MobileNavBtn icon={<MessageSquare />} label="Chat" active={activeTab === "chat"} onClick={() => { setActiveTab("chat"); setShowMobileMenu(false); }} />
              <MobileNavBtn icon={<Layers />} label="Graph" active={activeTab === "graph"} onClick={() => { setActiveTab("graph"); setShowMobileMenu(false); }} />
              <MobileNavBtn icon={<Activity />} label="Metrics" active={activeTab === "metrics"} onClick={() => { setActiveTab("metrics"); setShowMobileMenu(false); }} />
              <MobileNavBtn icon={<Terminal />} label="Terminal" active={showTerminal} onClick={() => { setShowTerminal(!showTerminal); setShowMobileMenu(false); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] px-6 bg-black/40 backdrop-blur-md"
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-[#111] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 border-b border-zinc-800">
                <Zap className="w-4 h-4 text-blue-500" />
                <input 
                  autoFocus
                  placeholder="Search commands, files, or devices..."
                  className="w-full bg-transparent border-none focus:ring-0 p-4 text-sm text-zinc-200"
                />
                <kbd className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-500 font-mono">ESC</kbd>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <PaletteItem icon={<Monitor />} label="Switch to Desktop Control" shortcut="D" />
                <PaletteItem icon={<Smartphone />} label="Switch to Mobile Sync" shortcut="M" />
                <PaletteItem icon={<Code2 />} label="Open Code Editor" shortcut="E" />
                <PaletteItem icon={<Terminal />} label="Toggle Terminal" shortcut="T" />
                <PaletteItem icon={<Settings />} label="System Settings" shortcut="S" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#111] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 id="settings-title" className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Neural Configuration
                </h2>
                <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-zinc-300">
                  <Zap className="w-4 h-4 rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <SettingRow label="Neural Processing" description="Enable high-latency deep reasoning" active />
                <SettingRow label="Hardware Handshake" description="Auto-sync with nearby devices" active />
                <SettingRow 
                  label="Screen Reader Optimization" 
                  description="Enhanced ARIA labels and focus management" 
                  active={screenReaderActive}
                  onClick={() => setScreenReaderActive(!screenReaderActive)}
                />
                <div className="pt-4">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl border backdrop-blur-md flex items-center gap-3 shadow-2xl ${
                n.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span className="text-xs font-medium">{n.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside 
        className="hidden xl:flex fixed left-0 top-0 h-full w-20 border-r border-zinc-800 bg-[#0d0d0d] flex flex-col items-center py-8 gap-8 z-50"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 cursor-pointer hover:scale-105 transition-transform">
          <Cpu className="w-7 h-7 text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 mt-4">
          <NavIcon icon={<Monitor />} label="Desktop Control" active={activeDevice === "pc"} onClick={() => setActiveDevice("pc")} />
          <NavIcon icon={<Smartphone />} label="Mobile Sync" active={activeDevice === "mobile"} onClick={() => setActiveDevice("mobile")} />
          <div className="h-px w-8 bg-zinc-800 my-2" />
          <NavIcon icon={<MessageSquare />} label="Chat Interface" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
          <NavIcon icon={<Layers />} label="Neural Graph" active={activeTab === "graph"} onClick={() => setActiveTab("graph")} />
          <NavIcon icon={<Activity />} label="System Metrics" active={activeTab === "metrics"} onClick={() => setActiveTab("metrics")} />
          <div className="h-px w-8 bg-zinc-800 my-2" />
          <NavIcon icon={<Code2 />} label="Code Editor" active={showCode} onClick={() => setShowCode(!showCode)} />
          <NavIcon icon={<Terminal />} label="Terminal" active={showTerminal} onClick={() => setShowTerminal(!showTerminal)} />
        </nav>

        <div className="mt-auto flex flex-col gap-6 items-center">
          <NavIcon icon={<Settings />} label="Settings" active={showSettings} onClick={() => setShowSettings(true)} />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 cursor-pointer hover:ring-2 ring-blue-500/50 transition-all">
            <div className="w-full h-full rounded-full bg-[#0d0d0d] flex items-center justify-center text-[10px] font-bold">
              JD
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="xl:pl-20 flex h-screen relative">
        {/* Neural Link Background Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2563eb10,transparent_70%)] transition-opacity duration-1000 ${isThinking ? 'opacity-100' : 'opacity-0'}`} />
          {/* Removed external noise SVG to prevent connection resets */}
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[100px]" />
        </div>

        {/* File Explorer */}
        <AnimatePresence>
          {showExplorer && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-zinc-800 bg-[#0d0d0d] hidden md:flex flex-col overflow-hidden"
            >
              <div className="h-16 border-b border-zinc-800 flex items-center px-6 justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explorer</span>
                <button onClick={() => setShowExplorer(false)} className="text-zinc-600 hover:text-zinc-400">
                  <Layers className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                <FileItem name="src" type="folder" open>
                  <FileItem name="components" type="folder" open>
                    <FileItem name="NexusCore.tsx" type="file" active={activeFile === "NexusCore.tsx"} onClick={() => { setActiveFile("NexusCore.tsx"); setShowCode(true); }} />
                    <FileItem name="NeuralLink.ts" type="file" active={activeFile === "NeuralLink.ts"} onClick={() => { setActiveFile("NeuralLink.ts"); setShowCode(true); }} />
                  </FileItem>
                  <FileItem name="hooks" type="folder">
                    <FileItem name="useNexus.ts" type="file" active={activeFile === "useNexus.ts"} onClick={() => { setActiveFile("useNexus.ts"); setShowCode(true); }} />
                  </FileItem>
                  <FileItem name="App.tsx" type="file" active={activeFile === "App.tsx"} onClick={() => { setActiveFile("App.tsx"); setShowCode(true); }} />
                </FileItem>
                <FileItem name="nexus.config.ts" type="file" active={activeFile === "nexus.config.ts"} onClick={() => { setActiveFile("nexus.config.ts"); setShowCode(true); }} />
                <FileItem name="package.json" type="file" active={activeFile === "package.json"} onClick={() => { setActiveFile("package.json"); setShowCode(true); }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Preview Overlay */}
        <AnimatePresence>
          {showCode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="absolute right-80 top-20 bottom-20 w-[600px] bg-[#111] border border-zinc-800 rounded-2xl z-50 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Nexus Editor v1.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleDeploy}
                    className={`px-3 py-1 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white text-[10px] font-bold uppercase rounded-md transition-colors`}
                  >
                    Deploy to Edge
                  </button>
                  <button onClick={() => setShowCode(false)} className="text-zinc-500 hover:text-zinc-300">
                    <Settings className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
              <div className="flex-1 flex font-mono text-xs overflow-hidden">
                <div className="w-12 bg-zinc-900/50 border-r border-zinc-800 flex flex-col items-center py-4 text-zinc-700 select-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="h-5 leading-5">{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-[#0d0d0d] text-blue-300/90 leading-5">
                  <pre>
                    {FILE_CONTENTS[activeFile] || `// No content for ${activeFile}`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat/Command Area */}
        <section className="flex-1 flex flex-col relative">
          <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
              {!showExplorer && (
                <button onClick={() => setShowExplorer(true)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                  <Layers className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-${themeColor}-500 animate-pulse`} />
                <h1 className="font-medium text-zinc-400">Nexus Autonomous Intelligence</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
                <ModeButton mode="balanced" active={neuralMode === "balanced"} onClick={() => setNeuralMode("balanced")} />
                <ModeButton mode="overdrive" active={neuralMode === "overdrive"} onClick={() => setNeuralMode("overdrive")} />
                <ModeButton mode="stealth" active={neuralMode === "stealth"} onClick={() => setNeuralMode("stealth")} />
                <ModeButton mode="quantum" active={neuralMode === "quantum"} onClick={() => setNeuralMode("quantum")} />
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Latency: 12ms</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Synced</span>
              </div>
            </div>
          </header>

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  ref={scrollRef}
                  className="absolute inset-0 overflow-y-auto p-8 space-y-6 scroll-smooth"
                >
                  <AnimatePresence mode="popLayout">
                    {logs.filter(l => !l.text.includes('~$')).map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-sm font-mono leading-relaxed ${
                          log.text.startsWith('>') 
                            ? 'text-blue-400 border-l-2 border-blue-500/50 pl-3 py-1' 
                            : 'text-zinc-400'
                        }`}
                      >
                        {log.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isThinking && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 text-blue-400 font-mono text-sm"
                    >
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      </div>
                      Thinking...
                    </motion.div>
                  )}
                </motion.div>
              ) : activeTab === "graph" ? (
                <motion.div 
                  key="graph"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]"
                >
                  <NeuralGraph isThinking={isThinking} themeColor={themeColor} />
                </motion.div>
              ) : (
                <motion.div 
                  key="metrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-8 overflow-y-auto"
                >
                  <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Remote Device Mirroring</h3>
                    <div className="aspect-video w-full bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                      
                      {/* Simulated App Windows */}
                      <div className="absolute inset-4 flex flex-wrap gap-4 pointer-events-none">
                        {openApps.map((app, i) => (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-24 bg-zinc-800/80 border border-zinc-700 rounded-xl p-2 shadow-xl backdrop-blur-md"
                          >
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                              <div className="text-[8px] font-bold uppercase text-zinc-500 truncate">{app}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-zinc-700 rounded-full" />
                              <div className="h-1 w-2/3 bg-zinc-700 rounded-full" />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="text-center z-10">
                        {activeDevice === "pc" ? (
                          <Monitor className="w-12 h-12 text-zinc-700 mb-4 mx-auto" />
                        ) : (
                          <Smartphone className="w-12 h-12 text-zinc-700 mb-4 mx-auto" />
                        )}
                        <p className="text-xs font-mono text-zinc-500">Secure Stream: {activeDevice.toUpperCase()}_REMOTE_01</p>
                      </div>
                    </div>
                  </div>

                  {nowPlaying && (
                    <div className="mb-8 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-${themeColor}-500/20 flex items-center justify-center`}>
                          <Activity className={`w-5 h-5 text-${themeColor}-500 animate-pulse`} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-200">{nowPlaying.title}</div>
                          <div className="text-[10px] text-zinc-500">{nowPlaying.artist}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className={`w-1 h-4 bg-${themeColor}-500/40 rounded-full animate-[bounce_1s_infinite]`} />
                        <div className={`w-1 h-4 bg-${themeColor}-500/40 rounded-full animate-[bounce_1.2s_infinite]`} />
                        <div className={`w-1 h-4 bg-${themeColor}-500/40 rounded-full animate-[bounce_0.8s_infinite]`} />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetricsCard title="Neural Throughput" value="4.2 TB/s" trend="+12%" />
                    <MetricsCard title="Active Synapses" value="1.2B" trend="+0.4%" />
                    <MetricsCard title="Quantum Coherence" value="99.9%" trend="Stable" />
                    <MetricsCard title="Edge Latency" value="0.8ms" trend="-2ms" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal Console */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                className="border-t border-zinc-800 bg-[#0d0d0d] overflow-hidden flex flex-col"
              >
                <div className="h-8 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/30">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Interactive Shell
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  </div>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1 bg-black/20">
                  <div className="text-zinc-600 mb-2">Welcome to Nexus Shell v2.4.0. Type 'help' for commands.</div>
                  {logs.slice(-10).map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-zinc-700">[{log.time}]</span>
                      <span className={log.text.startsWith('>') || log.text.includes('~$') ? 'text-blue-400' : 'text-zinc-400'}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                  <form onSubmit={handleTerminalSubmit} className="flex gap-2 items-center pt-1">
                    <span className="text-green-500">system@nexus:~$</span>
                    <input 
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-zinc-100"
                      autoFocus
                    />
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="p-8 pt-0 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <QuickAction label="Check Status" onClick={() => setCommand("System status report")} />
              <QuickAction label="Generate Code" onClick={() => setCommand("Generate a Nexus handler")} />
              <QuickAction label="Sync Devices" onClick={() => setCommand("Sync all connected hardware")} />
              <QuickAction label="Clear Logs" onClick={() => setCommand("clear")} />
            </div>
            
            <form 
              onSubmit={handleCommand}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative bg-[#141414] border border-zinc-800 rounded-2xl flex items-center p-2">
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder={isListening ? "Listening for voice command..." : "Ask Nexus to code, test, or control your devices..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-zinc-100 placeholder:text-zinc-600"
                />
                {isListening && (
                  <div className="flex gap-1 px-4 items-center">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 4] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className={`w-0.5 bg-${themeColor}-500 rounded-full`}
                      />
                    ))}
                  </div>
                )}
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors"
                >
                  <Zap className="w-5 h-5 fill-current" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Status Panel */}
        <aside className="hidden xl:flex w-80 border-l border-zinc-800 bg-[#0d0d0d] p-6 flex-col gap-8 overflow-y-auto">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Day-to-Day Briefing
            </h2>
            <div className="space-y-4">
              <BriefingItem time="09:00" task="Neural Sync with Cloud" status="Done" />
              <BriefingItem time="11:30" task="Code Review: NexusCore" status="Pending" />
              <BriefingItem time="14:00" task="Hardware Health Check" status="Scheduled" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Overview
            </h2>
            
            <div className="space-y-4">
              <StatusCard 
                title="Desktop Control" 
                status={activeDevice === "pc" ? "Active" : "Standby"} 
                icon={<Monitor className="w-4 h-4" />}
                details="Windows 11 Pro • 32GB RAM"
                color={activeDevice === "pc" ? "blue" : "green"}
                active={activeDevice === "pc"}
              />
              <StatusCard 
                title="Mobile Sync" 
                status={activeDevice === "mobile" ? "Active" : "Connected"} 
                icon={<Smartphone className="w-4 h-4" />}
                details="iPhone 15 Pro • iOS 17.4"
                color={activeDevice === "mobile" ? "blue" : "green"}
                active={activeDevice === "mobile"}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Neural Load</h3>
              <span className="text-[10px] text-blue-400 font-mono">
                Current: {chartData[chartData.length - 1].usage}%
              </span>
            </div>
            <div className="h-24 w-full relative">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#2563eb" 
                      fillOpacity={1} 
                      fill="url(#colorUsage)" 
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Active Tasks
            </h3>
            <div className="space-y-4">
              <TaskItem 
                label="Code Generation" 
                progress={Math.floor(taskProgress.code)} 
                status={taskProgress.code === 100 ? "Completed" : "Optimizing"} 
              />
              <TaskItem 
                label="Unit Testing" 
                progress={Math.floor(taskProgress.test)} 
                status={taskProgress.test === 100 ? "Verified" : "Running"} 
              />
              <TaskItem 
                label="Mobile Deployment" 
                progress={Math.floor(taskProgress.deploy)} 
                status={taskProgress.deploy === 100 ? "Deployed" : taskProgress.deploy > 0 ? "Uploading" : "Queued"} 
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Connected Agents
            </h3>
            <div className="space-y-3">
              <AgentItem name="Nexus-Alpha" status="Primary" active />
              <AgentItem name="Nexus-Beta" status="Standby" />
              <AgentItem name="Nexus-Gamma" status="Offline" offline />
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-600/10">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Security Protocol</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                End-to-end encryption active. All local data is synchronized with secure vault.
              </p>
            </div>
            
            <div className="flex items-center justify-between px-2 text-[10px] text-zinc-600 font-mono">
              <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> 5G Stable</span>
              <span>v2.4.0-stable</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function NeuralGraph({ isThinking, themeColor }: { isThinking: boolean, themeColor: string }) {
  const colorMap: Record<string, string> = {
    blue: "#2563eb",
    red: "#dc2626",
    green: "#16a34a",
    purple: "#9333ea"
  };
  const activeColor = colorMap[themeColor];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-[600px] h-[600px] opacity-40">
        <motion.circle 
          cx="300" cy="300" r="100" 
          fill="none" stroke={activeColor} strokeWidth="1" strokeDasharray="5 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle 
          cx="300" cy="300" r="180" 
          fill="none" stroke={activeColor} strokeWidth="0.5" strokeDasharray="10 10"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        {/* Nodes */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const x = 300 + 180 * Math.cos((angle * Math.PI) / 180);
          const y = 300 + 180 * Math.sin((angle * Math.PI) / 180);
          return (
            <motion.circle 
              key={i}
              cx={x} cy={y} r="4"
              fill={isThinking ? activeColor : "#333"}
              animate={isThinking ? { r: [4, 8, 4], opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={`text-2xl font-bold tracking-tighter transition-colors duration-500 ${isThinking ? `text-${themeColor}-400` : 'text-zinc-700'}`}>
          NEURAL CORE
        </div>
        <div className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-[0.2em]">
          {isThinking ? 'Processing Synaptic Links...' : 'Core Idle'}
        </div>
      </div>
    </div>
  );
}

function MetricsCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div className="p-4 rounded-2xl bg-[#141414] border border-zinc-800">
      <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{title}</div>
      <div className="text-xl font-bold text-zinc-100">{value}</div>
      <div className={`text-[10px] mt-2 ${trend.startsWith('+') ? 'text-green-500' : trend === 'Stable' ? 'text-blue-500' : 'text-red-500'}`}>
        {trend}
      </div>
    </div>
  );
}

function AgentItem({ name, status, active = false, offline = false }: { name: string, status: string, active?: boolean, offline?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-zinc-800">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${offline ? 'bg-zinc-700' : active ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
        <span className={`text-xs font-medium ${offline ? 'text-zinc-600' : 'text-zinc-300'}`}>{name}</span>
      </div>
      <span className="text-[9px] font-bold uppercase text-zinc-600">{status}</span>
    </div>
  );
}

function NavIcon({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-3 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-zinc-800 text-blue-400 shadow-inner" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </button>
  );
}

function QuickAction({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 transition-all whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function StatusCard({ title, status, icon, details, color = "blue", active = false }: { title: string, status: string, icon: React.ReactNode, details: string, color?: "blue" | "green", active?: boolean }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500"
  };

  return (
    <div className={`p-4 rounded-2xl bg-[#141414] border transition-all duration-300 group ${
      active ? 'border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${colorClasses[color]}`}>
          {status}
        </span>
      </div>
      <h4 className="text-sm font-medium text-zinc-200">{title}</h4>
      <p className="text-[11px] text-zinc-500 mt-1">{details}</p>
    </div>
  );
}

function TaskItem({ label, progress, status }: { label: string, progress: number, status: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px]">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className="text-zinc-500 italic">{status}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
        />
      </div>
    </div>
  );
}

function SettingRow({ label, description, active = false, onClick }: { label: string, description: string, active?: boolean, onClick?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <h4 className="text-xs font-bold text-zinc-200">{label}</h4>
        <p className="text-[10px] text-zinc-500 mt-0.5">{description}</p>
      </div>
      <button 
        onClick={onClick}
        aria-pressed={active}
        className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function FileItem({ name, type, children, open = false, active = false, onClick }: { name: string, type: 'file' | 'folder', children?: React.ReactNode, open?: boolean, active?: boolean, onClick?: () => void }) {
  return (
    <div className="space-y-1">
      <div 
        onClick={onClick}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'}`}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          {type === 'folder' ? (
            <Layers className={`w-3.5 h-3.5 ${open ? 'text-blue-500' : 'text-zinc-600'}`} />
          ) : (
            <Code2 className="w-3.5 h-3.5 text-zinc-600" />
          )}
        </span>
        <span className="text-[11px] font-medium truncate">{name}</span>
      </div>
      {children && open && (
        <div className="pl-4 border-l border-zinc-800 ml-3.5 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function PaletteItem({ icon, label, shortcut }: { icon: React.ReactNode, label: string, shortcut: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/10 group cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-zinc-500 group-hover:text-blue-400 transition-colors">
          {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
        </div>
        <span className="text-xs text-zinc-400 group-hover:text-zinc-200">{label}</span>
      </div>
      <kbd className="text-[10px] font-mono text-zinc-600 group-hover:text-blue-500/50">{shortcut}</kbd>
    </div>
  );
}

function ModeButton({ mode, active, onClick }: { mode: NeuralMode, active: boolean, onClick: () => void }) {
  const colors = {
    balanced: "bg-blue-500",
    overdrive: "bg-red-500",
    stealth: "bg-green-500",
    quantum: "bg-purple-500"
  };

  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter transition-all ${
        active ? `${colors[mode]} text-white shadow-lg` : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {mode}
    </button>
  );
}

function MobileNavBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
        active ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 mb-2" })}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function BriefingItem({ time, task, status }: { time: string, task: string, status: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[#141414] border border-zinc-800">
      <div className="text-[10px] font-mono text-zinc-500">{time}</div>
      <div className="flex-1">
        <div className="text-[11px] font-medium text-zinc-300">{task}</div>
      </div>
      <div className={`text-[9px] font-bold uppercase ${status === 'Done' ? 'text-green-500' : 'text-zinc-600'}`}>
        {status}
      </div>
    </div>
  );
}
