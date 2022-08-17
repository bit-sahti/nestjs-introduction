import { DataSource, Repository } from 'typeorm';
import { BankAccountTypeOrmRepository } from '../infra/db/bank-account-typeorm.repository';
import { BankAccountSchema } from '../infra/db/bank-account.entity';
import { BankAccountService } from './bank-account.service';

describe('BankAccountTypeOrmService Integration Test', () => {
  let dataSource: DataSource;
  let ormRepo: Repository<BankAccountSchema>;
  let repository: BankAccountTypeOrmRepository;
  let bankAccountService: BankAccountService;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [BankAccountSchema],
    });

    await dataSource.initialize();

    ormRepo = dataSource.getRepository(BankAccountSchema);
    repository = new BankAccountTypeOrmRepository(ormRepo);
    bankAccountService = new BankAccountService(repository, dataSource);
  });

  it('should create a new bank account in the database', async () => {
    await bankAccountService.create('1111-11');

    const createdAccount = await ormRepo.findOneBy({
      account_number: '1111-11',
    });

    expect(createdAccount).toMatchObject({
      id: expect.any(String),
      balance: 0,
      account_number: '1111-11',
    });
  });

  it('should transfer a given amount between accounts', async () => {
    const source = await bankAccountService.create('1111-11');
    const target = await bankAccountService.create('2222-22');

    await bankAccountService.transfer('1111-11', '2222-22', 70);

    const sourceAccount = await repository.findByAccountNumber(
      source.account_number,
    );
    const targetAccount = await repository.findByAccountNumber(
      target.account_number,
    );

    expect(sourceAccount.balance).toEqual(-70);
    expect(targetAccount.balance).toEqual(70);
  });
});
