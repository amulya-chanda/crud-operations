import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    //check if email exist
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException({ message: 'Email already exist' });
    }

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  // to create bulk users
  async bulkCreate(users: CreateUserDto[]): Promise<User[]> {
    const emails = users.map(user => user.email);

    // Optional: Check for duplicates in DB
    const existingUsers = await this.userRepository.find({
      where: emails.map(email => ({ email }))
    });

    const existingEmails = new Set(existingUsers.map(u => u.email));
    const filteredUsers = users.filter(u => !existingEmails.has(u.email));

    const newUsers = this.userRepository.create(filteredUsers);
    return await this.userRepository.save(newUsers);
  }

  //read all user
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //read single user
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException({ message: 'User not found' });
    }
    return user;
  }

  //update user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException({ message: 'User not found' });
    }

    const updateUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updateUser);
  }

  //delete user
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException({ message: 'User not found' });
    }
    return await this.userRepository.remove(user);
  }
}
