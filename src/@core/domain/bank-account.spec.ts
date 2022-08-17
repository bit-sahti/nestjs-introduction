import { BankAccount } from './bank-account';

describe('BankAccount Unit Test', () => {
  it('should create a bank-account', () => {
    const bankAccount = new BankAccount(100, '1234-11', '123');

    expect(bankAccount).toMatchObject({
      id: '123',
      balance: 100,
      account_number: '1234-11',
    });
    expect(bankAccount).toBeInstanceOf(BankAccount);
  });

  it('should assign a new id on creation if one is not provided', () => {
    const bankAccount = new BankAccount(100, '1234-11');

    expect(bankAccount).toMatchObject({
      id: expect.any(String),
      balance: 100,
      account_number: '1234-11',
    });
    expect(bankAccount).toBeInstanceOf(BankAccount);
  });

  it('should execute a debit operation', () => {
    const bankAccount = new BankAccount(100, '1234-11');

    bankAccount.debit(50);

    expect(bankAccount.balance).toEqual(50);
  });

  it('should execute a deposit operation', () => {
    const bankAccount = new BankAccount(100, '1234-11');

    bankAccount.deposit(50);

    expect(bankAccount.balance).toEqual(150);
  });
});
