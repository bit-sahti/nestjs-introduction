import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountSchema } from '../@core/infra/db/bank-account.entity';
import { BankAccountTypeOrmRepository } from 'src/@core/infra/db/bank-account-typeorm.repository';
import { DataSource } from 'typeorm';
import { BankAccountService } from 'src/@core/domain/bank-account.service';
import { BankAccountRepository } from 'src/@core/domain/bank-account.repository';

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
