import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto | CreateUserDto[]) {
    if (Array.isArray(createUserDto)) {
      await this.userService.bulkCreate(createUserDto);
      return { message: 'Users created successfully' };
    } else {
      await this.userService.create(createUserDto);
      return { message: 'User created successfully' };
    }
  }

  @Get()
  async findAll() {
    const user = await this.userService.findAll();
    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(+id, updateUserDto);
    return {
      success: true,
      data,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
