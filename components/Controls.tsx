import React, { useState } from 'react';
import { QRSettings, QRMode, QRErrorCorrectionLevel } from '../types';
import { generateSmartQRContent } from '../services/geminiService';
import { Sparkles, Type, Settings2, RefreshCw, AlertCircle } from 'lucide-react';

interface ControlsProps {
  settings: QRSettings;
  updateSettings: (newSettings: Partial<QRSettings>) => void;
  mode: QRMode;
  setMode: (mode: QRMode) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, updateSettings, mode, setMode }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIRequest = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const smartContent = await generateSmartQRContent(aiPrompt);
      updateSettings({ value: smartContent });
    } catch (e) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="flex p-1 bg-slate-900 rounded-lg mb-6">
        <button
          onClick={() => setMode(QRMode.MANUAL)}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === QRMode.MANUAL
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type size={16} className="mr-2" />
          Manual Input
        </button>
        <button
          onClick={() => setMode(QRMode.AI)}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === QRMode.AI
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={16} className="mr-2" />
          AI Magic
        </button>
      </div>

      {/* Input Section */}
      <div className="mb-8 flex-grow">
        <label className="block text-slate-300 text-sm font-semibold mb-2">
          {mode === QRMode.MANUAL ? 'QR Content' : 'Describe your QR Code'}
        </label>
        
        {mode === QRMode.MANUAL ? (
          <textarea
            value={settings.value}
            onChange={(e) => updateSettings({ value: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all placeholder-slate-500"
            placeholder="https://example.com or plain text..."
          />
        ) : (
          <div className="space-y-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-purple-500/30 text-slate-100 rounded-lg p-3 h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all placeholder-slate-500"
              placeholder='e.g., "Create a WiFi code for NetworkName with password 12345" or "Create a contact card for John Doe, 555-0199, john@email.com"'
            />
            <button
              onClick={handleAIRequest}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-900/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Generate with Gemini
                </>
              )}
            </button>
            {error && (
              <div className="flex items-center text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded">
                <AlertCircle size={14} className="mr-1" />
                {error}
              </div>
            )}
            <div className="text-xs text-slate-400 mt-2 bg-slate-800/80 p-3 rounded border border-slate-700">
              <span className="font-semibold text-purple-400">AI Tip:</span> AI will format your text into standard protocols for WiFi, vCard, Email, SMS, or Geo-location automatically.
            </div>
          </div>
        )}
      </div>

      {/* Customization Section */}
      <div className="border-t border-slate-700 pt-6">
        <div className="flex items-center text-slate-200 font-semibold mb-4">
          <Settings2 size={18} className="mr-2" />
          Appearance & Settings
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Foreground Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.fgColor}
                onChange={(e) => updateSettings({ fgColor: e.target.value })}
                className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs text-slate-400 font-mono">{settings.fgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => updateSettings({ bgColor: e.target.value })}
                className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"
              />
               <span className="text-xs text-slate-400 font-mono">{settings.bgColor}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Error Correction</label>
            <select
              value={settings.level}
              onChange={(e) => updateSettings({ level: e.target.value as QRErrorCorrectionLevel })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value={QRErrorCorrectionLevel.L}>Low (7%)</option>
              <option value={QRErrorCorrectionLevel.M}>Medium (15%)</option>
              <option value={QRErrorCorrectionLevel.Q}>Quartile (25%)</option>
              <option value={QRErrorCorrectionLevel.H}>High (30%)</option>
            </select>
          </div>
          <div>
             <label className="block text-xs text-slate-400 mb-1">Size (px)</label>
             <input 
               type="range"
               min="128"
               max="512"
               step="32"
               value={settings.size}
               onChange={(e) => updateSettings({ size: parseInt(e.target.value) })}
               className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
             />
          </div>
        </div>
      </div>
    </div>
  );
};