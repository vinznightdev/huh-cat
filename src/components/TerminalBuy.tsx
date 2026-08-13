/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Play } from 'lucide-react';
import { playClickSound, playHoverSound, playErrorSound, playHuhSound } from '../utils/audio';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function TerminalBuy() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Microsoft(R) HUH-DOS Version 1.95', type: 'output' },
    { text: '(C) Copyright HUH CAT Corporation 1995-2026.', type: 'output' },
    { text: 'RAM: 640KB standard memory (TURBO ACTIVE)', type: 'output' },
    { text: 'Type HELP to see list of available commands or click quick-run options below.', type: 'success' },
    { text: '', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    playClickSound();

    const newLines: TerminalLine[] = [
      { text: `C:\\HUH_CAT> ${cmd}`, type: 'input' }
    ];

    switch (trimmed) {
      case 'help':
        newLines.push(
          { text: 'Available commands:', type: 'success' },
          { text: '  BUY        - Step-by-step instructions to buy $HUH', type: 'output' },
          { text: '  STATS      - Display current HUH CAT Tokenomics', type: 'output' },
          { text: '  MEME       - Summon the spirit of HUH CAT', type: 'output' },
          { text: '  CLEAR      - Clear the DOS screen', type: 'output' },
          { text: '  SYSTEM     - Print vintage hardware report', type: 'output' },
          { text: '  EXIT       - Close terminal screen', type: 'output' }
        );
        break;
      case 'buy':
        newLines.push(
          { text: '--- HOW TO BUY $HUH ON ROBINHOOD CHAIN ---', type: 'success' },
          { text: 'STEP 1: Open your Robinhood Web3 Wallet app or Robinhood account.', type: 'output' },
          { text: 'STEP 2: Switch network to the high-speed ROBINHOOD CHAIN (RHC).', type: 'output' },
          { text: 'STEP 3: Load funds (such as Robinhood-bridged ETH, SOL, or USDC).', type: 'output' },
          { text: 'STEP 4: Search for $HUH or paste the official RHC Contract Address:', type: 'output' },
          { text: '        [ 0x04Cde7AE44a37ebaB18c054E6FE5127C4A1eE4E8 ]', type: 'success' },
          { text: 'STEP 5: Swap instantly with zero fees! Welcome to the Robinhood HUH Crew!', type: 'success' }
        );
        break;
      case 'stats':
        newLines.push(
          { text: '--- $HUH TOKENOMICS (ROBINHOOD CHAIN) ---', type: 'success' },
          { text: 'Total Supply: 1,000,000,000 $HUH', type: 'output' },
          { text: 'Chain network: ROBINHOOD CHAIN (RHC-95)', type: 'success' },
          { text: 'Buy/Sell Tax: 0% (Pure Robinhood Energy)', type: 'output' },
          { text: 'Liquidity: 100% Locked on Robinhood AMM', type: 'success' },
          { text: 'Contract: Verified Robinhood Chain Assembly', type: 'output' }
        );
        break;
      case 'meme':
        playHuhSound();
        newLines.push(
          { text: '        \\_\\_      \\_\\_ ', type: 'success' },
          { text: '       ( o.o )   ( o.o )', type: 'success' },
          { text: '        > ^ <     > ^ < ', type: 'success' },
          { text: '   --- HUH?! HUH?! HUH?! ---', type: 'success' }
        );
        break;
      case 'system':
        newLines.push(
          { text: 'Processor: Intel i486 DX2 @ 66MHz', type: 'output' },
          { text: 'Coprocessor: Built-in Math coprocessor', type: 'output' },
          { text: 'Memory: 4096 KB Extended RAM', type: 'output' },
          { text: 'Video Card: Oak Technology OTI-077 Super VGA (512KB)', type: 'output' },
          { text: 'Sound Card: Sound Blaster 16 ASP', type: 'success' },
          { text: 'Network: Novell NE2000 Ethernet adapter', type: 'output' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      case 'exit':
        newLines.push({ text: 'Exiting... Just close the window frame!', type: 'error' });
        break;
      default:
        playErrorSound();
        newLines.push({
          text: `Bad command or file name: "${cmd}". Type HELP for available programs.`,
          type: 'error'
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines, { text: '', type: 'output' }]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono p-1 select-text">
      {/* Scrollable console screen */}
      <div className="flex-1 min-h-[220px] max-h-[360px] overflow-y-auto p-3 bg-black text-xs border-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white rounded-none leading-relaxed select-text">
        <div className="space-y-1">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap ${
                line.type === 'input'
                  ? 'text-white font-bold'
                  : line.type === 'error'
                  ? 'text-red-500 font-bold'
                  : line.type === 'success'
                  ? 'text-yellow-300'
                  : 'text-green-400'
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-1.5 mt-3 bg-black border-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white p-2">
        <span className="text-white font-bold text-xs">C:\HUH_CAT&gt;</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black text-white font-mono text-xs focus:outline-none caret-green-400 select-text"
          placeholder="Type 'help', 'buy', 'stats', or 'meme'..."
          maxLength={40}
        />
        <button
          onClick={() => executeCommand(inputValue)}
          onMouseEnter={playHoverSound}
          className="p-1 px-3 bg-green-900 text-green-200 text-[10px] font-bold border border-green-500 hover:bg-green-800 flex items-center gap-1"
        >
          <CornerDownLeft size={10} />
          RUN
        </button>
      </div>

      {/* Quick shortcuts buttons */}
      <div className="mt-3 flex flex-wrap gap-2 items-center bg-gray-900 p-2.5 border border-gray-800">
        <span className="text-[10px] text-gray-400 font-bold uppercase">QUICK MACROS:</span>
        <button
          onClick={() => executeCommand('help')}
          onMouseEnter={playHoverSound}
          className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 text-yellow-300 text-[10px] border border-gray-600 rounded flex items-center gap-1 cursor-pointer"
        >
          <Play size={8} />
          HELP.BAT
        </button>
        <button
          onClick={() => executeCommand('buy')}
          onMouseEnter={playHoverSound}
          className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 text-green-300 text-[10px] border border-gray-600 rounded flex items-center gap-1 cursor-pointer"
        >
          <Play size={8} />
          BUY_TUTORIAL.EXE
        </button>
        <button
          onClick={() => executeCommand('stats')}
          onMouseEnter={playHoverSound}
          className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 text-cyan-300 text-[10px] border border-gray-600 rounded flex items-center gap-1 cursor-pointer"
        >
          <Play size={8} />
          STATS_TABLE.COM
        </button>
        <button
          onClick={() => executeCommand('meme')}
          onMouseEnter={playHoverSound}
          className="py-0.5 px-2 bg-gray-800 hover:bg-gray-700 text-pink-300 text-[10px] border border-gray-600 rounded flex items-center gap-1 cursor-pointer"
        >
          <Play size={8} />
          HUH_CAT.MEME
        </button>
      </div>
    </div>
  );
}
