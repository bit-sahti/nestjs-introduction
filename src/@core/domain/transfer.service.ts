import { BankAccount } from './bank-account';

export const transfer = (
  source: BankAccount,
  target: BankAccount,
  amount: number,
): void => {
  source.debit(amount);
  target.deposit(amount);
};
