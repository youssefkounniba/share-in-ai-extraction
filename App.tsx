
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DocumentUpload from './components/DocumentUpload';
import ExtractionResult from './components/ExtractionResult';
import SignIn from './components/SignIn';
import { DocumentRecord, DocType, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'history'>('dashboard');
  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [currentProcessingRecord, setCurrentProcessingRecord] = useState<DocumentRecord | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check auth, load records, and handle magic link
  useEffect(() => {
    // 1. Handle Magic Link from URL
    const params = new URLSearchParams(window.location.search);
    const isLogin = params.get('login') === 'true';
    const loginEmail = params.get('email');

    if (isLogin && loginEmail) {
      const newUser: User = {
        email: loginEmail,
        name: loginEmail.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginEmail}`
      };
      setUser(newUser);
      localStorage.setItem('sharein_user', JSON.stringify(newUser));
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // 2. Load existing user session
      const savedUser = localStorage.getItem('sharein_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    // 3. Load records
    const savedRecords = localStorage.getItem('sharein_records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords).map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })));
    } else {
      // Mock data
      const mock: DocumentRecord[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 86400000),
          imageUrl: 'https://picsum.photos/400/300?random=1',
          mimeType: 'image/jpeg',
          fileName: 'id_scan_01.jpg',
          status: 'completed',
          extractedData: {
            documentType: DocType.CIN,
            fullName: 'Youssef Kounniba',
            idNumber: 'JE320144',
            birthDate: '2002-09-02',
            expiryDate: '2030-01-22',
            address: 'DR ID NGUIDA REGGADA TIZNIT',
            confidence: 0.99
          }
        }
      ];
      setRecords(mock);
      localStorage.setItem('sharein_records', JSON.stringify(mock));
    }
    setIsAuthLoading(false);
  }, []);

  const handleSignIn = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sharein_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sharein_user');
    setActiveTab('dashboard');
  };

  const handleProcessingComplete = (record: DocumentRecord) => {
    setCurrentProcessingRecord(record);
  };

  const handleSaveRecord = (record: DocumentRecord) => {
    const newRecords = [record, ...records];
    setRecords(newRecords);
    localStorage.setItem('sharein_records', JSON.stringify(newRecords));
    setCurrentProcessingRecord(null);
    setActiveTab('dashboard');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const renderContent = () => {
    if (currentProcessingRecord) {
      return (
        <ExtractionResult 
          record={currentProcessingRecord} 
          onSave={handleSaveRecord} 
          onCancel={() => setCurrentProcessingRecord(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard records={records} onNewExtraction={() => setActiveTab('upload')} />;
      case 'upload':
        return <DocumentUpload onProcessingComplete={handleProcessingComplete} />;
      case 'history':
        return (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">File</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Ref</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Processed</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-white`}>
                            {record.mimeType === 'application/pdf' ? (
                              <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /></svg>
                            ) : (
                              <img src={record.imageUrl} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-sm">{record.extractedData.documentType}</span>
                            <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors truncate max-w-[120px]">{record.fileName || 'document.file'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{record.extractedData.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.extractedData.idNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{record.timestamp.toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          record.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                          record.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {records.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-300">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                </div>
                <p className="text-slate-500 font-medium">Your document repository is empty.</p>
                <button onClick={() => setActiveTab('upload')} className="text-indigo-600 font-bold hover:underline">Process your first file</button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
