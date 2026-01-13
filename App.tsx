
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ListPage from './pages/ListPage';
import ItemForm from './pages/ItemForm';
import CustomerForm from './pages/CustomerForm';
import DocumentForm from './pages/DocumentForm';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PrintView from './pages/PrintView';
import { User, AppState, Item, Customer, Document, CompanyInfo } from './types';

const INITIAL_STATE: AppState = {
  items: [
    { id: '1', name: 'Web Design', description: 'Professional UI/UX', rate: 500 },
    { id: '2', name: 'Consultation', description: 'Business strategy', rate: 100 }
  ],
  customers: [
    { id: '1', name: 'John Doe', mobile: '+1234567890', address: '123 Tech St, Silicon Valley' }
  ],
  quotations: [],
  invoices: [],
  company: {
    name: 'AB Solutions',
    mobile: '+9876543210',
    address: 'HQ Tower, Suite 101, Business Bay',
    logo: 'https://picsum.photos/200/200'
  },
  users: [
    { username: 'Admin', role: 'Admin' },
    { username: 'user', role: 'User' }
  ]
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ab_solutions_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('ab_solutions_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('ab_solutions_state', JSON.stringify(state));
  }, [state]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ab_solutions_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ab_solutions_user');
  };

  const updateState = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={currentUser ? <Dashboard user={currentUser} state={state} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/items" 
          element={currentUser ? <ListPage type="items" data={state.items} state={state} onUpdate={(val) => updateState('items', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/items/new" 
          element={currentUser ? <ItemForm state={state} onUpdate={(val) => updateState('items', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/items/edit/:id" 
          element={currentUser ? <ItemForm state={state} onUpdate={(val) => updateState('items', val)} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/customers" 
          element={currentUser ? <ListPage type="customers" data={state.customers} state={state} onUpdate={(val) => updateState('customers', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/customers/new" 
          element={currentUser ? <CustomerForm state={state} onUpdate={(val) => updateState('customers', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/customers/edit/:id" 
          element={currentUser ? <CustomerForm state={state} onUpdate={(val) => updateState('customers', val)} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/quotations" 
          element={currentUser ? <ListPage type="quotations" data={state.quotations} state={state} onUpdate={(val) => updateState('quotations', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/quotations/new" 
          element={currentUser ? <DocumentForm type="Quotation" state={state} onUpdate={(val) => updateState('quotations', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/quotations/edit/:id" 
          element={currentUser ? <DocumentForm type="Quotation" state={state} onUpdate={(val) => updateState('quotations', val)} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/invoices" 
          element={currentUser ? <ListPage type="invoices" data={state.invoices} state={state} onUpdate={(val) => updateState('invoices', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/invoices/new" 
          element={currentUser ? <DocumentForm type="Invoice" state={state} onUpdate={(val) => updateState('invoices', val)} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/invoices/edit/:id" 
          element={currentUser ? <DocumentForm type="Invoice" state={state} onUpdate={(val) => updateState('invoices', val)} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/company" 
          element={currentUser?.role === 'Admin' ? <CompanyInfoPage company={state.company} onUpdate={(val) => updateState('company', val)} /> : <Navigate to="/" />} 
        />

        <Route 
          path="/print/:type/:id" 
          element={<PrintView state={state} />} 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
