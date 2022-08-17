import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { BankAccountService } from '../@core/domain/bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { TransferBankAccountDto } from './dto/transfer-bank-account.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountService) {}

  @Post()
  create(@Body() { account_number }: CreateBankAccountDto) {
    return this.bankAccountsService.create(account_number);
  }

  @Get()
  findAll() {
    return this.bankAccountsService.list();
  }

  @Get(':account_number')
  findOne(@Param('account_number') account_number: string) {
    return this.bankAccountsService.findByAccountNumber(account_number);
  }

  @Post('transfer')
  @HttpCode(204)
  transfer(@Body() { to, from, amount }: TransferBankAccountDto) {
    return this.bankAccountsService.transfer(to, from, amount);
  }
}
