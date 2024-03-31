import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    roomname: string;
    @IsEnum(["public", "protected", "private"])
    type: 'public' | 'protected' | 'private';
    @IsString()
    @IsOptional()
    password: string;
}