
export type UserRole = 'Admin' | 'User';

export interface User {
  username: string;
  role: UserRole;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rate: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
}

export interface DocumentItem {
  itemId: string;
  name: string;
  rate: number;
  quantity: number;
  total: number;
}

export interface Document {
  id: string;
  type: 'Quotation' | 'Invoice';
  number: string;
  date: string;
  customerId: string;
  items: DocumentItem[];
  totalAmount: number;
}

export interface CompanyInfo {
  name: string;
  mobile: string;
  address: string;
  logo: string;
  ntn?: string;
}

export interface AppState {
  items: Item[];
  customers: Customer[];
  quotations: Document[];
  invoices: Document[];
  company: CompanyInfo;
  users: User[];
}
