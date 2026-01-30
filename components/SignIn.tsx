
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface SignInProps {
  onSignIn: (user: User) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(false);
  const [emailOpened, setEmailOpened] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isSent) {
      // Simulate the email "arriving" in the inbox after 2 seconds
      timer = setTimeout(() => {
        setShowSimulatedEmail(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSent]);

  const getMagicLink = () => {
    const origin = window.location.origin;
    return `${origin}/?login=true&email=${encodeURIComponent(email)}`;
  };

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1200);
  };

  const handleOpenMail = () => {
    const subject = "Magic Link for Share In";
    const body = `Welcome to Share In! \n\nClick the link below to sign in to your dashboard:\n\n${getMagicLink()}\n\nIf you didn't request this, you can safely ignore this email.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getMagicLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeLogin = () => {
    onSignIn({
      email: email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-8">
      {/* Main Sign In Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative z-10">
        <div className="p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-indigo-200">S</div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome to Share In</h1>
            <p className="text-slate-500 mt-2">Sign in to your profile with a magic link</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send Magic Link</>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400 italic mt-4">
                We'll generate a secure link to authenticate your session.
              </p>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-indigo-50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Check your inbox</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed px-4">
                  Verification link sent to <span className="font-semibold text-slate-800">{email}</span>.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleOpenMail}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  Open My Mail App
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-white text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <span className="text-emerald-600 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                       Link Copied!
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copy Link Manually
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setIsSent(false)}
                  className="w-full py-2 text-slate-400 text-sm hover:text-slate-600 font-medium underline underline-offset-4"
                >
                  Change email address
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Share In - Establishment Phase</p>
        </div>
      </div>

      {/* Simulated Inbox Experience */}
      {isSent && (
        <div className="w-full max-w-lg animate-in slide-in-from-bottom-12 duration-700 delay-300">
           <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-2xl overflow-hidden">
             <div className="bg-slate-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-4">Simulated Inbox: {email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Live Preview</span>
                </div>
             </div>

             <div className="p-4 min-h-[160px]">
                {!showSimulatedEmail ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 opacity-40">
                    <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-400 rounded-full animate-spin"></div>
                    <p className="text-xs font-medium text-slate-500">Waiting for incoming mail...</p>
                  </div>
                ) : !emailOpened ? (
                  <button 
                    onClick={() => setEmailOpened(true)}
                    className="w-full group bg-indigo-50 hover:bg-indigo-100 p-4 rounded-2xl border border-indigo-100 flex items-center gap-4 text-left transition-all animate-in zoom-in duration-300"
                  >
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <div className="flex items-center justify-between mb-0.5">
                          <p className="font-bold text-slate-800 text-sm">Share In Security</p>
                          <span className="text-[10px] font-bold text-indigo-500 bg-white px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-tighter">New Message</span>
                       </div>
                       <p className="text-xs font-semibold text-slate-600">Your Magic Link is ready!</p>
                       <p className="text-[10px] text-slate-400 truncate">Hi there! Use this secure link to sign in...</p>
                    </div>
                    <div className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </button>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                       <div className="flex items-center gap-2">
                          <button onClick={() => setEmailOpened(false)} className="p-1 hover:bg-slate-50 rounded text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                          <p className="font-bold text-slate-800 text-sm">Magic Link Request</p>
                       </div>
                       <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                    </div>
                    <div className="space-y-4">
                       <p className="text-xs text-slate-600 leading-relaxed">
                         Hello! You've requested a magic link to access <strong>Share In</strong>. Please click the button below to complete your sign-in.
                       </p>
                       <button 
                         onClick={executeLogin}
                         className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                       >
                         Complete Sign In
                       </button>
                       <p className="text-[9px] text-center text-slate-400">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                  </div>
                )}
             </div>
           </div>
           <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
             Prototype Mode: Visualizing the incoming email flow
           </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
