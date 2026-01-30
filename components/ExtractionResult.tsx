
import React, { useState } from 'react';
import { DocumentRecord, ExtractedData } from '../types';

interface ExtractionResultProps {
  record: DocumentRecord;
  onSave: (updatedRecord: DocumentRecord) => void;
  onCancel: () => void;
}

const ExtractionResult: React.FC<ExtractionResultProps> = ({ record, onSave, onCancel }) => {
  const [data, setData] = useState<ExtractedData>(record.extractedData);

  const handleFieldChange = (field: keyof ExtractedData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...record, extractedData: data, status: 'completed' });
  };

  const isPdf = record.mimeType === 'application/pdf';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      {/* Left Column: Document Preview */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
          Source Document
        </h3>
        <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm sticky top-6">
          <div className="aspect-[3/4] sm:aspect-[3/2] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-slate-100">
            {isPdf ? (
              <iframe 
                src={`${record.imageUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <img src={record.imageUrl} alt="Document" className="w-full h-full object-contain" />
            )}
          </div>
          <div className="p-4 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">File Name</span>
                <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{record.fileName}</span>
             </div>
             <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Scan Confidence</span>
                <span className={`text-sm font-bold ${data.confidence > 0.9 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {Math.round((data.confidence || 0.98) * 100)}%
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Verification Form */}
      <div className="lg:col-span-7 space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
          Verification
        </h3>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 gap-5">
            <FieldInput 
              label="Document Type" 
              value={data.documentType} 
              onChange={(v) => handleFieldChange('documentType', v as any)} 
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
            />
            <FieldInput 
              label="Full Name" 
              value={data.fullName || ''} 
              onChange={(v) => handleFieldChange('fullName', v)} 
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
            />
            <FieldInput 
              label="ID Number / Reference" 
              value={data.idNumber || ''} 
              onChange={(v) => handleFieldChange('idNumber', v)} 
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FieldInput 
                label="Date of Birth" 
                value={data.birthDate || ''} 
                type="date"
                onChange={(v) => handleFieldChange('birthDate', v)} 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z"></path></svg>}
              />
              <FieldInput 
                label="Expiry Date" 
                value={data.expiryDate || ''} 
                type="date"
                onChange={(v) => handleFieldChange('expiryDate', v)} 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
              />
            </div>

            <FieldInput 
              label="Address" 
              value={data.address || ''} 
              multiline
              onChange={(v) => handleFieldChange('address', v)} 
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
            />
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-stretch gap-4">
            <button 
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="whitespace-nowrap">Verify & Save Record</span>
            </button>
            <button 
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  multiline?: boolean;
  icon?: React.ReactNode;
}

const FieldInput: React.FC<FieldInputProps> = ({ label, value, onChange, type = 'text', multiline = false, icon }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {icon && <span className="opacity-70 group-focus-within:text-indigo-500 transition-colors">{icon}</span>}
      {label}
    </label>
    {multiline ? (
      <textarea 
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none leading-relaxed"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input 
        type={type}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export default ExtractionResult;
