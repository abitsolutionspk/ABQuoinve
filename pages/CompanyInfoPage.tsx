
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyInfo } from '../types';

interface CompanyInfoPageProps {
  company: CompanyInfo;
  onUpdate: (newData: CompanyInfo) => void;
}

const CompanyInfoPage: React.FC<CompanyInfoPageProps> = ({ company, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyInfo>({ ...company });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 className="text-xl font-bold">Company Information</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 border border-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 relative group">
              <img 
                src={formData.logo || './rslogo.png'} 
                alt="Rana Solar Logo" 
                className="w-full h-full object-contain p-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=RS+Logo';
                }}
              />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleLogoChange}
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">Change Logo</div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Default Brand: rslogo.png</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NTN No</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.ntn || ''}
                placeholder="e.g. A508897-1"
                onChange={e => setFormData({ ...formData, ntn: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile / Contact</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
          SAVE CHANGES
        </button>
      </form>
    </div>
  );
};

export default CompanyInfoPage;
