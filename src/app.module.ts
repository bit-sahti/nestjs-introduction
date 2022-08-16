import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { BankAccount } from './bank-accounts/entities/bank-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/db.sqlite',
      synchronize: true,
      logging: true,
      entities: [BankAccount],
    }),
    BankAccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
