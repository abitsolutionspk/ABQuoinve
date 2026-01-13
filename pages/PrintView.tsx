
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppState } from '../types';

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
                onClick={() => window.print()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center gap-2"
            >
                <i className="fa-solid fa-print"></i> Print Now
            </button>
        </div>
      </div>

      <div id="print-section" className="a4-container mx-auto bg-white">
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-4">
            {state.company.logo && <img src={state.company.logo} alt="Logo" className="w-20 h-20 object-contain rounded" />}
            <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase leading-none">{state.company.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{state.company.address}</p>
                <p className="text-slate-500 text-sm">{state.company.mobile}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-2">
                {doc.type}
            </h2>
            <p className="text-slate-700 font-bold">#{doc.number}</p>
            <p className="text-slate-500 text-sm">Date: {doc.date}</p>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-10">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-1">Bill To</p>
                <h3 className="text-xl font-bold text-slate-800">{customer?.name}</h3>
                <p className="text-slate-500 mt-2">{customer?.address}</p>
                <p className="text-slate-500">{customer?.mobile}</p>
            </div>
            <div className="text-right flex flex-col justify-end">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount Due</p>
                    <p className="text-4xl font-black text-blue-600">Rs {doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>

        <table className="w-full mb-12">
            <thead>
                <tr className="border-b-2 border-slate-800 text-left">
                    <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
                    <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Rate</th>
                    <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Qty</th>
                    <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {doc.items.map((item, idx) => (
                    <tr key={idx}>
                        <td className="py-5">
                            <p className="font-bold text-slate-800">{item.name}</p>
                        </td>
                        <td className="py-5 text-right text-slate-600">Rs {item.rate.toLocaleString()}</td>
                        <td className="py-5 text-right text-slate-600">{item.quantity}</td>
                        <td className="py-5 text-right font-bold text-slate-800">Rs {item.total.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}></td>
                    <td className="py-8 text-right font-bold text-slate-400 uppercase text-xs">Subtotal</td>
                    <td className="py-8 text-right font-bold text-slate-800">Rs {doc.totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-t-2 border-slate-800">
                    <td colSpan={2}></td>
                    <td className="py-4 text-right font-black text-slate-800 uppercase text-lg">Total</td>
                    <td className="py-4 text-right font-black text-blue-600 text-2xl">Rs {doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            </tfoot>
        </table>

        <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 gap-10">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Notes</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                    1. Please pay within 15 days from the date of invoice.<br/>
                    2. Make all checks payable to {state.company.name}.<br/>
                    3. Quotations are valid for 30 days.
                </p>
            </div>
            <div className="text-right flex flex-col items-end justify-end">
                <div className="w-48 h-20 border-b border-slate-300 mb-2"></div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Authorized Signature</p>
            </div>
        </div>

        <div className="mt-auto pt-20 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                Generated by AB Solutions Professional Management Suite
            </p>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
