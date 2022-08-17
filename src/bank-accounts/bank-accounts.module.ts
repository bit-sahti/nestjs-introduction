import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from '../@core/domain/bank-account.service';
import { BankAccountSchema } from '../@core/infra/db/bank-account.entity';
import { BankAccountRepository } from '../@core/domain/bank-account.repository';
import { BankAccountTypeOrmRepository } from '../@core/infra/db/bank-account-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountSchema])],
  controllers: [BankAccountsController],
  providers: [
    {
      provide: BankAccountTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new BankAccountTypeOrmRepository(
          dataSource.getRepository(BankAccountSchema),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: BankAccountService,
      useFactory: (repo: BankAccountRepository, dataSource: DataSource) => {
        return new BankAccountService(repo, dataSource);
      },
      inject: [BankAccountTypeOrmRepository, getDataSourceToken()],
    },
  ],
})
export class BankAccountsModule {}
