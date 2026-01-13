
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppState, Customer } from '../types';

interface CustomerFormProps {
  state: AppState;
  onUpdate: (newData: Customer[]) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ state, onUpdate }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    mobile: '',
    address: ''
  });

  useEffect(() => {
    if (id) {
      const existing = state.customers.find(c => c.id === id);
      if (existing) {
        setFormData({ name: existing.name, mobile: existing.mobile, address: existing.address });
      }
    }
  }, [id, state.customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const updated = state.customers.map(c => c.id === id ? { ...c, ...formData } : c);
      onUpdate(updated);
    } else {
      const newCustomer = { ...formData, id: Date.now().toString() };
      onUpdate([...state.customers, newCustomer]);
    }
    navigate('/customers');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/customers')} className="text-slate-500"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 className="text-xl font-bold">{id ? 'Edit Customer' : 'New Customer'}</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
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
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">
          SAVE CUSTOMER
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
