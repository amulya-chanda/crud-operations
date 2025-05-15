import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    FirstName: string

    @IsNotEmpty()
    @IsString()
    LastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}
