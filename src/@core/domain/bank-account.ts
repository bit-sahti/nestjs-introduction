import { v4 as uuidV4 } from 'uuid';

export class BankAccount {
  id: string;
  balance: number;
  account_number: string;

  constructor(balance: number, account_number: string, id?: string) {
    this.id = id ?? uuidV4();
    this.balance = balance;
    this.account_number = account_number;
  }

  debit(amount: number): void {
    this.balance -= amount;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}
