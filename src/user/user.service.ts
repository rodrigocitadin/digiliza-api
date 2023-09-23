import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from './dto/return-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  private returnUser = {
    name: true,
    email: true
  }

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const userAlreadyExists = await this.findByEmail(createUserDto.email);

    if (userAlreadyExists) throw new BadRequestException("User with this email already exists");

    createUserDto.password = await this.hashPassword(createUserDto.password);

    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
        select: this.returnUser
      })

      return user;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id }
    })

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(updateUserDto.password, salt);

      updateUserDto.password = hashPassword;
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto
      })

      return user;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: string) {
    await this.findById(id)
    await this.prisma.user.delete({ where: { id } });
  }

  private async findByEmail(email: string) {
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
}
