/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Download, Volume2, Smile, RefreshCw, Layers } from 'lucide-react';
import { playHuhSound, playJumpscareSound, playErrorSound, playHoverSound, playClickSound } from '../utils/audio';

interface MemeTemplate {
  id: string;
  title: string;
  url: string;
}

const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'huh-original',
    title: 'Original HUH CAT',
    url: 'https://sf4service.site/raw/img_tt7oojpm7.jpg',
  },
  {
    id: 'retro-space',
    title: 'Space Shock Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'yellow-alert',
    title: 'Vintage Computer Yellow Cat',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
  }
];

export default function MemeBoard() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [topText, setTopText] = useState('WHEN YOU HEAR');
  const [bottomText, setBottomText] = useState('THE COIN PUMPED 1000%');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw meme when text or template changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS-friendly downloads
    img.src = selectedTemplate.url;

    img.onload = () => {
      // Clear canvas
      canvas.width = 400;
      canvas.height = 400;

      // Draw image scaled to fit
      ctx.drawImage(img, 0, 0, 400, 400);

      // Add retro CRT gridlines or scanlines slightly for aesthetic
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let y = 0; y < 400; y += 4) {
        ctx.fillRect(0, y, 400, 1.5);
      }

      // Format Impact Meme text
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'miter';
      ctx.textAlign = 'center';

      // Load font with fallback to heavy Arial/Impact
      ctx.font = '900 32px Impact, "Arial Black", sans-serif';

      // Top text
      ctx.textBaseline = 'top';
      const topWords = topText.toUpperCase();
      // Draw stroke first, then fill
      ctx.strokeText(topWords, 200, 15, 380);
      ctx.fillText(topWords, 200, 15, 380);

      // Bottom text
      ctx.textBaseline = 'bottom';
      const bottomWords = bottomText.toUpperCase();
      ctx.strokeText(bottomWords, 200, 385, 380);
      ctx.fillText(bottomWords, 200, 385, 380);

      setIsLoading(false);
    };

    img.onerror = () => {
      // Fallback text drawing if image fails to load
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#1e1b4b'; // deep retro indigo
      ctx.fillRect(0, 0, 400, 400);

      // Draw cartoon cat ears in SVG-like path
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(100, 250);
      ctx.lineTo(130, 150);
      ctx.lineTo(180, 220);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(300, 250);
      ctx.lineTo(270, 150);
      ctx.lineTo(220, 220);
      ctx.fill();

      // Big yellow shocked cat eyes
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(160, 220, 30, 0, Math.PI * 2);
      ctx.arc(240, 220, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(160, 220, 10, 0, Math.PI * 2);
      ctx.arc(240, 220, 10, 0, Math.PI * 2);
      ctx.fill();

      // Shocked mouth
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(200, 280, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px monospace';
      ctx.strokeText(topText.toUpperCase(), 200, 40, 380);
      ctx.fillText(topText.toUpperCase(), 200, 40, 380);
      ctx.strokeText(bottomText.toUpperCase(), 200, 360, 380);
      ctx.fillText(bottomText.toUpperCase(), 200, 360, 380);

      setIsLoading(false);
    };
  }, [selectedTemplate, topText, bottomText]);

  const handleDownload = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      const link = document.createElement('a');
      link.download = `huh_cat_meme_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('Could not download image. Right-click the meme and save it manually!');
    }
  };

  const playSfx = (type: 'huh' | 'screech' | 'error' | 'click') => {
    playClickSound();
    if (type === 'huh') playHuhSound();
    else if (type === 'screech') playJumpscareSound();
    else if (type === 'error') playErrorSound();
    else if (type === 'click') playClickSound();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full font-mono text-black">
      {/* Left panel: Meme Editor */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3 flex items-center gap-1.5 text-[#000080]">
            <Smile size={18} />
            MEME CAPTIONATOR v1.0
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed mb-4">
            Type top and bottom lines to create your custom HUH CAT meme, then click download to spread the $HUH message on X / Twitter!
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">TOP TEXT</label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="px-2 py-1.5 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-gray-50 focus:outline-none focus:bg-white text-xs uppercase"
              placeholder="e.g. WHEN SHE ASKS"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">BOTTOM TEXT</label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="px-2 py-1.5 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-gray-50 focus:outline-none focus:bg-white text-xs uppercase"
              placeholder="e.g. WHAT IS SLIPPAGE"
            />
          </div>
        </div>

        {/* Select Template */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-xs font-bold text-gray-700">SELECT CAT TEMPLATE</label>
          <div className="grid grid-cols-3 gap-2">
            {MEME_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onMouseEnter={playHoverSound}
                onClick={() => { playClickSound(); setSelectedTemplate(tpl); }}
                className={`
                  p-1 border text-[11px] text-center font-bold flex flex-col gap-1 items-center justify-between
                  ${selectedTemplate.id === tpl.id 
                    ? 'border-2 border-blue-800 bg-blue-50 text-blue-900' 
                    : 'border-gray-400 bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                <img src={tpl.url} alt={tpl.title} className="w-12 h-12 object-cover border border-gray-300" referrerPolicy="no-referrer" />
                <span className="truncate w-full text-center">{tpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onMouseEnter={playHoverSound}
          onClick={handleDownload}
          className="mt-auto py-2 bg-[#c0c0c0] text-black font-bold border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white hover:bg-green-100 flex items-center justify-center gap-2 text-xs"
        >
          <Download size={14} />
          EXPORT MEME (.PNG)
        </button>
      </div>

      {/* Right panel: Live Preview & Sounds */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 border-l border-dashed border-gray-300 pl-0 lg:pl-6 pt-6 lg:pt-0">
        <div className="relative group p-2 border-2 border-[#808080] bg-[#dfdfdf] shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[280px] sm:max-w-[320px] aspect-square object-contain border-2 border-t-black border-l-black border-b-white border-r-white bg-black"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs gap-2 font-mono">
              <RefreshCw className="animate-spin" size={16} />
              RENDERING MEME...
            </div>
          )}
        </div>

        {/* Retro Sound Board */}
        <div className="w-full bg-gray-100 border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-3 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-[#000080] border-b border-gray-300 pb-1 flex items-center gap-1.5">
            <Volume2 size={12} />
            HUH?! RETRO SOUND BOARD (Sfx Synthesizer)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onMouseEnter={playHoverSound}
              onClick={() => playSfx('huh')}
              className="py-1 px-2 text-[10px] bg-red-100 text-red-900 border border-red-300 font-bold hover:bg-red-200 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Volume2 size={12} />
              "HUH?!" VOCAL
            </button>
            <button
              onMouseEnter={playHoverSound}
              onClick={() => playSfx('screech')}
              className="py-1 px-2 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Volume2 size={12} />
              CAT SCREECH
            </button>
            <button
              onMouseEnter={playHoverSound}
              onClick={() => playSfx('error')}
              className="py-1 px-2 text-[10px] bg-blue-100 text-blue-900 border border-blue-300 font-bold hover:bg-blue-200 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Volume2 size={12} />
              WINDOWS ALERT
            </button>
            <button
              onMouseEnter={playHoverSound}
              onClick={() => playSfx('click')}
              className="py-1 px-2 text-[10px] bg-green-100 text-green-900 border border-green-300 font-bold hover:bg-green-200 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Volume2 size={12} />
              RETRO CLICK
            </button>
          </div>
          <span className="text-[9px] text-gray-500 text-center block mt-1">
            *Sounds are fully synthesized in real-time on your computer! No loading lags!
          </span>
        </div>
      </div>
    </div>
  );
}
