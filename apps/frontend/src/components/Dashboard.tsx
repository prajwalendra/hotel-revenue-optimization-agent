import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AgentResult } from '../../../../shared/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
  result: AgentResult;
  onReset: () => void;
}

const Dashboard: React.FC<Props> = ({ result, onReset }) => {
  const operatingData = result.operatingData;
  const marketData = result.marketData;

  const comparisonData = operatingData && marketData ? [
    {
      name: 'ADR',
      You: operatingData.last_30_days.adr,
      CompSet: marketData.competitive_set_metrics_simulated.adr_average,
    },
    {
      name: 'RevPAR',
      You: operatingData.last_30_days.revpar,
      CompSet: marketData.competitive_set_metrics_simulated.revpar_average,
    }
  ] : [];

  const eventChartData = marketData?.events_upcoming?.map(evt => ({
    name: evt.name,
    shortName: evt.name.length > 12 ? evt.name.substring(0, 12) + '...' : evt.name,
    attendees: evt.attendee_count_estimate,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Agent Report Generated</h2>
                <p className="text-sm text-slate-500">Based on live analysis of internal and market data sources</p>
            </div>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics Visualization (2/3 width on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Key Metrics Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Performance vs Market</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Legend />
                  <Bar dataKey="You" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="CompSet" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory/Events Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Demand Drivers</h3>
             
             {/* New Section: Event Impact Chart */}
             {eventChartData.length > 0 && (
               <div className="mb-6 pb-6 border-b border-slate-100">
                 <h4 className="text-xs font-semibold text-slate-400 mb-3">Estimated Impact (Attendees)</h4>
                 <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventChartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="shortName" width={80} tick={{fontSize: 10}} interval={0} />
                        <RechartsTooltip 
                          cursor={{fill: '#f1f5f9'}}
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        />
                        <Bar dataKey="attendees" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} name="Attendees" />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </div>
             )}

             {/* Existing List */}
             {marketData?.events_upcoming && marketData.events_upcoming.length > 0 ? (
                 <div className="space-y-3">
                     {marketData.events_upcoming.map((evt, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded text-xs text-center min-w-[50px]">
                                {evt.dates.split(' ')[0].slice(5)}
                             </div>
                             <div>
                                 <h4 className="text-sm font-semibold text-slate-800">{evt.name}</h4>
                                 <p className="text-xs text-slate-500">{evt.attendee_count_estimate.toLocaleString()} attendees • {evt.distance_from_hotel_km}km away</p>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <p className="text-sm text-slate-400 italic">No major events detected in the immediate window.</p>
             )}
          </div>
        </div>

        {/* Right Column: Agent Text Output (2/3 width) */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                    <span className="text-emerald-400 font-mono text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        ROA INTELLIGENCE
                    </span>
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Gemini 3 Pro</span>
                </div>
                <div className="p-8 prose prose-slate max-w-none overflow-y-auto">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                            li: ({node, ...props}) => <li className="marker:text-emerald-500" {...props} />,
                            p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                            table: ({node, ...props}) => (
                                <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 shadow-sm">
                                    <table className="min-w-full divide-y divide-slate-200" {...props} />
                                </div>
                            ),
                            thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                            tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-200" {...props} />,
                            tr: ({node, ...props}) => <tr className="hover:bg-slate-50 transition-colors" {...props} />,
                            th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap" {...props} />,
                            td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 border-t border-slate-100" {...props} />,
                        }}
                    >
                        {result.analysis}
                    </ReactMarkdown>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;