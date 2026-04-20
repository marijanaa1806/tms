export interface Transaction {
  date: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: string | null;
}
