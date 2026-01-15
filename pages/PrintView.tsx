
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppState } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PrintViewProps {
  state: AppState;
}

const PrintView: React.FC<PrintViewProps> = ({ state }) => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const collection = type === 'q' ? state.quotations : state.invoices;
  const doc = collection.find(d => d.id === id);
  const customer = state.customers.find(c => c?.id === doc?.customerId);

  useEffect(() => {
    if (doc) {
      setTimeout(() => {
        // window.print();
      }, 500);
    }
  }, [doc]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('print-section');
    if (!element || !doc) return;
    
    const opt = {
      margin: 0,
      filename: `${doc.type}-${doc.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!doc) return <div className="p-20 text-center">Document not found</div>;

  return (
    <div className="bg-slate-200 min-h-screen py-10 no-print">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-4">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white px-4 py-2 rounded-lg shadow text-slate-600 font-bold flex items-center gap-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <div className="flex gap-3">
            <button 
                onClick={handleDownloadPDF} 
                className="bg-slate-800 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center gap-2"
            >
                <i className="fa-solid fa-file-pdf"></i> PDF
            </button>
            <button 
                onClick={() => window.print()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center gap-2"
            >
                <i className="fa-solid fa-print"></i> Print Now
            </button>
        </div>
      </div>

      <div id="print-section" className="a4-container mx-auto bg-white">
        <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-6">
            {state.company.logo && <img src={state.company.logo} alt="Logo" className="w-20 h-20 object-contain rounded" />}
            <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight">{state.company.name}</h1>
                <p className="text-slate-700 text-xs mt-2 font-medium">{state.company.address}</p>
                <div className="flex gap-4 mt-1">
                   <p className="text-slate-600 text-[11px] font-bold"><i className="fa-solid fa-phone-volume mr-1 text-blue-600"></i> {state.company.mobile}</p>
                </div>
                {state.company.ntn && (
                  <p className="text-slate-800 text-[11px] font-black mt-1 uppercase">NTN NO: {state.company.ntn}</p>
                )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-blue-600 uppercase tracking-tighter mb-1">
                {doc.type}
            </h2>
            <p className="text-slate-900 font-black text-sm">DOC #: {doc.number}</p>
            <p className="text-slate-500 text-[11px] font-bold">DATE: {doc.date}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-10">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 border-b border-blue-100 pb-1">BILLING TO CUSTOMER</p>
                <h3 className="text-lg font-black text-slate-900">{customer?.name}</h3>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{customer?.address}</p>
                <p className="text-slate-900 font-bold text-xs mt-2 italic"><i className="fa-solid fa-mobile-screen-button mr-1"></i> {customer?.mobile}</p>
            </div>
            <div className="flex flex-col justify-end text-right">
                 {/* Empty space for design balance */}
            </div>
        </div>

        <table className="w-full mb-10">
            <thead>
                <tr className="bg-slate-900 text-white">
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-left rounded-tl-lg">Item Description</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right">Qty</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-right rounded-tr-lg">Line Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-x border-b border-slate-200">
                {doc.items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-4 px-4">
                            <p className="font-black text-sm text-slate-900">{item.name}</p>
                        </td>
                        <td className="py-4 px-4 text-right text-xs font-bold text-slate-700">Rs {item.rate.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-xs font-black text-slate-900">{item.quantity}</td>
                        <td className="py-4 px-4 text-right font-black text-sm text-slate-900">Rs {item.total.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}></td>
                    <td className="py-6 text-right font-black text-slate-400 uppercase text-[10px] tracking-widest">SUBTOTAL</td>
                    <td className="py-6 px-4 text-right font-black text-sm text-slate-900">Rs {doc.totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-t-2 border-slate-900">
                    <td colSpan={2}></td>
                    <td className="py-4 text-right font-black text-slate-900 uppercase text-xs tracking-widest">GRAND TOTAL</td>
                    <td className="py-4 px-4 text-right font-black text-blue-600 text-2xl">Rs {doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            </tfoot>
        </table>

        <div className="mt-20 pt-10 text-center border-t border-slate-100">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2">
                THANK YOU FOR YOUR BUSINESS
            </p>
            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.1em]">
                This is a computer generated document - RANA SOLAR SYSTEM
            </p>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
