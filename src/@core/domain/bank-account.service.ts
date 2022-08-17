import { DataSource } from 'typeorm';
import { BankAccount } from './bank-account';
import { BankAccountRepository } from './bank-account.repository';
import { transfer } from './transfer.service';

export class BankAccountService {
  constructor(
    private bankAccountRepo: BankAccountRepository,
    private dataSource: DataSource,
  ) {}

  async create(account_number: string): Promise<BankAccount> {
    const bankAccount = new BankAccount(0, account_number);

    await this.bankAccountRepo.insert(bankAccount);

    return bankAccount;
  }

  async list(): Promise<BankAccount[]> {
    return this.bankAccountRepo.findAll();
  }

  async findByAccountNumber(account_number: string): Promise<BankAccount> {
    return this.bankAccountRepo.findByAccountNumber(account_number);
  }

  async transfer(
    sourceAccountNumber: string,
    targetAccountNumber: string,
    amount: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      const [source, target] = await Promise.all([
        this.bankAccountRepo.findByAccountNumber(sourceAccountNumber),
        this.bankAccountRepo.findByAccountNumber(targetAccountNumber),
      ]);

      transfer(source, target, amount);

      await Promise.all([
        this.bankAccountRepo.update(source),
        this.bankAccountRepo.update(target),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    }
  }
}
