import { BankAccount } from '../../domain/bank-account';
import { BankAccountRepository } from 'src/@core/domain/bank-account.repository';
import { BankAccountSchema } from 'src/@core/infra/db/bank-account.entity';
import { Repository } from 'typeorm';

export class BankAccountTypeOrmRepository implements BankAccountRepository {
  constructor(private ormRepo: Repository<BankAccountSchema>) {}

  async insert(bankAccount: BankAccount): Promise<void> {
    const model = this.ormRepo.create(bankAccount);

    await this.ormRepo.save(model);
  }

  async update(bankAccount: BankAccount): Promise<void> {
    await this.ormRepo.update(bankAccount.id, {
      balance: bankAccount.balance,
    });
  }

  async findByAccountNumber(account_number: string): Promise<BankAccount> {
    const data = await this.ormRepo.findOneBy({ account_number });

    if (!data) {
      throw new Error('Account not found');
    }

    return new BankAccount(data.balance, data.account_number, data.id);
  }
}
