'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function FindMyFitPage() {
  const { theme } = useTheme(); 
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [personFile, setPersonFile] = useState(null);
  const [previewPerson, setPreviewPerson] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const testProducts = [{ id: 't1', name: 'PREMIUM CORE TEE', image: '/download (1).jpg' }];

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleTryOn = async () => {
    if (!personFile || !selectedProduct) return setError('Please select your photo and garment.');
    const token = localStorage.getItem('token') || user?.token;
    if (!token) return setError('Authentication required.');

    setLoading(true);
    setError('');
    setStatus('Tailoring your fit...');

    try {
      const personBase64 = await toBase64(personFile);
      const response = await fetch(selectedProduct.image);
      const blob = await response.blob();
      const garmentBase64 = await toBase64(blob);

      const { data } = await axios.post(
        'http://localhost:5000/api/try-on',
        { personImage: personBase64, garmentImage: garmentBase64, description: selectedProduct.name },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (data && data.resultImage) setResultImage(data.resultImage);
    } catch (err) {
      setError('Neural Engine Busy. Try again.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      theme === 'dark' 
      ? 'bg-[#020617] text-white' 
      : 'bg-[#f8fafc] text-slate-900'
    } p-6 md:p-12 selection:bg-blue-500`}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] transition-all duration-1000 ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-400/10'
        }`}></div>
        <div className={`absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] transition-all duration-1000 ${
            theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-400/10'
        }`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-10 transition-colors duration-1000 ${
            theme === 'dark' ? 'border-white/5' : 'border-slate-200'
        }">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                FITTING<span className="text-blue-600">ROOM</span>
            </h1>
            <p className="text-[10px] tracking-[0.7em] font-bold opacity-40 uppercase">A.I Virtual Atelier</p>
          </div>
          <div className="hidden lg:block text-right">
             <p className="text-[9px] font-black uppercase tracking-widest opacity-30 leading-loose">
               Neural Rendering Engine<br />Stable Diffusion v3.5
             </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          <div className="space-y-16">
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                    theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>01</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Your Portrait</h3>
              </div>
              
              <label className={`group relative block aspect-[4/5] rounded-[3rem] border-2 border-dashed transition-all duration-700 overflow-hidden cursor-pointer shadow-2xl ${
                theme === 'dark' 
                ? 'bg-slate-900/40 border-slate-700 hover:border-blue-500 hover:shadow-blue-500/10' 
                : 'bg-white border-slate-200 hover:border-blue-500 shadow-slate-200'
              }`}>
                {previewPerson ? (
                  <img src={previewPerson} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center text-4xl font-thin">+</div>
                    <p className="text-[9px] font-black uppercase tracking-widest">Select High-Res Image</p>
                  </div>
                )}
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) {
                    setPersonFile(file);
                    setPreviewPerson(URL.createObjectURL(file));
                  }
                }} />
              </label>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                    theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>02</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Product</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {testProducts.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedProduct(p)}
                    className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex items-center justify-between group ${
                      selectedProduct?.id === p.id 
                      ? 'border-blue-600 bg-blue-600/5 shadow-2xl scale-[1.02]' 
                      : (theme === 'dark' ? 'bg-slate-900/40 border-transparent hover:bg-slate-800' : 'bg-white border-transparent shadow-xl shadow-slate-200/50 hover:bg-slate-50')
                    }`}
                  >
                    <div className="flex items-center gap-8">
                        <div className={`p-4 rounded-2xl transition-colors ${theme === 'dark' ? 'bg-black/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                            <img src={p.image} className="w-24 h-24 object-contain" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest">{p.name}</p>
                            <p className="text-[9px] opacity-40 uppercase tracking-tighter italic">Winter Collection '26</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedProduct?.id === p.id ? 'border-blue-600 bg-blue-600' : 'border-current opacity-20'
                    }`}>
                        {selectedProduct?.id === p.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleTryOn} 
              disabled={loading}
              className={`w-full py-10 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[1.2em] transition-all transform active:scale-95 shadow-2xl ${
                theme === 'dark' 
                ? 'bg-white text-black hover:bg-blue-50 shadow-white/5' 
                : 'bg-slate-900 text-white hover:bg-black shadow-slate-400/50'
              }`}
            >
              {loading ? 'Processing Synthesis...' : 'Generate Look'}
            </button>
          </div>

          <div className="lg:sticky lg:top-12">
            <div className={`relative aspect-[3/4] w-full rounded-[4rem] border-4 transition-all duration-1000 overflow-hidden ${
              theme === 'dark' 
              ? 'bg-black/40 border-white/5 shadow-[0_0_100px_-20px_rgba(37,99,235,0.2)]' 
              : 'bg-white border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]'
            }`}>
              
              {loading && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-current/90 backdrop-blur-2xl">
                   <div className="w-24 h-24 relative">
                      <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-t-2 border-blue-600 rounded-full animate-spin"></div>
                   </div>
                   <p className="mt-10 text-[10px] font-black uppercase tracking-[1.5em] text-blue-500 animate-pulse ml-[1.5em]">{status}</p>
                </div>
              )}

              {resultImage ? (
                <img src={resultImage} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8">
                   <span className="text-[12px] font-black uppercase tracking-[2.5em] ml-[2.5em] -rotate-90 lg:rotate-0">Your aoutfif</span>
                   <div className="w-[1px] h-32 bg-current animate-pulse"></div>
                </div>
              )}

              <div className="absolute bottom-12 left-0 w-full text-center px-12">
                 <div className="flex items-center justify-between opacity-30 text-[8px] font-bold uppercase tracking-widest border-t pt-6 border-current/10">
                    <span>Result ID: 2026-X</span>
                    <span>Verified AI Fit</span>
                 </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-8 p-6 bg-red-600 text-white rounded-[2rem] shadow-2xl shadow-red-600/20 animate-bounce">
                <p className="text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}