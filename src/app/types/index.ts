export interface CreditCard {
  id?: string;
  name: string;
  limit: number;
  paymentDate: number;
  currentBalance: number;
}

export interface Expense {
  id?: string;
  name: string;
  amount: number;
  paymentDate: number;
  dueDate: number;
  isRecurring: boolean;
}

export interface Income {
  id?: string;
  name: string;
  amount: number;
  paymentDate: number;
  receiptDate: number;
  isRecurring: boolean;
}

export interface Balance {
  date: string;
  amount: number;
}
