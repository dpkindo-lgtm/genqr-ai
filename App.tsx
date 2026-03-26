import React, { useState } from 'react';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { Controls } from './components/Controls';
import { QRSettings, QRMode, QRErrorCorrectionLevel } from './types';
import { QrCode, Github } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<QRMode>(QRMode.MANUAL);
  
  const [qrSettings, setQrSettings] = useState<QRSettings>({
    value: 'https://gemini.google.com',
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: QRErrorCorrectionLevel.M,
    size: 256,
    includeMargin: true,
  });

  const updateSettings = (newSettings: Partial<QRSettings>) => {
    setQrSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <QrCode size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              GenQR AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <a 
               href="#" 
               className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2 text-sm"
             >
               <Github size={18} />
               <span className="hidden sm:inline">View Source</span>
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1 h-full">
            <Controls 
              settings={qrSettings}
              updateSettings={updateSettings}
              mode={mode}
              setMode={setMode}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
              
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {mode === QRMode.AI ? 'AI Generated Preview' : 'Live Preview'}
                </h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {mode === QRMode.AI 
                    ? 'Your description has been converted to a format optimized for scanning.'
                    : 'Customize colors and settings to match your brand identity.'}
                </p>
              </div>

              <QRCodeDisplay settings={qrSettings} />
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg text-center text-xs text-slate-500">
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="block font-semibold text-slate-300">Format</span>
                  {qrSettings.value.startsWith('WIFI:') ? 'WiFi Network' : 
                   qrSettings.value.startsWith('BEGIN:VCARD') ? 'Contact Card' :
                   qrSettings.value.startsWith('geo:') ? 'Location' : 
                   qrSettings.value.startsWith('mailto:') ? 'Email' : 'Text / URL'}
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                  <span className="block font-semibold text-slate-300">Size</span>
                  {qrSettings.size}x{qrSettings.size} px
                </div>
                <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                   <span className="block font-semibold text-slate-300">Correction</span>
                   Level {qrSettings.level}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GenQR AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;