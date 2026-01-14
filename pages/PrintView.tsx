
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
        <div className="flex justify-between items-start mb-10 border-b pb-8">
          <div className="flex items-center gap-4">
            {state.company.logo && <img src={state.company.logo} alt="Logo" className="w-16 h-16 object-contain rounded" />}
            <div>
                <h1 className="text-xl font-bold text-slate-800 uppercase leading-none">{state.company.name}</h1>
                <p className="text-slate-500 text-[10px] mt-1">{state.company.address}</p>
                <p className="text-slate-500 text-[10px]">{state.company.mobile}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">
                {doc.type}
            </h2>
            <p className="text-slate-600 font-bold text-xs">#{doc.number}</p>
            <p className="text-slate-400 text-[10px]">Date: {doc.date}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-10">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">Bill To</p>
                <h3 className="text-lg font-bold text-slate-800">{customer?.name}</h3>
                <p className="text-slate-500 text-xs mt-1">{customer?.address}</p>
                <p className="text-slate-500 text-xs">{customer?.mobile}</p>
            </div>
        </div>

        <table className="w-full mb-10">
            <thead>
                <tr className="border-b border-slate-300 text-left">
                    <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                    <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Rate</th>
                    <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Qty</th>
                    <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-b border-slate-300">
                {doc.items.map((item, idx) => (
                    <tr key={idx}>
                        <td className="py-4">
                            <p className="font-bold text-sm text-slate-800">{item.name}</p>
                        </td>
                        <td className="py-4 text-right text-xs text-slate-600">Rs {item.rate.toLocaleString()}</td>
                        <td className="py-4 text-right text-xs text-slate-600">{item.quantity}</td>
                        <td className="py-4 text-right font-bold text-sm text-slate-800">Rs {item.total.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}></td>
                    <td className="py-6 text-right font-bold text-slate-400 uppercase text-[10px]">Subtotal</td>
                    <td className="py-6 text-right font-bold text-sm text-slate-800">Rs {doc.totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-t border-slate-300">
                    <td colSpan={2}></td>
                    <td className="py-4 text-right font-black text-slate-800 uppercase text-xs">Grand Total</td>
                    <td className="py-4 text-right font-black text-blue-600 text-xl">Rs {doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            </tfoot>
        </table>

        <div className="mt-auto pt-10 text-center border-t border-slate-100">
            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                This is a computer generated document - AB SOLUTIONS
            </p>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
