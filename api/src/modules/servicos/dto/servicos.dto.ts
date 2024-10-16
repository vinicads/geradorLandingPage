
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString, IsDate, ArrayMinSize, ArrayMaxSize, Min } from 'class-validator';

export class servicosDTO {
   
    @MaxLength(45, {message: "O limite de dígitos do titulo foi atingido. [titulo]"})
    @IsString({message:"Titulo deve ser uma string. [titulo]"})
    @IsNotEmpty({message: "Titulo precisa ser preenchido. [titulo]"})
    titulo: string;

    @IsString({message:"Texto deve ser uma string. [link]"})
    @IsNotEmpty({message: "Texto precisa ser preenchido. [link]"})
    texto: string;

    @IsString({message:"Logo deve ser uma string. [logo]"})
    @IsOptional()
    logo: string;
}
