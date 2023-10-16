import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto, returnUserQuery } from './dto/return-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const userAlreadyExists = await this.findByEmail(createUserDto.email);

    if (userAlreadyExists) throw new BadRequestException("User with this email already exists");

    createUserDto.password = await this.hashPassword(createUserDto.password);

    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
        select: returnUserQuery
      })

      return user;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async findAll(): Promise<ReturnUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: returnUserQuery
    });

    return users;
  }

  async findById(id: string): Promise<ReturnUserDto> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: returnUserQuery
    })

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ReturnUserDto> {
    await this.findById(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(updateUserDto.password, salt);

      updateUserDto.password = hashPassword;
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: returnUserQuery
      })

      return user;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findById(id)
    await this.prisma.user.delete({ where: { id } });
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  async findToLogin(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    if (!user) throw new NotFoundException("User with this email not found")

    return user;
  }
}
