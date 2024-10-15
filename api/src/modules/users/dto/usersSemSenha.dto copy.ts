
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class usersSemSenhaDTO {

    @MaxLength(100, {message: "O limite de dígitos do email foi atingido."})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco.' })
    @IsString({message:"E-mail deve ser uma string."})
    @IsNotEmpty({message: "E-mail precisa ser preenchido."})
    email: string; 

    @MaxLength(20, {message: "O limite de dígitos da senha foi atingido. [senha] "})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco. [senha] ' })
    @IsString({message:"Senha deve ser uma string. [senha] "})
    @IsOptional()
    senha: string; 
}
