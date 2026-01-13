
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../types';

interface ListPageProps {
  type: 'items' | 'customers' | 'quotations' | 'invoices';
  data: any[];
  state: AppState;
  onUpdate: (newData: any[]) => void;
}

const ListPage: React.FC<ListPageProps> = ({ type, data, state, onUpdate }) => {
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const filtered = data.filter(item => item.id !== id);
      onUpdate(filtered);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCustomerName = (id: string) => {
    return state.customers.find(c => c.id === id)?.name || 'Unknown';
  };

  const getCustomerMobile = (id: string) => {
    return state.customers.find(c => c.id === id)?.mobile || '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-xl font-black capitalize tracking-tight text-slate-800">{type} List</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/${type}/new`)} className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700 transition-all">
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={handlePrint} className="bg-slate-800 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:bg-slate-700 transition-all">
            <i className="fa-solid fa-print"></i>
          </button>
          <button onClick={handlePrint} className="bg-slate-800 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md hover:bg-slate-700 transition-all">
            <i className="fa-solid fa-file-pdf"></i>
          </button>
        </div>
      </header>

      <main className="p-4 flex-1 space-y-3 pb-10" id="print-section">
        <div className="hidden print:block mb-8 border-b pb-4">
           <h1 className="text-2xl font-bold uppercase">{state.company.name} - {type} List</h1>
           <p className="text-slate-500 text-sm">{new Date().toLocaleDateString()}</p>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <i className="fa-solid fa-folder-open text-5xl mb-4 block opacity-20"></i>
            <p className="font-bold">No records found</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {type === 'items' && (
                    <>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                      <p className="text-blue-600 font-black mt-2">Rs {item.rate.toLocaleString()}</p>
                    </>
                  )}
                  {type === 'customers' && (
                    <>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.name}</h3>
                      <p className="text-sm font-bold text-slate-600 mt-1"><i className="fa-solid fa-phone mr-2 text-slate-300"></i>{item.mobile}</p>
                      <p className="text-xs text-slate-400 mt-1"><i className="fa-solid fa-location-dot mr-2 text-slate-300"></i>{item.address}</p>
                    </>
                  )}
                  {(type === 'quotations' || type === 'invoices') && (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{item.number}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{getCustomerName(item.customerId)}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">{getCustomerMobile(item.customerId)}</p>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs font-bold text-slate-400">Amount:</span>
                         <p className="text-lg font-black text-slate-900">Rs {item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 justify-end min-w-[120px] no-print ml-2">
                  <button 
                    onClick={() => navigate(`/${type}/edit/${item.id}`)}
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Open"
                  >
                    <i className="fa-solid fa-folder-open"></i>
                  </button>
                  
                  { (type === 'quotations' || type === 'invoices') && (
                    <button 
                      onClick={() => navigate(`/print/${type === 'quotations' ? 'q' : 'i'}/${item.id}`)}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                      title="Print"
                    >
                      <i className="fa-solid fa-print"></i>
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>

                  {(type === 'customers' || type === 'quotations' || type === 'invoices') && (
                    <>
                      <a 
                        href={`tel:${type === 'customers' ? item.mobile : getCustomerMobile(item.customerId)}`}
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Call"
                      >
                        <i className="fa-solid fa-phone"></i>
                      </a>
                      <a 
                        href={`https://wa.me/${(type === 'customers' ? item.mobile : getCustomerMobile(item.customerId)).replace(/\D/g,'')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xs hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ListPage;
