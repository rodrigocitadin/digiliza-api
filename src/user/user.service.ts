import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.findByEmail(createUserDto.email);

    if (userAlreadyExists) throw new BadRequestException("User with this email already exists");

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = hashPassword;

    const user = await this.prisma.user.create({
      data: createUserDto,
    })

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id }
    })

    if (!user) throw new NotFoundException();

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(updateUserDto.password, salt);

      updateUserDto.password = hashPassword;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    })

    if (!user) throw new NotFoundException();

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });

    if (!user) throw new NotFoundException();
  }
}
