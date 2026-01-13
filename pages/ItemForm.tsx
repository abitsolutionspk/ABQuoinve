
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState, Item } from '../types';

interface ItemFormProps {
  state: AppState;
  onUpdate: (newData: Item[]) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ state, onUpdate }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    name: '',
    description: '',
    rate: 0
  });

  useEffect(() => {
    if (id) {
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        setFormData({ name: existing.name, description: existing.description, rate: existing.rate });
      }
    }
  }, [id, state.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const updated = state.items.map(i => i.id === id ? { ...i, ...formData } : i);
      onUpdate(updated);
    } else {
      const newItem = { ...formData, id: Date.now().toString() };
      onUpdate([...state.items, newItem]);
    }
    navigate('/items');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/items')} className="text-slate-500"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 className="text-xl font-bold">{id ? 'Edit Item' : 'New Item'}</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rate</label>
            <input
              type="number"
              required
              step="0.01"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.rate}
              onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">
          SAVE ITEM
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
