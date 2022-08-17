import { DataSource, Repository } from 'typeorm';
import { BankAccount } from '../../domain/bank-account';
import { BankAccountTypeOrmRepository } from './bank-account-typeorm.repository';
import { BankAccountSchema } from './bank-account.entity';

describe('BankAccountTypeOrmRepository Integration Test', () => {
  let dataSource: DataSource;
  let ormRepo: Repository<BankAccountSchema>;
  let repository: BankAccountTypeOrmRepository;

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
  });

  afterEach(() => {
    dataSource.destroy();
  });

  it('should insert a new bank account into the database', async () => {
    const bankAccount = new BankAccount(100, '1111-11');

    await repository.insert(bankAccount);

    const createdAccount = await ormRepo.findOneBy({
      account_number: '1111-11',
    });

    expect(createdAccount).toMatchObject(bankAccount);
  });

  it('should update an account', async () => {
    const bankAccount = new BankAccount(100, '1111-11');

    await ormRepo.insert(bankAccount);

    bankAccount.debit(10);

    await repository.update(bankAccount);

    const foundAccount = await repository.findByAccountNumber('1111-11');

    expect(foundAccount.balance).toEqual(90);
  });

  it('should find a account by account_number', async () => {
    const bankAccount = new BankAccount(100, '1111-11');

    await ormRepo.insert(bankAccount);

    const foundAccount = await repository.findByAccountNumber('1111-11');

    expect(foundAccount).toStrictEqual(bankAccount);
  });

  it('should return an error if it cannot find a account by account_number', async () => {
    await expect(async () =>
      repository.findByAccountNumber('1111-11'),
    ).rejects.toThrowError('Account not found');
  });

  it('should find all accounts', async () => {
    const bankAccount1 = new BankAccount(100, '1111-11');
    const bankAccount2 = new BankAccount(100, '2222-22');

    await ormRepo.insert(bankAccount1);
    await ormRepo.insert(bankAccount2);

    const accounts = await repository.findAll();

    expect(accounts).toStrictEqual([bankAccount1, bankAccount2]);
  });
});
