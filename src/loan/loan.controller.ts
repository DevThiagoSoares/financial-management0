import {
      Controller,
      Get,
      Post,
      Body,
      Param,
      Delete,
      Put,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loan')
export class LoanController {
      constructor(private readonly loanService: LoanService) {}

      @Post(':userId')
      create(
            @Param('userId') userId: number,
            @Body() createLoanDto: CreateLoanDto,
      ) {
            return this.loanService.create(createLoanDto, userId);
      }

      @Get()
      findAll() {
            return this.loanService.findAll();
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
            return this.loanService.findOne(+id);
      }

      @Put(':id')
      update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
            return this.loanService.update(+id, updateLoanDto);
      }

      @Delete(':id')
      remove(@Param('id') id: string) {
            return this.loanService.remove(+id);
      }
}
