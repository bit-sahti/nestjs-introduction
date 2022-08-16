import { Inject, Injectable } from '@nestjs/common';
import { getDataSourceToken, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { TransferBankAccountDto } from './dto/transfer-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private repo: Repository<BankAccount>,
    @Inject(getDataSourceToken())
    private dataSource: DataSource,
  ) {}
  async create(createBankAccountDto: CreateBankAccountDto) {
    const bankAccount = this.repo.create({
      account_number: createBankAccountDto.account_number,
      balance: 0,
    });

    await this.repo.insert(bankAccount);

    return bankAccount;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(account_number: string) {
    return this.repo.findOneBy({ account_number });
  }

  async transfer(tranferBankAccountDto: TransferBankAccountDto) {
    const { to, from, amount } = tranferBankAccountDto;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const [source, destination] = await Promise.all([
        this.repo.findOneBy({ account_number: from }),
        this.repo.findOneBy({ account_number: to }),
      ]);

      source.balance = source.balance - amount;
      destination.balance = destination.balance + amount;

      await Promise.all([this.repo.save(source), this.repo.save(destination)]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    }
  }
}
