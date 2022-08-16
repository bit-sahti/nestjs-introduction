import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { TransferBankAccountDto } from './dto/transfer-bank-account.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountsService.create(createBankAccountDto);
  }

  @Get()
  findAll() {
    return this.bankAccountsService.findAll();
  }

  @Get(':account_number')
  findOne(@Param('account_number') account_number: string) {
    return this.bankAccountsService.findOne(account_number);
  }

  @Post('transfer')
  @HttpCode(204)
  transfer(@Body() transferBankAccountDto: TransferBankAccountDto) {
    return this.bankAccountsService.transfer(transferBankAccountDto);
  }
}
