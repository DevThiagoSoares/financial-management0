import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Page, PageResponse } from 'src/config/database/page.model';
import { FiltersUserDTO } from 'src/dto/user/filterUser.dto';
import { MappedUserDTO } from 'src/dto/user/mappedUser.dto';
import { User } from 'src/entities/user.entity';
import IUserRepository from 'src/repository/user/user.repository.contract';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import ILoanRepository from 'src/repository/loan/loan.repository.contract';

@Injectable()
export class UserService {
      L;
      constructor(
            @Inject('IUserRepository')
            private readonly userRepository: IUserRepository,
            private readonly loanRepository: ILoanRepository,
      ) {}

      async create(payload: CreateUserDto) {
            return await this.userRepository.create(payload);
      }

      async listAll(
            page: Page,
            filters?: FiltersUserDTO,
      ): Promise<PageResponse<MappedUserDTO>> {
            const user = await this.userRepository.findAll(page, filters);

            if (user.total === 0) {
                  throw new HttpException(
                        'Não existe user para esta pesquisa!',
                        HttpStatus.NOT_FOUND,
                  );
            }

            const items = this.toDTO(user.items);

            return {
                  total: user.total,
                  items,
            };
      }

      async listById(id: number) {
            const user = await this.userRepository.findById(id);

            if (!user)
                  throw new HttpException(
                        `Não foi encontrado um user com o id: ${id}`,
                        HttpStatus.NOT_FOUND,
                  );

            return user;
      }

      async update(id: number, data: UpdateUserDto) {
            const userById = await this.userRepository.findById(id);

            if (!userById) {
                  throw new HttpException(
                        `Não existe id: ${id}`,
                        HttpStatus.NOT_FOUND,
                  );
            }
            const user = await this.userRepository.update(id, data);
            for await (const loans of data.loan) {
                  await this.loanRepository.update(loans);
            }
            return user;
      }

      async delete(id: number): Promise<User> {
            const user = await this.listById(id);

            return await this.userRepository.delete(user.id);
      }

      private toDTO(users: User[]): MappedUserDTO[] {
            return users.map((user) => {
                  return {
                        id: user.id,
                        name: user.name,
                        fone: user.fone,
                        address: user.address,
                        loan: user.loan,
                  };
            });
      }
}
