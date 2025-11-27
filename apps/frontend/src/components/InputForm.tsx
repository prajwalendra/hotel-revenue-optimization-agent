
import React, { useState } from 'react';
import { HotelCategory, HotelFormValues, OptimizationGoal, AgentTone } from '../../../../shared/types';

interface Props {
  onSubmit: (values: HotelFormValues) => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<HotelFormValues>({
    goal: OptimizationGoal.REVENUE_OPTIMIZATION,
    hotelName: 'The Grand Hyatt Nashville',
    location: 'Nashville, TN',
    category: HotelCategory.LUXURY,
    currentAdr: 250,
    currentRevPar: 200,
    currentOccupancy: 80,
    numberOfRooms: 450,
    agentTone: AgentTone.ANALYTICAL
  });

  const [errors, setErrors] = useState<Partial<Record<keyof HotelFormValues, string>>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof HotelFormValues, string>> = {};
    let isValid = true;

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel Name is required.';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
      isValid = false;
    }

    if (isNaN(formData.currentAdr) || formData.currentAdr <= 0) {
      newErrors.currentAdr = 'ADR must be a positive number greater than 0.';
      isValid = false;
    }

    if (isNaN(formData.currentRevPar) || formData.currentRevPar <= 0) {
      newErrors.currentRevPar = 'RevPAR must be a positive number greater than 0.';
      isValid = false;
    } else if (formData.currentRevPar > formData.currentAdr) {
      // Logical validation: RevPAR cannot mathematically exceed ADR (RevPAR = ADR * Occupancy %)
      // unless Occupancy > 100%, which is handled below.
      newErrors.currentRevPar = 'RevPAR cannot exceed the Average Daily Rate (ADR).';
      isValid = false;
    }

    if (isNaN(formData.currentOccupancy) || formData.currentOccupancy < 0 || formData.currentOccupancy > 100) {
      newErrors.currentOccupancy = 'Occupancy must be between 0 and 100.';
      isValid = false;
    }

    if (isNaN(formData.numberOfRooms) || formData.numberOfRooms <= 0 || !Number.isInteger(formData.numberOfRooms)) {
      newErrors.numberOfRooms = 'Number of Rooms must be a positive integer.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof HotelFormValues]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentAdr' || name === 'currentRevPar' || name === 'currentOccupancy' || name === 'numberOfRooms' 
        ? (value === '' ? NaN : parseFloat(value)) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const getInputClassName = (fieldName: keyof HotelFormValues) => `
    w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors
    ${errors[fieldName] ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
  `;

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1 animate-fade-in">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {message}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Property Configuration
        </h2>
        <p className="text-slate-400 text-sm mt-1">Enter current property metrics to initialize the agent.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Optimization Goal</label>
          <select 
            name="goal" 
            value={formData.goal} 
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50"
          >
            {Object.values(OptimizationGoal).map(goal => (
              <option key={goal} value={goal}>{goal}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Details</h3>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
              <input 
                type="text" 
                name="hotelName" 
                value={formData.hotelName} 
                onChange={handleChange}
                required
                className={getInputClassName('hotelName')}
              />
              <ErrorMessage message={errors.hotelName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location (City, State)</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                required
                className={getInputClassName('location')}
              />
              <ErrorMessage message={errors.location} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                {Object.values(HotelCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current ADR ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  name="currentAdr" 
                  value={isNaN(formData.currentAdr) ? '' : formData.currentAdr} 
                  onChange={handleChange}
                  className={getInputClassName('currentAdr')}
                />
                <ErrorMessage message={errors.currentAdr} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current RevPAR ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  name="currentRevPar" 
                  value={isNaN(formData.currentRevPar) ? '' : formData.currentRevPar} 
                  onChange={handleChange}
                  className={getInputClassName('currentRevPar')}
                />
                <ErrorMessage message={errors.currentRevPar} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Occupancy (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  name="currentOccupancy" 
                  value={isNaN(formData.currentOccupancy) ? '' : formData.currentOccupancy} 
                  onChange={handleChange}
                  className={getInputClassName('currentOccupancy')}
                />
                <ErrorMessage message={errors.currentOccupancy} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Rooms</label>
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  name="numberOfRooms" 
                  value={isNaN(formData.numberOfRooms) ? '' : formData.numberOfRooms} 
                  onChange={handleChange}
                  className={getInputClassName('numberOfRooms')}
                />
                <ErrorMessage message={errors.numberOfRooms} />
              </div>
            </div>
          </div>
        </div>

        {/* New Collapsible Configuration Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Advanced Agent Configuration
            </span>
            <svg 
              className={`w-4 h-4 text-slate-500 transition-transform ${showAdvanced ? 'transform rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showAdvanced && (
            <div className="p-4 bg-white space-y-3 animate-fade-in">
              <div className="space-y-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Agent Persona / Tone</label>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.values(AgentTone).map((tone) => (
                      <label 
                        key={tone} 
                        className={`
                          cursor-pointer flex items-center justify-center px-3 py-2 border rounded-md text-sm transition-all
                          ${formData.agentTone === tone 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'}
                        `}
                      >
                        <input 
                          type="radio" 
                          name="agentTone"
                          value={tone}
                          checked={formData.agentTone === tone}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {tone}
                      </label>
                    ))}
                 </div>
                 <p className="text-xs text-slate-400">
                   Adjusts how the agent presents its findings (e.g., highly analytical vs. executive summary).
                 </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all ${
              isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Initialize Optimization Agent
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
