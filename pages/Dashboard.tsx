
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AppState } from '../types';

interface DashboardProps {
  user: User;
  state: AppState;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, state, onLogout }) => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sections = [
    { name: 'Items', icon: 'fa-box', path: '/items', count: state.items.length },
    { name: 'Customers', icon: 'fa-users', path: '/customers', count: state.customers.length },
    { name: 'Quotations', icon: 'fa-file-invoice', path: '/quotations', count: state.quotations.length },
    { name: 'Invoices', icon: 'fa-file-invoice-dollar', path: '/invoices', count: state.invoices.length },
  ];

  if (user.role === 'Admin') {
    sections.push(
      { name: 'Company Information', icon: 'fa-building', path: '/company', count: 1 },
      { name: 'Users', icon: 'fa-user-shield', path: '#', count: state.users.length }
    );
  }

  const handlePrintList = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    if (path !== '#') {
      navigate(path);
      // We trigger print once navigated - in a real app you might pass a state flag
      // For this implementation, we simply navigate to the list where print is available.
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-sm font-mono text-blue-600 font-bold">
            {now.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 leading-none">{user.username}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.role} Rights</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </header>

      {/* Body - Section based layout */}
      <main className="flex-1 p-4 space-y-4 pb-24">
        {sections.map((section) => (
          <div 
            key={section.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => section.path !== '#' && navigate(section.path)}
          >
            <div className="px-4 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                 <i className={`fa-solid ${section.icon} text-blue-600`}></i>
                 <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">{section.name}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`${section.path}/new`); }}
                  className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm hover:bg-blue-700"
                  title="Add New"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
                <button 
                  onClick={(e) => handlePrintList(e, section.path)}
                  className="px-2 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm hover:bg-slate-700"
                >
                  PRINT LIST
                </button>
                <button 
                  onClick={(e) => handlePrintList(e, section.path)}
                  className="px-2 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm hover:bg-slate-700"
                >
                  PDF LIST
                </button>
              </div>
            </div>
            <div className="px-4 py-3 flex justify-between items-center bg-white">
                <span className="text-xs text-slate-400 font-medium italic">Click to view total records</span>
                <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full border border-blue-100">
                    {section.count} RECORDS
                </span>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 fixed bottom-0 left-0 right-0 flex justify-center items-center shadow-lg border-t border-slate-700">
        <p className="text-sm">
          Project by: <span className="text-white font-bold tracking-[0.2em] ml-1">AB SOLUTIONS</span>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
