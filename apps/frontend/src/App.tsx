
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import BrandingGallery from './components/BrandingGallery';
import { AgentResult, HotelFormValues } from '../../../shared/types';
import { runRoaAgent } from './services/apiAdapter';

const App: React.FC = () => {
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showBranding, setShowBranding] = useState(false);

  const getFriendlyErrorMessage = (error: any): string => {
    const msg = error?.message || error?.toString() || '';
    
    // Check for common Gemini/Network scenarios
    if (msg.includes('API_KEY') || msg.includes('API Key')) {
      return "System Configuration Error: The API Key is missing or invalid. Please check your environment variables.";
    }
    if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
        return "Usage Limit Exceeded: The system is experiencing high demand. Please try again in a minute.";
    }
    if (msg.includes('503') || msg.includes('500')) {
        return "Service Unavailable: The AI service is temporarily down. Please try again later.";
    }
    if (msg.toLowerCase().includes('fetch failed') || msg.toLowerCase().includes('network')) {
        return "Connection Error: Unable to reach the server. Please check your internet connection.";
    }
    if (msg.toLowerCase().includes('safety')) {
        return "Content Safety: The request was blocked by safety settings. Please refine your input.";
    }
    
    return msg || "An unexpected error occurred. Please try again.";
  };

  const handleFormSubmit = async (values: HotelFormValues) => {
    setLoading(true);
    setError(null);
    setStatusMessage('Connecting to ROA Agent...');
    
    try {
      const agentResult = await runRoaAgent(values, (status) => {
        setStatusMessage(status);
      });
      setResult(agentResult);
    } catch (err: any) {
      console.error("Agent Error:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowBranding(false)}>
              {/* Official Logo: The Apex Z */}
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-500 overflow-hidden relative shadow-inner">
                 <svg viewBox="0 0 100 100" className="w-6 h-6 fill-emerald-500">
                    <path d="M10 80 L40 80 L70 20 L90 20 L90 10 L60 10 L30 70 L10 70 Z" />
                    <path d="M10 20 L40 20 L50 40 L35 40 L25 20 Z" opacity="0.7" />
                 </svg>
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-white">Zenith<span className="text-emerald-500">Stays</span></h1>
                <p className="text-xs text-slate-400 -mt-1">ROA System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               <button 
                 onClick={() => setShowBranding(!showBranding)}
                 className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${showBranding ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}`}
               >
                 Brand Kit
               </button>
               <span className="hidden md:inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-700">
                 System Status: ONLINE
               </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-fade-in relative">
            <div className="flex justify-between items-start">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Optimization Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button 
                    onClick={() => setError(null)}
                    className="ml-4 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Close error message"
                >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
          </div>
        )}

        {/* Loading Overlay State */}
        {loading && (
           <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-emerald-600 font-bold text-xs">AI</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Analyzing Revenue Streams</h3>
                    <p className="text-slate-500 mt-2 font-mono text-sm h-6 transition-all duration-300">
                      {statusMessage}
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-1/2 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
             </div>
           </div>
        )}

        {showBranding ? (
            <BrandingGallery />
        ) : !result ? (
          <div className="max-w-3xl mx-auto">
             <div className="mb-8 text-center">
               <h2 className="text-3xl font-bold text-slate-900">Unlock Property Potential</h2>
               <p className="mt-3 text-lg text-slate-600">
                 The Enterprise Revenue Optimization Agent uses advanced market data and predictive AI 
                 to generate actionable strategies for your hotel.
               </p>
             </div>
             <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>
        ) : (
          <Dashboard result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
