import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { QRSettings } from '../types';
import { Download, Share2 } from 'lucide-react';

interface QRCodeDisplayProps {
  settings: QRSettings;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ settings }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const downloadQR = (format: 'png' | 'svg') => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const canvas = document.createElement('canvas');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      // Add padding for better PNG export
      const size = settings.size + 40; 
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      img.onload = () => {
        // Fill background
        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image centered
        ctx.drawImage(img, 20, 20, settings.size, settings.size);
        
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div 
        className="p-8 rounded-xl shadow-2xl transition-all duration-300"
        style={{ backgroundColor: settings.bgColor }}
        ref={containerRef}
      >
        <QRCode
          value={settings.value || "https://example.com"}
          bgColor={settings.bgColor}
          fgColor={settings.fgColor}
          size={settings.size}
          level={settings.level}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => downloadQR('png')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Download size={18} />
          <span>PNG</span>
        </button>
        <button
          onClick={() => downloadQR('svg')}
          className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-600"
        >
          <Share2 size={18} />
          <span>SVG</span>
        </button>
      </div>
    </div>
  );
};