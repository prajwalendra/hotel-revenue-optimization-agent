
import React from 'react';

const BrandingGallery: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">Official Brand Identity</h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          ZenithStays Visual Identity System.
          <br />
          Featuring <strong>"The Apex Z"</strong> — symbolizing growth, revenue peaks, and structural stability.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* OFFICIAL LOGO: The Apex Z */}
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <svg viewBox="0 0 100 100" className="w-64 h-64 fill-slate-900">
                <path d="M10 80 L40 80 L70 20 L90 20 L90 10 L60 10 L30 70 L10 70 Z" />
                <path d="M10 20 L40 20 L50 40 L35 40 L25 20 Z" />
             </svg>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
            
            {/* Favicon / App Icon Variant */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">App Icon (Favicon)</span>
              <div className="w-32 h-32 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
                <svg viewBox="0 0 100 100" className="w-20 h-20 fill-emerald-500">
                  <path d="M10 80 L40 80 L70 20 L90 20 L90 10 L60 10 L30 70 L10 70 Z" />
                  <path d="M10 20 L40 20 L50 40 L35 40 L25 20 Z" opacity="0.7" />
                </svg>
              </div>
              <p className="text-xs text-slate-500 max-w-[140px] text-center">
                Optimized for small scales (tabs, mobile homescreens).
              </p>
            </div>

            <div className="hidden md:block w-px h-48 bg-slate-100"></div>

            {/* Full Logo Lockup */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Full Logotype</span>
              <div className="flex items-center gap-5 p-8 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 100 100" className="w-10 h-10 fill-emerald-500">
                        <path d="M10 80 L40 80 L70 20 L90 20 L90 10 L60 10 L30 70 L10 70 Z" />
                        <path d="M10 20 L40 20 L50 40 L35 40 L25 20 Z" opacity="0.7" />
                    </svg>
                 </div>
                 <div className="flex flex-col">
                    <h4 className="font-bold text-4xl text-slate-900 tracking-tight leading-none">Zenith<span className="text-emerald-600">Stays</span></h4>
                    <p className="text-xs text-slate-500 tracking-[0.3em] uppercase font-semibold mt-1">Revenue Optimization</p>
                 </div>
              </div>
               <p className="text-xs text-slate-500 max-w-[200px] text-center">
                Primary usage for application headers and marketing materials.
              </p>
            </div>

          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-bold text-slate-800">Emerald Green</h5>
                <p className="text-xs text-slate-500 font-mono mt-1">#10B981</p>
                <div className="w-full h-2 bg-emerald-500 mt-2 rounded-full"></div>
            </div>
             <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-bold text-slate-800">Slate Navy</h5>
                <p className="text-xs text-slate-500 font-mono mt-1">#0F172A</p>
                <div className="w-full h-2 bg-slate-900 mt-2 rounded-full"></div>
            </div>
             <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-bold text-slate-800">Pure White</h5>
                <p className="text-xs text-slate-500 font-mono mt-1">#FFFFFF</p>
                <div className="w-full h-2 bg-white border border-slate-200 mt-2 rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingGallery;
