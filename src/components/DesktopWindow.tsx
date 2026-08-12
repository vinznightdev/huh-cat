/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { playClickSound, playHoverSound } from '../utils/audio';

interface DesktopWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  width: string | number;
  height: string | number;
  zIndex: number;
  activeWindowId: string | null;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function DesktopWindow({
  id,
  title,
  isOpen,
  isMinimized,
  x,
  y,
  width,
  height,
  zIndex,
  activeWindowId,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
  children,
  icon,
}: DesktopWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const isFocused = activeWindowId === id;
  const [isMaximized, setIsMaximized] = useState(false);

  // Position offset state during drag
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen || isMinimized) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag with left click and when clicking title bar (not buttons)
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('.window-control-btn')) return;

    onFocus(id);
    playClickSound();

    if (isMaximized || isMobile) return; // Can't drag maximized or mobile windows

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { x, y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStartPos.current.x;
      const dy = moveEvent.clientY - dragStartPos.current.y;
      
      // Keep inside reasonable screen bounds
      const nextX = Math.max(-100, Math.min(window.innerWidth - 100, windowStartPos.current.x + dx));
      const nextY = Math.max(0, Math.min(window.innerHeight - 80, windowStartPos.current.y + dy));
      
      onPositionChange(id, nextX, nextY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.window-control-btn')) return;

    onFocus(id);
    playClickSound();

    if (isMaximized || isMobile) return;

    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    windowStartPos.current = { x, y };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchMove = moveEvent.touches[0];
      const dx = touchMove.clientX - dragStartPos.current.x;
      const dy = touchMove.clientY - dragStartPos.current.y;
      
      const nextX = Math.max(-100, Math.min(window.innerWidth - 100, windowStartPos.current.x + dx));
      const nextY = Math.max(0, Math.min(window.innerHeight - 80, windowStartPos.current.y + dy));
      
      onPositionChange(id, nextX, nextY);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleToggleMaximize = () => {
    playClickSound();
    setIsMaximized(!isMaximized);
  };

  // Determine positions & sizes based on screen layout
  const finalLeft = isMobile ? '6px' : (isMaximized ? '0px' : `${x}px`);
  const finalTop = isMobile ? `${45 + (zIndex % 5) * 8}px` : (isMaximized ? '40px' : `${y}px`);
  const finalWidth = isMobile ? 'calc(100vw - 12px)' : (isMaximized ? '100%' : (typeof width === 'number' ? `${width}px` : width));
  const finalHeight = isMobile ? 'calc(100vh - 100px)' : (isMaximized ? 'calc(100vh - 80px)' : (typeof height === 'number' ? `${height}px` : height));

  return (
    <div
      ref={windowRef}
      id={`window-${id}`}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
      style={{
        position: 'absolute',
        left: finalLeft,
        top: finalTop,
        width: finalWidth,
        height: finalHeight,
        zIndex: zIndex,
      }}
      className={`
        flex flex-col
        bg-[#c0c0c0]
        text-black
        font-mono
        text-sm
        border-2
        border-t-white border-l-white border-b-[#404040] border-r-[#404040]
        shadow-[2px_2px_10px_rgba(0,0,0,0.5)]
        select-none
        transition-all duration-75
      `}
    >
      {/* 3D Inner Bevel Highlight */}
      <div className="absolute inset-0 pointer-events-none border border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]" />

      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          relative
          flex items-center justify-between
          px-2 py-1 m-1
          cursor-move
          ${isFocused 
            ? 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white' 
            : 'bg-[#808080] text-[#c0c0c0]'
          }
        `}
      >
        <div className="flex items-center gap-1.5 font-bold truncate select-none">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1 flex-shrink-0 z-10">
          {/* Minimize Button */}
          <button
            onMouseEnter={playHoverSound}
            onClick={(e) => { e.stopPropagation(); playClickSound(); onMinimize(id); }}
            className="window-control-btn flex items-center justify-center w-5 h-5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white p-0.5"
            title="Minimize"
          >
            <Minus size={10} className="stroke-[3]" />
          </button>

          {/* Maximize Button */}
          <button
            onMouseEnter={playHoverSound}
            onClick={(e) => { e.stopPropagation(); handleToggleMaximize(); }}
            className="window-control-btn flex items-center justify-center w-5 h-5 bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white p-0.5"
            title="Maximize"
          >
            <Square size={10} className="stroke-[3]" />
          </button>

          {/* Close Button */}
          <button
            onMouseEnter={playHoverSound}
            onClick={(e) => { e.stopPropagation(); playClickSound(); onClose(id); }}
            className="window-control-btn flex items-center justify-center w-5 h-5 ml-1 bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white p-0.5 hover:bg-red-600 hover:text-white"
            title="Close"
          >
            <X size={10} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Menu Options Bar (Classic Retro Menu: File, Edit, Help, etc.) */}
      <div className="flex gap-4 px-3 py-0.5 text-xs text-black border-b border-[#808080] mx-1">
        <span className="hover:underline cursor-pointer" onMouseEnter={playHoverSound}>File</span>
        <span className="hover:underline cursor-pointer" onMouseEnter={playHoverSound}>Edit</span>
        <span className="hover:underline cursor-pointer" onMouseEnter={playHoverSound}>View</span>
        <span className="hover:underline cursor-pointer" onMouseEnter={playHoverSound}>Help</span>
      </div>

      {/* Window Content */}
      <div className="flex-1 flex flex-col p-3 overflow-auto bg-white m-1.5 border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] relative">
        {children}
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 mx-1 mb-1 text-[11px] bg-[#c0c0c0] text-[#404040] border-t border-[#808080]">
        <span className="truncate">Status: Active</span>
        <span className="border-l border-[#808080] pl-2">1 object(s) selected</span>
      </div>
    </div>
  );
}
