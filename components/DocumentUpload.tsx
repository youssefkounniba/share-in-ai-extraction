
import React, { useState, useRef } from 'react';
import { extractDocumentData } from '../services/geminiService';
import { DocumentRecord } from '../types';

interface DocumentUploadProps {
  onProcessingComplete: (record: DocumentRecord) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onProcessingComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    "Uploading document...",
    "Scanning content for details...",
    "Analyzing structure...",
    "Extracting specific fields...",
    "Validating results with AI..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!preview || !file) return;

    setIsProcessing(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const base64Data = preview.split(',')[1];
      const result = await extractDocumentData(base64Data, file.type);
      
      const record: DocumentRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        imageUrl: preview,
        mimeType: file.type,
        fileName: file.name,
        extractedData: result,
        status: 'pending'
      };

      onProcessingComplete(record);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      clearInterval(stepInterval);
      setIsProcessing(false);
    }
  };

  const isPdf = file?.type === 'application/pdf';
  const fileSizeInMB = file ? (file.size / (1024 * 1024)).toFixed(2) : "0";

  if (isProcessing) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in zoom-in duration-300">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold">AI</div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-800">Processing {isPdf ? 'PDF' : 'Document'}</h3>
          <p className="text-slate-500 h-6 transition-all duration-500">{loadingSteps[loadingStep]}</p>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden max-w-xs">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
            style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors">
        {!preview ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800">Select Document File</p>
              <p className="text-slate-500 text-sm">Upload CIN, Driving License or Vehicle Registration</p>
            </div>
            <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Choose File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              {isPdf ? (
                <div className="w-full aspect-[3/2] flex flex-col items-center justify-center bg-indigo-50/30 py-10">
                  <svg className="w-24 h-24 text-indigo-500 mb-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                  <span className="font-bold text-slate-700 text-center px-6 leading-tight mb-1">{file?.name}</span>
                  <span className="text-sm text-indigo-600 font-medium">PDF File • {fileSizeInMB} MB</span>
                </div>
              ) : (
                <img src={preview} alt="Selected document" className="w-full aspect-[3/2] object-cover" />
              )}
              <button onClick={() => {setPreview(null); setFile(null);}} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-slate-600 hover:text-rose-600 shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={handleProcess} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                Extract Data
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white text-slate-700 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">
                Change File
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl animate-in shake duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div className="space-y-1">
              <p className="font-bold">Extraction Error</p>
              <p className="text-sm opacity-90 leading-relaxed">{error}</p>
              {error.toLowerCase().includes("key") && (
                <div className="mt-3 pt-3 border-t border-rose-200 text-xs font-medium space-y-1">
                  <p>Checklist:</p>
                  <ul className="list-disc ml-4">
                    <li>File is named exactly <code className="bg-rose-100 px-1">.env</code></li>
                    <li>Contains <code className="bg-rose-100 px-1">VITE_GEMINI_API_KEY=AIza...</code></li>
                    <li>Restarted terminal with <code className="bg-rose-100 px-1">npm run dev</code></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Features</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeatureCard icon="📄" title="PDF Support" desc="Extract from documents or scanned files" />
          <FeatureCard icon="✨" title="AI Precision" desc="Gemini-powered deep field extraction" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="font-bold text-slate-800 leading-none mb-1">{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default DocumentUpload;
