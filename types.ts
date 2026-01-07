

export interface Expense {
  id: string;
  nome: string;
  valor: number;
  fixo: boolean;
  parcelado: boolean;
  inicio?: string; // Format "DD/MM/YYYY"
  fim?: string;    // Format "DD/MM/YYYY"
  pago?: boolean;
}

export interface CofreItem {
  id: string;
  valor: number;
  data: string; // YYYY-MM-DD
  descricao: string;
}

export interface AppData {
  saldo_conta: number;
  despesas: {
    [monthKey: string]: Expense[]; // Key is "YYYY-MM"
  };
  cofre?: {
    [monthKey: string]: CofreItem[]; // Key is "YYYY-MM"
  };
  deletedInstances?: {
    [monthKey: string]: string[]; // Key is "YYYY-MM", value is array of expense IDs
  };
}

export type ModalView = 
  | { view: 'none' }
  | { view: 'balance' }
  | { view: 'month_selector' }
  | { view: 'add_expense' }
  | { view: 'edit_expense'; expense: Expense; isPastMonth?: boolean }
  | { view: 'delete_confirmation'; expense: Expense }
  | { view: 'add_cofre_item' }
  | { view: 'edit_cofre_item'; item: CofreItem }
  | { view: 'delete_cofre_confirmation'; item: CofreItem };