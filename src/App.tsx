/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Coins, 
  Terminal as TerminalIcon, 
  Image as ImageIcon, 
  Music, 
  Monitor, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Clock, 
  AlertTriangle,
  Play,
  Square,
  Network,
  Cpu,
  Github,
  Twitter,
  Send,
  HelpCircle,
  FolderOpen,
  TrendingUp
} from 'lucide-react';
import DesktopWindow from './components/DesktopWindow';
import MemeBoard from './components/MemeBoard';
import TerminalBuy from './components/TerminalBuy';
import JumpscareOverlay from './components/JumpscareOverlay';
import { 
  playStartupSound, 
  playHoverSound, 
  playClickSound, 
  playErrorSound, 
  playHuhSound, 
  startChiptuneLoop, 
  stopChiptuneLoop, 
  setChiptuneVolume,
  isChiptuneLoopPlaying 
} from './utils/audio';
import { RetroWindow } from './types';

// Initial windows configuration
const DEFAULT_WINDOWS: RetroWindow[] = [
  {
    id: 'about',
    title: 'README_HUH.TXT',
    isOpen: true,
    isMinimized: false,
    x: 60,
    y: 70,
    width: 520,
    height: 'auto',
    zIndex: 10,
  },
  {
    id: 'tokenomics',
    title: 'TOKEN_ECONOMY.XLS',
    isOpen: false,
    isMinimized: false,
    x: 120,
    y: 110,
    width: 480,
    height: 'auto',
    zIndex: 5,
  },
  {
    id: 'buy',
    title: 'SWAP_TERMINAL.EXE',
    isOpen: false,
    isMinimized: false,
    x: 180,
    y: 150,
    width: 560,
    height: 'auto',
    zIndex: 5,
  },
  {
    id: 'memeBoard',
    title: 'HUH_MEME_STUDIO.BMP',
    isOpen: false,
    isMinimized: false,
    x: 220,
    y: 80,
    width: 780,
    height: 'auto',
    zIndex: 5,
  },
  {
    id: 'mediaPlayer',
    title: 'HUH_SOUND_SYNTH.EXE',
    isOpen: false,
    isMinimized: false,
    x: 300,
    y: 180,
    width: 360,
    height: 'auto',
    zIndex: 5,
  },
  {
    id: 'dexscreener',
    title: 'LIVE_CHART.EXE',
    isOpen: false,
    isMinimized: false,
    x: 140,
    y: 120,
    width: 680,
    height: 'auto',
    zIndex: 5,
  }
];

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  
  const [windows, setWindows] = useState<RetroWindow[]>(DEFAULT_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('about');
  const [topZIndex, setTopZIndex] = useState(10);
  
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.04);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState('');
  
  // Jumpscare triggers
  const [jumpscareEdge, setJumpscareEdge] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);

  // Time effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle bios booting sequence
  const startBootSequence = () => {
    playClickSound();
    setIsBooting(true);
    
    const logs = [
      'AMIBIOS (C) 1992 American Megatrends, Inc.',
      'HUH-BIOS Date: 08/12/95 14:22:11 Ver: 0.12A',
      'CPU: Genuine Intel(R) i486 DX2 66 MHz',
      'Speed: Turbo Mode Engaged',
      'Memory Test: 640KB Base Memory OK',
      'Memory Test: 3072KB Extended Memory OK',
      'Checking IDE drives... DONE',
      'Found Hard Disk 0: HUH_CAT_TOKEN_100MB (DMA Enabled)',
      'Loading Boot Sector... DONE',
      'Starting HUH_CAT_OS v1.95...',
      'Starting Sound Blaster drivers...',
      'System initialized. Welcome to HUH CAT OS!'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBootLog((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            setIsBooted(true);
            playStartupSound();
            // Start background chiptune automatically on boot
            startChiptuneLoop(musicVolume);
            setIsMusicPlaying(true);
          }, 600);
        }
      }, index * 180);
    });
  };

  // Window Focus handling
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          const nextZ = topZIndex + 1;
          setTopZIndex(nextZ);
          return { ...win, zIndex: nextZ, isMinimized: false };
        }
        return win;
      })
    );
  };

  const openWindow = (id: string) => {
    playClickSound();
    setIsStartMenuOpen(false);
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isOpen: true, isMinimized: false };
        }
        return win;
      })
    );
    focusWindow(id);
  };

  const closeWindow = (id: string) => {
    playErrorSound(); // classic warning beep on close is funny
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isOpen: false };
        }
        return win;
      })
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isMinimized: true };
        }
        return win;
      })
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMinimize = (id: string) => {
    playClickSound();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized || !win.isOpen) {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            return { ...w, isOpen: true, isMinimized: false };
          }
          return w;
        })
      );
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, x, y };
        }
        return win;
      })
    );
  };

  // Music controls
  const handleToggleMusic = () => {
    playClickSound();
    if (isMusicPlaying) {
      stopChiptuneLoop();
      setIsMusicPlaying(false);
    } else {
      startChiptuneLoop(isMuted ? 0 : musicVolume);
      setIsMusicPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    if (val === 0) {
      setIsMuted(true);
      setChiptuneVolume(0);
    } else {
      setIsMuted(false);
      setChiptuneVolume(val);
    }
  };

  const handleToggleMute = () => {
    playClickSound();
    if (isMuted) {
      setIsMuted(false);
      setChiptuneVolume(musicVolume);
    } else {
      setIsMuted(true);
      setChiptuneVolume(0);
    }
  };

  // Trigger scary peeking cat on edge click
  const triggerJumpscare = (edge: 'left' | 'right' | 'top' | 'bottom') => {
    if (jumpscareEdge) return; // Prevent double trigger
    setJumpscareEdge(edge);
  };

  // Return to BIOS
  const triggerShutdown = () => {
    playErrorSound();
    setTimeout(() => {
      stopChiptuneLoop();
      setIsBooted(false);
      setIsBooting(false);
      setBootLog([]);
      setIsMusicPlaying(false);
    }, 400);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#008080] select-none text-black relative flex flex-col font-mono text-sm">
      
      {/* 1. BOOT / BIOS SCREEN */}
      {!isBooted && (
        <div className="absolute inset-0 bg-black z-[99999] flex flex-col justify-between p-6 text-green-500 font-mono select-text">
          <div className="max-w-3xl w-full mx-auto space-y-4">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-green-800 pb-3 text-xs">
              <div>
                <p className="font-bold text-sm">AWARD SOFTWARE, INC.</p>
                <p>AWARD MODULAR BIOS V4.51PG</p>
                <p>COPR. 1984-1995 AWARD SOFTWARE</p>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="border border-green-500 p-1 flex items-center gap-1.5 font-bold mb-1">
                  <Monitor size={14} className="animate-pulse" />
                  ENERGY STAR
                </div>
                <p>ECOLOGY DESIGNED</p>
              </div>
            </div>

            {/* Live boot sequence */}
            {!isBooting ? (
              <div className="space-y-4 py-8 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center sm:justify-start">
                  <div className="w-24 h-24 border-2 border-green-500 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-green-950">
                    <img 
                      src="https://sf4service.site/raw/img_tt7oojpm7.jpg" 
                      alt="HUH CAT LOGO" 
                      className="w-full h-full object-cover grayscale brightness-125 contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <h1 className="text-xl font-bold tracking-wider text-white">HUH CAT SYSTEM v1.95</h1>
                    <p className="text-xs text-green-400">Award Software PCI/ISA System Board</p>
                    <p className="text-xs text-green-400">Contract: RHC_HUH7xPxV9ret8R95Y90sMemeCatRobinhoodChain</p>
                  </div>
                </div>

                <div className="space-y-3 bg-green-950/40 p-4 border border-green-900 rounded">
                  <p className="text-sm text-yellow-300 font-bold">WARNING: AUDIO CHANNELS UNLOCKED</p>
                  <p className="text-xs text-green-300">
                    This website synthesizes fully custom retro 8-bit chip music and humorous sound-effects inside your browser. Clicking below boots up the system and unmutes the audio synthesizer.
                  </p>
                </div>

                {/* Clickable Boot button */}
                <button
                  onClick={startBootSequence}
                  className="px-6 py-3.5 bg-green-500 text-black font-bold text-sm hover:bg-green-400 active:scale-95 transition-all shadow-[4px_4px_0px_#14532d] uppercase inline-flex items-center gap-2 cursor-pointer"
                >
                  <Cpu size={16} className="animate-spin" />
                  BOOT HUH_CAT_OS.EXE
                </button>
              </div>
            ) : (
              /* Boot logging output */
              <div className="space-y-1.5 py-4 font-mono text-xs text-green-400 leading-relaxed text-left">
                {bootLog.map((log, index) => (
                  <p key={index} className="animate-fade-in">
                    {log.startsWith('CPU:') || log.includes('Welcome') 
                      ? <span className="text-white font-bold">&gt;&gt; {log}</span>
                      : `> ${log}`
                    }
                  </p>
                ))}
                <div className="inline-block w-2.5 h-4 bg-green-500 animate-pulse ml-1" />
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-green-800 border-t border-green-950 pt-3">
            Press DEL to enter Setup • ESC to skip memory test • $HUH MEME TOKEN COPR. 2026
          </div>
        </div>
      )}

      {/* 2. DYNAMIC SCARY CAT JUMPSCARE OVERLAY */}
      <JumpscareOverlay triggerEdge={jumpscareEdge} onClear={() => setJumpscareEdge(null)} />

      {/* 3. MAIN RETRO DESKTOP LAYOUT */}
      {isBooted && (
        <div className="flex-1 w-full h-full relative flex flex-col">
          
          {/* Desktop Wallpaper Section */}
          <div 
            id="desktop-wallpaper"
            className="flex-1 w-full relative overflow-hidden bg-gradient-to-b from-[#1084d0] via-[#3a99e0] to-[#50b0f0] p-4 flex flex-col md:flex-row items-start justify-start"
          >
            {/* The 1990 Mountain Graphic Landscape */}
            <div className="absolute inset-x-0 bottom-0 h-44 md:h-56 pointer-events-none select-none z-0">
              {/* Back Mountains (SVG drawn to replicate classic triangular 90s low-poly landscape) */}
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 text-[#215732] opacity-70">
                <polygon points="0,300 150,120 300,220 480,90 650,230 800,140 1000,300" fill="currentColor" />
              </svg>
              {/* Forefront Rolling Bliss Hills */}
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 text-[#2d7d46]">
                <path d="M0,300 Q180,180 350,220 T700,200 T1000,300 L1000,300 L0,300 Z" fill="currentColor" />
              </svg>
              {/* Mini pixel tree clusters */}
              <svg viewBox="0 0 10 15" className="absolute bottom-12 left-[15%] w-4 h-6 text-emerald-900 fill-current"><polygon points="5,0 10,15 0,15" /></svg>
              <svg viewBox="0 0 10 15" className="absolute bottom-10 left-[17%] w-3 h-5 text-emerald-950 fill-current"><polygon points="5,0 10,15 0,15" /></svg>
              <svg viewBox="0 0 10 15" className="absolute bottom-14 left-[54%] w-4 h-6 text-emerald-900 fill-current"><polygon points="5,0 10,15 0,15" /></svg>
              <svg viewBox="0 0 10 15" className="absolute bottom-11 left-[78%] w-3 h-5 text-emerald-950 fill-current"><polygon points="5,0 10,15 0,15" /></svg>
            </div>

            {/* GIANT "SHOCKED CAT" SUN IN THE SKY (The 1990s baby sun meme vibe, featuring the official logo!) */}
            <div className="absolute top-[8%] right-[10%] md:right-[25%] z-0 flex flex-col items-center select-none">
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center animate-pulse">
                {/* Sunrays */}
                <div className="absolute inset-0 bg-[#eab308]/20 rounded-full blur-2xl scale-125" />
                <div className="absolute inset-0 bg-[#facc15]/30 rounded-full scale-110 animate-spin" style={{ animationDuration: '40s' }} />
                
                {/* Sun center with the official HUH CAT logo! */}
                <div 
                  onClick={() => triggerJumpscare('bottom')}
                  onMouseEnter={playHoverSound}
                  className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-yellow-300 overflow-hidden shadow-2xl relative cursor-pointer z-10 transition-transform hover:scale-105"
                  title="CLICK ME FOR LUCK!"
                >
                  <img 
                    src="https://sf4service.site/raw/img_tt7oojpm7.jpg" 
                    alt="HUH CAT LOGO" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Scanlines overlay on logo for vintage CRT effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.04),_rgba(0,255,0,0.01),_rgba(0,0,255,0.04))] bg-[size:100%_4px,_6px_100%] pointer-events-none" />
                </div>
              </div>
              <div className="mt-2 bg-[#ffffd0] text-black text-[10px] font-bold border-2 border-black px-2 py-0.5 shadow-md flex items-center gap-1">
                <AlertTriangle size={10} className="text-red-500 animate-bounce" />
                <span>HUH?! SUN RISING!</span>
              </div>
            </div>

            {/* CRT TV Glitch scanlines across desktop background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none z-[1]" />

            {/* INTERACTIVE BACKGROUND EDGE-CLICK HOTSPOTS (Clicking these triggers jumpscare popups) */}
            {/* Left Edge Hotspot */}
            <div 
              onClick={() => triggerJumpscare('left')}
              className="absolute left-0 top-0 bottom-[40px] w-12 hover:bg-white/5 active:bg-white/10 cursor-col-resize z-40 transition-colors flex items-center justify-center group"
              title="Click edge for scary cat"
            >
              <div className="opacity-0 group-hover:opacity-40 text-white font-bold text-lg select-none">&lt;&lt;</div>
            </div>
            
            {/* Right Edge Hotspot */}
            <div 
              onClick={() => triggerJumpscare('right')}
              className="absolute right-0 top-0 bottom-[40px] w-12 hover:bg-white/5 active:bg-white/10 cursor-col-resize z-40 transition-colors flex items-center justify-center group"
              title="Click edge for scary cat"
            >
              <div className="opacity-0 group-hover:opacity-40 text-white font-bold text-lg select-none">&gt;&gt;</div>
            </div>
            
            {/* Top Edge Hotspot */}
            <div 
              onClick={() => triggerJumpscare('top')}
              className="absolute top-0 left-12 right-12 h-12 hover:bg-white/5 active:bg-white/10 cursor-row-resize z-40 transition-colors flex items-center justify-center group"
              title="Click edge for scary cat"
            >
              <div className="opacity-0 group-hover:opacity-40 text-white font-bold text-lg select-none">/\</div>
            </div>

            {/* Bottom Edge Hotspot */}
            <div 
              onClick={() => triggerJumpscare('bottom')}
              className="absolute bottom-[40px] left-12 right-12 h-12 hover:bg-white/5 active:bg-white/10 cursor-row-resize z-40 transition-colors flex items-center justify-center group"
              title="Click edge for scary cat"
            >
              <div className="opacity-0 group-hover:opacity-40 text-white font-bold text-lg select-none">\/</div>
            </div>

            {/* DESKTOP ICONS GRID (Left-aligned list) */}
            <div className="flex flex-col gap-4 md:gap-5 z-10 w-24 relative select-none max-h-[calc(100vh-140px)] flex-wrap content-start">
              {/* Desktop Shortcut: About txt */}
              <button
                onDoubleClick={() => openWindow('about')}
                onClick={() => openWindow('about')} // Double-tap fallback
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <FileText className="text-blue-800" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  README_HUH.txt
                </span>
              </button>

              {/* Desktop Shortcut: Tokenomics */}
              <button
                onDoubleClick={() => openWindow('tokenomics')}
                onClick={() => openWindow('tokenomics')}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <Coins className="text-emerald-800 animate-pulse" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  TOKENOMICS.xls
                </span>
              </button>

              {/* Desktop Shortcut: Swap Terminal */}
              <button
                onDoubleClick={() => openWindow('buy')}
                onClick={() => openWindow('buy')}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <TerminalIcon className="text-black" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  BUY_TERMINAL.exe
                </span>
              </button>

              {/* Desktop Shortcut: Meme Maker */}
              <button
                onDoubleClick={() => openWindow('memeBoard')}
                onClick={() => openWindow('memeBoard')}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <ImageIcon className="text-[#800080]" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  MEME_BOARD.bmp
                </span>
              </button>

              {/* Desktop Shortcut: Media Music Player */}
              <button
                onDoubleClick={() => openWindow('mediaPlayer')}
                onClick={() => openWindow('mediaPlayer')}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <Music className="text-red-700" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  SYNTH_PLAYER.exe
                </span>
              </button>

              {/* Desktop Shortcut: Live DexScreener Chart */}
              <button
                onDoubleClick={() => openWindow('dexscreener')}
                onClick={() => openWindow('dexscreener')}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <TrendingUp className="text-blue-600 animate-pulse" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  LIVE_CHART.exe
                </span>
              </button>

              {/* Recycle Bin */}
              <button
                onClick={() => { playErrorSound(); alert('Error: $HUH cannot be deleted. Rug-pull protection is strictly active!'); }}
                onMouseEnter={playHoverSound}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dfdfdf] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-1 group-hover:bg-white shadow">
                  <Trash2 className="text-[#808080]" size={32} />
                </div>
                <span className="text-xs text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1 font-bold group-hover:underline truncate w-24">
                  Recycle Bin
                </span>
              </button>
            </div>

            {/* ACTIVE WINDOW CONTAINERS */}
            
            {/* Window 1: ABOUT TXT */}
            <DesktopWindow
              id="about"
              title="README_HUH.TXT - Notepad"
              icon={<FileText size={14} className="text-blue-800" />}
              isOpen={windows.find(w => w.id === 'about')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'about')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'about')?.x ?? 60}
              y={windows.find(w => w.id === 'about')?.y ?? 70}
              width={windows.find(w => w.id === 'about')?.width ?? 520}
              height={windows.find(w => w.id === 'about')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'about')?.zIndex ?? 10}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-100 p-3 border-2 border-t-gray-400 border-l-gray-400 border-b-white border-r-white">
                  <img 
                    src="https://sf4service.site/raw/img_tt7oojpm7.jpg" 
                    alt="Logo" 
                    className="w-16 h-16 object-cover border border-black shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#000080]">HUH CAT ($HUH) MEME COIN</h3>
                    <p className="text-xs text-gray-600 mt-0.5">VINTAGE RELEASE v1.95</p>
                  </div>
                </div>

                <div className="text-xs space-y-3 leading-relaxed text-gray-800">
                  <p className="font-bold border-b border-gray-300 pb-1 text-[#000080]">--- GENERAL INTRODUCTION ---</p>
                  <p>
                    HUH CAT ($HUH) is the ultimate retro cryptocurrency inspired by the globally viral Shocked Cat meme, now launching exclusively on the high-performance <span className="font-bold text-[#00C805]">Robinhood Chain (RHC)</span>! In an era full of over-complicated utility tokens, AI buzzwords, and infinite roadmaps, HUH CAT represents the absolute pinnacle of human reaction: <span className="font-bold underline text-red-600">HUH?!</span>
                  </p>
                  <p>
                    We have teamed up with the zero-gas, high-speed ecosystem of the Robinhood Web3 Wallet to deliver $HUH directly to millions of traders. No complex DEX slippage configurations, no massive network gas, just pure nostalgic fun.
                  </p>

                  <p className="font-bold border-b border-gray-300 pb-1 text-[#000080]">--- ROBINHOOD ROADMAP ---</p>
                  <ul className="list-decimal list-inside space-y-1">
                    <li><span className="font-bold">Phase 1 (Robinhood Boot):</span> Deploy on Robinhood Chain, code synthetic audio chiptunes, activate instant swaps.</li>
                    <li><span className="font-bold">Phase 2 (Green Gold):</span> Scale viral X/Twitter caption campaigns, integrate directly with Robinhood Web3 DApp portals.</li>
                    <li><span className="font-bold">Phase 3 (Turbo Trading):</span> Release interactive caption mini-games and premium CRT theme dashboards.</li>
                  </ul>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => openWindow('buy')}
                    className="flex-1 py-1.5 px-3 bg-[#c0c0c0] hover:bg-green-100 text-black font-bold border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white text-xs cursor-pointer"
                  >
                    RUN BUY_TERMINAL.exe
                  </button>
                  <button
                    onMouseEnter={playHoverSound}
                    onClick={() => openWindow('tokenomics')}
                    className="flex-1 py-1.5 px-3 bg-[#c0c0c0] hover:bg-yellow-50 text-black font-bold border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white text-xs cursor-pointer"
                  >
                    VIEW TOKENOMICS
                  </button>
                </div>
              </div>
            </DesktopWindow>

            {/* Window 2: TOKENOMICS TABLE */}
            <DesktopWindow
              id="tokenomics"
              title="TOKEN_ECONOMY.XLS - Excel"
              icon={<Coins size={14} className="text-emerald-800" />}
              isOpen={windows.find(w => w.id === 'tokenomics')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'tokenomics')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'tokenomics')?.x ?? 120}
              y={windows.find(w => w.id === 'tokenomics')?.y ?? 110}
              width={windows.find(w => w.id === 'tokenomics')?.width ?? 480}
              height={windows.find(w => w.id === 'tokenomics')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'tokenomics')?.zIndex ?? 5}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-emerald-900 text-white p-2.5 font-bold flex justify-between items-center rounded-none border border-black">
                  <span>HUH_COIN Spreadsheet Ledger</span>
                  <Coins size={14} className="animate-pulse" />
                </div>

                <div className="border-2 border-gray-300">
                  {/* Grid layout pretending to be vintage Excel */}
                  <div className="grid grid-cols-12 bg-gray-200 border-b-2 border-gray-400 font-bold text-center divide-x divide-gray-300">
                    <div className="col-span-1 py-0.5 bg-gray-300"></div>
                    <div className="col-span-4 py-0.5">A (Metric)</div>
                    <div className="col-span-7 py-0.5">B (Value / Detail)</div>
                  </div>
                  
                  <div className="grid grid-cols-12 divide-x divide-gray-200 border-b border-gray-200">
                    <div className="col-span-1 py-1 text-center bg-gray-200 font-bold border-r border-gray-300">1</div>
                    <div className="col-span-4 p-1 font-bold text-[#000080]">Token Name</div>
                    <div className="col-span-7 p-1 text-emerald-800 font-bold">HUH CAT TOKEN ($HUH)</div>
                  </div>

                  <div className="grid grid-cols-12 divide-x divide-gray-200 border-b border-gray-200">
                    <div className="col-span-1 py-1 text-center bg-gray-200 font-bold border-r border-gray-300">2</div>
                    <div className="col-span-4 p-1 font-bold text-[#000080]">Total Supply</div>
                    <div className="col-span-7 p-1 font-bold text-gray-800">1,000,000,000 $HUH</div>
                  </div>

                  <div className="grid grid-cols-12 divide-x divide-gray-200 border-b border-gray-200">
                    <div className="col-span-1 py-1 text-center bg-gray-200 font-bold border-r border-gray-300">3</div>
                    <div className="col-span-4 p-1 font-bold text-[#000080]">Taxes</div>
                    <div className="col-span-7 p-1 text-green-700 font-bold">0% Buy / 0% Sell (Tax Free!)</div>
                  </div>

                  <div className="grid grid-cols-12 divide-x divide-gray-200 border-b border-gray-200">
                    <div className="col-span-1 py-1 text-center bg-gray-200 font-bold border-r border-gray-300">4</div>
                    <div className="col-span-4 p-1 font-bold text-[#000080]">Liquidity</div>
                    <div className="col-span-7 p-1 text-red-600 font-bold">100% Burned Keys (Zero Rugs)</div>
                  </div>

                  <div className="grid grid-cols-12 divide-x divide-gray-200">
                    <div className="col-span-1 py-1 text-center bg-gray-200 font-bold border-r border-gray-300">5</div>
                    <div className="col-span-4 p-1 font-bold text-[#000080]">Chain Target</div>
                    <div className="col-span-7 p-1 text-emerald-800 font-bold">Robinhood Web3 L2 Chain</div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border-2 border-dashed border-yellow-300 text-[11px] text-gray-700 leading-relaxed">
                  <span className="font-bold text-yellow-800 block mb-0.5">📊 SPECULATIVE CALCULATIONS:</span>
                  1 $HUH is theoretically worth 1 $HUH. Multi-variable spreadsheet modeling indicates that $HUH coin has the mathematical capability to induce mass confusion followed by rapid price discovery.
                </div>
              </div>
            </DesktopWindow>

            {/* Window 3: HOW TO BUY / SWAP TERMINAL */}
            <DesktopWindow
              id="buy"
              title="C:\DOS\SWAP_TERMINAL.EXE"
              icon={<TerminalIcon size={14} className="text-black" />}
              isOpen={windows.find(w => w.id === 'buy')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'buy')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'buy')?.x ?? 180}
              y={windows.find(w => w.id === 'buy')?.y ?? 150}
              width={windows.find(w => w.id === 'buy')?.width ?? 560}
              height={windows.find(w => w.id === 'buy')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'buy')?.zIndex ?? 5}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <TerminalBuy />
            </DesktopWindow>

            {/* Window 4: MEME BOARD CAPTIONATOR */}
            <DesktopWindow
              id="memeBoard"
              title="HUH_MEME_STUDIO.BMP - Paintbrush"
              icon={<ImageIcon size={14} className="text-[#800080]" />}
              isOpen={windows.find(w => w.id === 'memeBoard')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'memeBoard')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'memeBoard')?.x ?? 220}
              y={windows.find(w => w.id === 'memeBoard')?.y ?? 80}
              width={windows.find(w => w.id === 'memeBoard')?.width ?? 780}
              height={windows.find(w => w.id === 'memeBoard')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'memeBoard')?.zIndex ?? 5}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <MemeBoard />
            </DesktopWindow>

            {/* Window 5: MUSIC CHIPTUNE PLAYER */}
            <DesktopWindow
              id="mediaPlayer"
              title="HUH_SOUND_SYNTH.EXE - Media Player"
              icon={<Music size={14} className="text-red-700" />}
              isOpen={windows.find(w => w.id === 'mediaPlayer')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'mediaPlayer')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'mediaPlayer')?.x ?? 300}
              y={windows.find(w => w.id === 'mediaPlayer')?.y ?? 180}
              width={windows.find(w => w.id === 'mediaPlayer')?.width ?? 360}
              height={windows.find(w => w.id === 'mediaPlayer')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'mediaPlayer')?.zIndex ?? 5}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <div className="space-y-4 text-xs font-mono text-black">
                <div className="p-3 bg-black text-green-400 font-bold flex flex-col gap-1 border-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white">
                  <div className="flex justify-between text-[11px] text-green-500/80">
                    <span>TRACK: HUH_CHIPTUNE_8BIT.WAV</span>
                    <span>130 BPM</span>
                  </div>
                  {/* Custom Animated Equalizer Blocks */}
                  <div className="flex gap-1 h-12 items-end justify-center py-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                      <div
                        key={bar}
                        style={{
                          height: isMusicPlaying ? `${Math.floor(Math.random() * 95) + 5}%` : '8%',
                          transition: 'height 0.12s ease-in-out'
                        }}
                        className="flex-1 bg-green-400 min-h-[4px]"
                      />
                    ))}
                  </div>
                </div>

                {/* Media controls */}
                <div className="flex gap-2.5 items-center justify-center bg-gray-100 p-2.5 border border-gray-400">
                  <button
                    onMouseEnter={playHoverSound}
                    onClick={handleToggleMusic}
                    className={`p-2 flex items-center justify-center gap-1.5 font-bold flex-1 border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white cursor-pointer ${isMusicPlaying ? 'bg-green-100 text-green-800' : 'bg-[#c0c0c0]'}`}
                  >
                    {isMusicPlaying ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
                    <span>{isMusicPlaying ? 'STOP' : 'PLAY'}</span>
                  </button>

                  <button
                    onMouseEnter={playHoverSound}
                    onClick={handleToggleMute}
                    className="p-2 flex items-center justify-center bg-[#c0c0c0] hover:bg-gray-200 border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white cursor-pointer w-10"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex flex-col gap-1.5 p-2 bg-gray-50 border border-gray-300">
                  <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                    <span>SYNTH VOLUME</span>
                    <span>{Math.round(musicVolume * 100 * 20)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.05"
                    step="0.005"
                    value={musicVolume}
                    onChange={handleVolumeChange}
                    className="w-full accent-blue-800 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                  />
                </div>

                <div className="text-[10px] text-gray-500 text-center leading-relaxed">
                  *Our looping modular sound synthesis runs completely client-side in the Web Audio background, causing zero lagging to your general OS performance!
                </div>
              </div>
            </DesktopWindow>

            {/* Window 6: LIVE DEXSCREENER CHART */}
            <DesktopWindow
              id="dexscreener"
              title="LIVE_CHART.EXE - Robinhood Chain DexScreener"
              icon={<TrendingUp size={14} className="text-blue-600" />}
              isOpen={windows.find(w => w.id === 'dexscreener')?.isOpen ?? false}
              isMinimized={windows.find(w => w.id === 'dexscreener')?.isMinimized ?? false}
              x={windows.find(w => w.id === 'dexscreener')?.x ?? 140}
              y={windows.find(w => w.id === 'dexscreener')?.y ?? 120}
              width={windows.find(w => w.id === 'dexscreener')?.width ?? 680}
              height={windows.find(w => w.id === 'dexscreener')?.height ?? 'auto'}
              zIndex={windows.find(w => w.id === 'dexscreener')?.zIndex ?? 5}
              activeWindowId={activeWindowId}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onPositionChange={handlePositionChange}
            >
              <div className="space-y-4 text-xs font-mono text-black">
                {/* Vintage Title Info Bar */}
                <div className="p-2.5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-bold flex justify-between items-center border border-emerald-900 shadow-sm">
                  <span>ROBINHOOD CHAIN TRADING ENGINE v1.0</span>
                  <span className="text-[10px] text-green-300 animate-pulse">● LIVE DATA ON RHC-95</span>
                </div>

                {/* Real-time stats widgets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-[#dfdfdf] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                    <p className="text-[10px] text-[#000080] font-bold">TOKEN_PRICE USD</p>
                    <p className="text-sm font-black text-emerald-800">$0.004289</p>
                    <p className="text-[9px] text-green-600 font-bold">+18.5% (24H)</p>
                  </div>
                  <div className="p-2 bg-[#dfdfdf] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                    <p className="text-[10px] text-[#000080] font-bold">MARKETCAP</p>
                    <p className="text-sm font-black text-gray-900">$4,289,000</p>
                    <p className="text-[9px] text-gray-500 font-bold">Diluted Valuation</p>
                  </div>
                  <div className="p-2 bg-[#dfdfdf] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                    <p className="text-[10px] text-[#000080] font-bold">SUPPLY</p>
                    <p className="text-sm font-black text-gray-900">1,000,000,000</p>
                    <p className="text-[9px] text-emerald-700 font-bold">100% Circulating</p>
                  </div>
                  <div className="p-2 bg-[#dfdfdf] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
                    <p className="text-[10px] text-[#000080] font-bold">VOLUME (24H)</p>
                    <p className="text-sm font-black text-blue-800">$849,215</p>
                    <p className="text-[9px] text-blue-600 font-bold">Instant RHC Swaps</p>
                  </div>
                </div>

                {/* DexScreener Chart Frame Container */}
                <div className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-black aspect-[16/10] w-full relative overflow-hidden flex items-center justify-center">
                  <iframe 
                    src="https://dexscreener.com/ethereum/0x04Cde7AE44a37ebaB18c054E6FE5127C4A1eE4E8?embed=1&theme=light&trades=0&info=0"
                    className="absolute inset-0 w-full h-full border-none"
                    title="DexScreener Live Chart"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-2 bg-gray-100 border border-gray-400 text-center text-[10px] text-gray-700 leading-relaxed font-semibold">
                  Note: The live graph utilizes DexScreener&apos;s Web3 interactive embedding. Verify tokens and liquidity pairs using the official Robinhood Chain contract.
                </div>
              </div>
            </DesktopWindow>

          </div>

          {/* BOTTOM WINDOWS 95 TASKBAR */}
          <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex justify-between items-center px-1.5 z-[999] select-none">
            {/* Start Button & Left shortcuts */}
            <div className="flex items-center gap-1.5 relative">
              {/* The iconic Start button */}
              <button
                onMouseEnter={playHoverSound}
                onClick={() => { playClickSound(); setIsStartMenuOpen(!isStartMenuOpen); }}
                className={`
                  h-7 px-2.5 flex items-center gap-1.5 font-bold font-mono text-xs
                  border-2
                  cursor-pointer
                  ${isStartMenuOpen 
                    ? 'border-t-[#404040] border-l-[#404040] border-b-white border-r-white bg-[#dfdfdf]' 
                    : 'border-t-white border-l-white border-b-[#404040] border-r-[#404040] bg-[#c0c0c0]'
                  }
                `}
              >
                <div className="w-4.5 h-4.5 bg-blue-900 overflow-hidden flex items-center justify-center p-0.5 border border-black shadow flex-shrink-0">
                  <img 
                    src="https://sf4service.site/raw/img_tt7oojpm7.jpg" 
                    alt="Start Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span>Start</span>
              </button>

              {/* Classic Window shortcuts on taskbar */}
              <div className="flex flex-1 sm:flex-initial items-center gap-1 border-l border-[#808080] pl-1.5 h-7 overflow-x-auto max-w-[calc(100vw-170px)] sm:max-w-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {windows.map((win) => {
                  if (!win.isOpen) return null;
                  const isActive = activeWindowId === win.id;
                  return (
                    <button
                      key={win.id}
                      onMouseEnter={playHoverSound}
                      onClick={() => toggleMinimize(win.id)}
                      className={`
                        h-7 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-bold max-w-[80px] sm:max-w-[120px] truncate flex items-center gap-1 flex-shrink-0
                        border-2
                        cursor-pointer
                        ${isActive 
                          ? 'border-t-[#404040] border-l-[#404040] border-b-white border-r-white bg-[#dfdfdf] shadow-inner' 
                          : 'border-t-white border-l-white border-b-[#404040] border-r-[#404040] bg-[#c0c0c0]'
                        }
                      `}
                    >
                      <span className="truncate">{win.title.split(' - ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1995 START POPUP MENU */}
              {isStartMenuOpen && (
                <div 
                  className="absolute bottom-8 left-0 w-56 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] shadow-2xl flex flex-col z-[1000] font-mono text-xs text-black"
                >
                  {/* Left Side Accent Bar with Retro Text */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-t from-[#000080] to-[#1084d0] text-white flex items-end justify-center pb-2 select-none">
                    <span className="transform -rotate-90 origin-bottom-left translate-x-[4px] translate-y-[-12px] font-bold tracking-wider text-[11px]">
                      HUH_CAT_OS
                    </span>
                  </div>

                  {/* Right Side Options (with offsets for left accent bar) */}
                  <div className="pl-7 flex flex-col py-1">
                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('about')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>README_HUH.txt</span>
                    </button>

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('tokenomics')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Coins size={14} />
                      <span>TOKENOMICS.xls</span>
                    </button>

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('buy')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <TerminalIcon size={14} />
                      <span>SWAP_TERMINAL.exe</span>
                    </button>

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('memeBoard')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <ImageIcon size={14} />
                      <span>MEME_BOARD.bmp</span>
                    </button>

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('mediaPlayer')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Music size={14} />
                      <span>HUH_PLAYER.exe</span>
                    </button>

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={() => openWindow('dexscreener')}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingUp size={14} />
                      <span>LIVE_CHART.exe</span>
                    </button>

                    <hr className="border-t border-gray-400 border-b border-white my-1" />

                    {/* Official External Links */}
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Twitter size={14} />
                      <span>Twitter / X</span>
                    </a>

                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="w-full text-left py-1.5 px-3 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>Telegram Support</span>
                    </a>

                    <hr className="border-t border-gray-400 border-b border-white my-1" />

                    <button
                      onMouseEnter={playHoverSound}
                      onClick={triggerShutdown}
                      className="w-full text-left py-1.5 px-3 text-red-700 font-bold hover:bg-red-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Cpu size={14} />
                      <span>Restart BIOS...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Status Tray (Volume, Net, Clock) */}
            <div className="flex items-center gap-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-0.5 bg-[#c0c0c0] text-xs font-mono h-7">
              {/* Speaker status indicator */}
              <button 
                onClick={handleToggleMute}
                onMouseEnter={playHoverSound}
                className="hover:bg-gray-300 p-0.5"
                title={isMuted ? 'Unmute Synthesizer' : 'Mute Synthesizer'}
              >
                {isMuted ? <VolumeX size={13} className="text-red-700" /> : <Volume2 size={13} className="text-gray-800" />}
              </button>
              
              <Network size={13} className="text-gray-800" title="Novell Ethernet Online" />
              
              <div className="w-px h-4.5 bg-gray-400 mx-0.5" />
              
              <div className="flex items-center gap-1.5 font-bold" title="1995 System Clock">
                <Clock size={13} className="text-blue-900" />
                <span>{currentTime}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
