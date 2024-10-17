
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString, IsDate, ArrayMinSize, ArrayMaxSize, Min } from 'class-validator';

export class contatoDTO {
   
    @MaxLength(45, {message: "O limite de dígitos do numero foi atingido. [numero]"})
    @IsString({message:"Numero deve ser uma string. [numero]"})
    @IsNotEmpty({message: "Numero precisa ser preenchido. [numero]"})
    numero: string;

    @MaxLength(8, {message: "O limite de dígitos do CEP foi atingido. [cep]"})
    @IsString({message:"CEP deve ser uma string. [cep]"})
    @IsNotEmpty({message: "CEP precisa ser preenchido. [cep]"})
    cep: string;

    @IsString({message:"Email deve ser uma string. [email]"})
    @IsNotEmpty({message: "Email precisa ser preenchido. [email]"})
    email: string;
}
