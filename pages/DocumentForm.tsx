
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState, Document, DocumentItem } from '../types';
// Fixed: Type must be imported from @google/genai, not from local types
import { GoogleGenAI, Type } from "@google/genai";

interface DocumentFormProps {
  type: 'Quotation' | 'Invoice';
  state: AppState;
  onUpdate: (newData: Document[]) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ type, state, onUpdate }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Omit<Document, 'id'>>({
    type,
    number: `${type === 'Quotation' ? 'QT' : 'INV'}-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    items: [],
    totalAmount: 0
  });

  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const [smartAddText, setSmartAddText] = useState('');
  const [isSmartLoading, setIsSmartLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const collection = type === 'Quotation' ? state.quotations : state.invoices;
      const existing = collection.find(d => d.id === id);
      if (existing) {
        setDoc({ ...existing });
      }
    }
  }, [id, state, type]);

  useEffect(() => {
    const item = state.items.find(i => i.id === selectedItemId);
    if (item) {
      setSelectedRate(item.rate);
    } else {
      setSelectedRate(0);
    }
  }, [selectedItemId, state.items]);

  const addItem = () => {
    const item = state.items.find(i => i.id === selectedItemId);
    if (item) {
      const newItem: DocumentItem = {
        itemId: item.id,
        name: item.name,
        rate: selectedRate,
        quantity: selectedQty,
        total: selectedRate * selectedQty
      };
      const updatedItems = [...doc.items, newItem];
      setDoc({
        ...doc,
        items: updatedItems,
        totalAmount: updatedItems.reduce((acc, curr) => acc + curr.total, 0)
      });
      setSelectedItemId('');
      setSelectedQty(1);
      setSelectedRate(0);
    }
  };

  const handleSmartAdd = async () => {
    if (!smartAddText.trim()) return;
    setIsSmartLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const availableItemsStr = state.items.map(i => `${i.id}: ${i.name}`).join(', ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on this list of available business items: [${availableItemsStr}], 
                  parse the following request: "${smartAddText}". 
                  Identify which items are being requested and in what quantity.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'The ID of the item' },
                qty: { type: Type.NUMBER, description: 'The quantity requested' }
              },
              required: ['id', 'qty']
            }
          }
        }
      });

      const result = JSON.parse(response.text || '[]');
      const newItems: DocumentItem[] = [];

      result.forEach((match: any) => {
        const originalItem = state.items.find(i => i.id === String(match.id));
        if (originalItem) {
          newItems.push({
            itemId: originalItem.id,
            name: originalItem.name,
            rate: originalItem.rate,
            quantity: match.qty || 1,
            total: originalItem.rate * (match.qty || 1)
          });
        }
      });

      if (newItems.length > 0) {
        const updatedItems = [...doc.items, ...newItems];
        setDoc({
          ...doc,
          items: updatedItems,
          totalAmount: updatedItems.reduce((acc, curr) => acc + curr.total, 0)
        });
        setSmartAddText('');
      } else {
        alert("AI couldn't find matching items in your inventory.");
      }
    } catch (error) {
      console.error("Smart Add Error:", error);
      alert("AI failed to process request.");
    } finally {
      setIsSmartLoading(false);
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = doc.items.filter((_, i) => i !== index);
    setDoc({
      ...doc,
      items: updatedItems,
      totalAmount: updatedItems.reduce((acc, curr) => acc + curr.total, 0)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doc.customerId === '' || doc.items.length === 0) {
      alert('Please select a customer and add at least one item.');
      return;
    }
    const collection = type === 'Quotation' ? state.quotations : state.invoices;
    if (id) {
      const updated = collection.map(d => d.id === id ? { ...d, ...doc } : d);
      onUpdate(updated);
    } else {
      const newDoc = { ...doc, id: Date.now().toString() };
      onUpdate([...collection, newDoc]);
    }
    navigate(`/${type.toLowerCase()}s`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(`/${type.toLowerCase()}s`)} className="text-slate-500"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 className="text-xl font-bold">{id ? 'Edit' : 'New'} {type}</h1>
      </header>

      <div className="p-4 space-y-4 pb-24">
        {/* Smart Add AI Tool */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-wand-magic-sparkles animate-sparkle"></i>
            <h3 className="font-bold text-sm">AI Smart-Add</h3>
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="e.g. Add 3 web designs..."
              className="flex-1 p-2 rounded-lg text-slate-900 text-sm outline-none"
              value={smartAddText}
              onChange={e => setSmartAddText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSmartAdd()}
            />
            <button 
              onClick={handleSmartAdd}
              disabled={isSmartLoading}
              className="bg-white text-blue-600 px-3 py-2 rounded-lg font-bold text-xs hover:bg-blue-50 disabled:opacity-50"
            >
              {isSmartLoading ? '...' : 'ADD'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={doc.customerId}
                onChange={e => setDoc({ ...doc, customerId: e.target.value })}
              >
                <option value="">Select Customer</option>
                {state.customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number</label>
                <input type="text" className="w-full p-3 border rounded-xl bg-slate-50" value={doc.number} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required className="w-full p-3 border rounded-xl outline-none" value={doc.date} onChange={e => setDoc({ ...doc, date: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h2 className="font-bold text-slate-800">Manual Item Selection</h2>
            <div className="grid grid-cols-1 gap-2">
              <select
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
              >
                <option value="">Select Item</option>
                {state.items.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (Rs {i.rate})</option>
                ))}
              </select>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Rate</label>
                  <input type="number" className="w-full p-3 border rounded-xl outline-none text-sm" value={selectedRate} onChange={e => setSelectedRate(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Qty</label>
                  <input type="number" min="1" className="w-full p-3 border rounded-xl outline-none text-sm" value={selectedQty} onChange={e => setSelectedQty(parseInt(e.target.value) || 1)} />
                </div>
              </div>
              <button 
                type="button" 
                onClick={addItem} 
                disabled={!selectedItemId} 
                className={`w-full py-4 mt-2 text-white rounded-xl transition-colors flex items-center justify-center ${selectedItemId ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                <i className="fa-solid fa-plus text-xl"></i>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-bold text-slate-800 mb-4">Summary ({doc.items.length} items)</h2>
            <div className="space-y-3">
              {doc.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.quantity} x Rs {item.rate.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">Rs {item.total.toLocaleString()}</span>
                    <button type="button" onClick={() => removeItem(index)} className="text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                </div>
              ))}
              {doc.items.length === 0 && <p className="text-center text-slate-300 py-4 italic">No items added yet</p>}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-bold">TOTAL AMOUNT</span>
              <span className="text-2xl font-black text-blue-600">Rs {doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg mt-4 sticky bottom-4 z-20">
            SAVE {type.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm;
