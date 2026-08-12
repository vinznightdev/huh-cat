/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playHuhSound, playJumpscareSound, playErrorSound } from '../utils/audio';

interface JumpscareOverlayProps {
  triggerEdge: 'left' | 'right' | 'top' | 'bottom' | null;
  onClear: () => void;
}

export default function JumpscareOverlay({ triggerEdge, onClear }: JumpscareOverlayProps) {
  const [activeEdge, setActiveEdge] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);

  useEffect(() => {
    if (triggerEdge) {
      setActiveEdge(triggerEdge);
      
      // Play a specific custom sound based on edge
      if (triggerEdge === 'left') {
        playHuhSound();
      } else if (triggerEdge === 'right') {
        playJumpscareSound();
      } else if (triggerEdge === 'top') {
        playErrorSound();
      } else if (triggerEdge === 'bottom') {
        playHuhSound();
        setTimeout(() => playHuhSound(), 200); // Double HUH!
      }

      // Auto dismiss after 2 seconds
      const timer = setTimeout(() => {
        setActiveEdge(null);
        onClear();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [triggerEdge, onClear]);

  // Setup layout variables based on side
  const getMotionProps = () => {
    switch (activeEdge) {
      case 'left':
        return {
          initial: { x: '-100%', y: '-50%' },
          animate: { x: '0%', y: '-50%' },
          exit: { x: '-100%', y: '-50%' },
          style: { left: 0, top: '50%', transform: 'translateY(-50%)' },
          class: 'flex items-center flex-row pl-2'
        };
      case 'right':
        return {
          initial: { x: '100%', y: '-50%' },
          animate: { x: '0%', y: '-50%' },
          exit: { x: '100%', y: '-50%' },
          style: { right: 0, top: '50%', transform: 'translateY(-50%)' },
          class: 'flex items-center flex-row-reverse pr-2'
        };
      case 'top':
        return {
          initial: { y: '-100%', x: '-50%' },
          animate: { y: '0%', x: '-50%' },
          exit: { y: '-100%', x: '-50%' },
          style: { top: 0, left: '50%', transform: 'translateX(-50%)' },
          class: 'flex flex-col items-center pt-2'
        };
      case 'bottom':
        return {
          initial: { y: '100%', x: '-50%' },
          animate: { y: '0%', x: '-50%' },
          exit: { y: '100%', x: '-50%' },
          style: { bottom: '40px', left: '50%', transform: 'translateX(-50%)' }, // Above retro taskbar
          class: 'flex flex-col-reverse items-center pb-2'
        };
      default:
        return {
          initial: {}, animate: {}, exit: {}, style: {}, class: ''
        };
    }
  };

  const motionProps = getMotionProps();

  // Dialog quotes for the funny cats
  const getQuote = () => {
    switch (activeEdge) {
      case 'left':
        return 'HUH?! DID YOU JUST CLICK ME?!';
      case 'right':
        return 'BUY $HUH COIN OR I SCREAM AGAIN!!!';
      case 'top':
        return 'DO NOT PANIC SELL! HUH?!?!';
      case 'bottom':
        return 'IS THIS REALTlME?! HUH?! HUH?!';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {activeEdge && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <motion.div
            initial={motionProps.initial}
            animate={motionProps.animate}
            exit={motionProps.exit}
            transition={{ type: 'spring', damping: 14, stiffness: 120 }}
            style={{
              position: 'absolute',
              ...motionProps.style,
            }}
            className={`w-[320px] sm:w-[400px] h-auto pointer-events-auto ${motionProps.class}`}
          >
            {/* Funny Cat Graphics (SVG-based for lightning performance and clean colors) */}
            <div className="w-40 h-40 flex-shrink-0 relative">
              {activeEdge === 'left' && (
                /* Left Cat: Shocked Derp Cat */
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  {/* Ears */}
                  <polygon points="10,60 10,20 40,45" fill="#52525b" stroke="#000" strokeWidth="3" />
                  <polygon points="10,20 10,60 40,45" fill="#f43f5e" /> {/* Inner ear */}
                  <polygon points="90,60 90,20 60,45" fill="#52525b" stroke="#000" strokeWidth="3" />
                  <polygon points="90,20 90,60 60,45" fill="#f43f5e" />
                  {/* Head */}
                  <ellipse cx="50" cy="65" rx="42" ry="30" fill="#71717a" stroke="#000" strokeWidth="3" />
                  {/* Shocked Eyes */}
                  <ellipse cx="32" cy="55" rx="14" ry="14" fill="#facc15" stroke="#000" strokeWidth="2.5" />
                  <circle cx="32" cy="55" r="4" fill="#000000" />
                  <ellipse cx="68" cy="55" rx="14" ry="14" fill="#facc15" stroke="#000" strokeWidth="2.5" />
                  <circle cx="68" cy="55" r="4" fill="#000000" />
                  {/* Nose */}
                  <polygon points="50,68 46,63 54,63" fill="#f43f5e" />
                  {/* Huge Open Mouth of Shock */}
                  <ellipse cx="50" cy="80" rx="10" ry="12" fill="#000000" />
                  <ellipse cx="50" cy="82" rx="7" ry="8" fill="#f43f5e" />
                  {/* Whiskers */}
                  <line x1="20" y1="68" x2="3" y2="65" stroke="#000" strokeWidth="2" />
                  <line x1="20" y1="72" x2="1" y2="74" stroke="#000" strokeWidth="2" />
                  <line x1="80" y1="68" x2="97" y2="65" stroke="#000" strokeWidth="2" />
                  <line x1="80" y1="72" x2="99" y2="74" stroke="#000" strokeWidth="2" />
                </svg>
              )}

              {activeEdge === 'right' && (
                /* Right Cat: Laser Eye Scary Black Cat */
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg scale-x-[-1]">
                  {/* Ears */}
                  <polygon points="10,60 5,10 40,40" fill="#18181b" stroke="#000" strokeWidth="3" />
                  <polygon points="90,60 95,10 60,40" fill="#18181b" stroke="#000" strokeWidth="3" />
                  {/* Head */}
                  <polygon points="50,25 92,55 80,95 20,95 8,55" fill="#27272a" stroke="#000" strokeWidth="3" />
                  {/* Glowing Laser Eyes */}
                  <circle cx="30" cy="55" r="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                  <circle cx="30" cy="55" r="5" fill="#ffffff" />
                  <circle cx="70" cy="55" r="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                  <circle cx="70" cy="55" r="5" fill="#ffffff" />
                  {/* Laser Beams emitting */}
                  <line x1="30" y1="55" x2="120" y2="35" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
                  <line x1="30" y1="55" x2="120" y2="35" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="70" y1="55" x2="120" y2="75" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
                  <line x1="70" y1="55" x2="120" y2="75" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  {/* Mouth with Fangs */}
                  <path d="M40,78 Q50,90 60,78" fill="none" stroke="#000" strokeWidth="3" />
                  <polygon points="43,78 46,84 48,78" fill="#ffffff" />
                  <polygon points="57,78 54,84 52,78" fill="#ffffff" />
                </svg>
              )}

              {activeEdge === 'top' && (
                /* Top Cat: Hanging upside down weird cat */
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg scale-y-[-1]">
                  {/* Ears */}
                  <polygon points="15,40 25,5 45,30" fill="#d97706" stroke="#000" strokeWidth="2" />
                  <polygon points="85,40 75,5 55,30" fill="#d97706" stroke="#000" strokeWidth="2" />
                  {/* Face */}
                  <circle cx="50" cy="50" r="35" fill="#f59e0b" stroke="#000" strokeWidth="3" />
                  {/* Crazy spiral eyes */}
                  <circle cx="35" cy="45" r="10" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  <path d="M35,39 A6,6 0 1,0 41,45" fill="none" stroke="#000" strokeWidth="2" />
                  <circle cx="65" cy="45" r="10" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  <path d="M65,39 A6,6 0 1,0 71,45" fill="none" stroke="#000" strokeWidth="2" />
                  {/* Nose & Mouth */}
                  <polygon points="50,55 47,51 53,51" fill="#f43f5e" />
                  <path d="M40,65 Q50,55 60,65" fill="none" stroke="#000" strokeWidth="2.5" />
                </svg>
              )}

              {activeEdge === 'bottom' && (
                /* Bottom Cat: Wide-eyed peeker with logo style */
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  {/* Face peeking over fence */}
                  <ellipse cx="50" cy="80" rx="45" ry="35" fill="#f472b6" stroke="#000" strokeWidth="3" /> {/* Pink cat */}
                  {/* Pointy pink ears */}
                  <polygon points="15,60 1,20 40,55" fill="#f472b6" stroke="#000" strokeWidth="3" />
                  <polygon points="85,60 99,20 60,55" fill="#f472b6" stroke="#000" strokeWidth="3" />
                  {/* Huge wide pupils */}
                  <circle cx="32" cy="70" r="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  <circle cx="32" cy="70" r="8" fill="#000000" />
                  <circle cx="30" cy="68" r="3" fill="#ffffff" /> {/* sparkle */}
                  <circle cx="68" cy="70" r="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
                  <circle cx="68" cy="70" r="8" fill="#000000" />
                  <circle cx="66" cy="68" r="3" fill="#ffffff" /> {/* sparkle */}
                  {/* Whiskers */}
                  <line x1="20" y1="80" x2="3" y2="82" stroke="#000" strokeWidth="2" />
                  <line x1="80" y1="80" x2="97" y2="82" stroke="#000" strokeWidth="2" />
                </svg>
              )}
            </div>

            {/* Comic Dialog Speech Bubble */}
            <div
              className={`
                relative
                max-w-[200px] sm:max-w-[230px]
                p-3.5
                bg-[#ffffd0]
                text-black
                font-bold
                font-mono
                text-xs
                border-2
                border-black
                rounded-lg
                shadow-md
                text-center
                animate-bounce
              `}
            >
              {/* Retro pointer notch */}
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ffffd0',
                  borderLeft: '2px solid black',
                  borderBottom: '2px solid black',
                  transform: activeEdge === 'left' 
                    ? 'rotate(45deg) translateY(-50%)' 
                    : activeEdge === 'right' 
                    ? 'rotate(-135deg) translateY(-50%)' 
                    : activeEdge === 'top'
                    ? 'rotate(135deg) translateX(-50%)'
                    : 'rotate(-45deg) translateX(-50%)',
                  left: activeEdge === 'left' ? '-7px' : activeEdge === 'right' ? 'auto' : '50%',
                  right: activeEdge === 'right' ? '-7px' : 'auto',
                  top: activeEdge === 'left' || activeEdge === 'right' ? '50%' : activeEdge === 'top' ? '-7px' : 'auto',
                  bottom: activeEdge === 'bottom' ? '-7px' : 'auto',
                }}
              />
              <span className="relative z-10 text-[11px] leading-tight block">{getQuote()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
