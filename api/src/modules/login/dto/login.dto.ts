import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail } from 'class-validator';

export class loginDTO {
    @MaxLength(100, {message: "O limite de dígitos do email foi atingido."})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco.' })
    @IsString({message:"E-mail deve ser uma string."})
    @IsNotEmpty({message: "E-mail precisa ser preenchido."})
    email: string; 

    @MaxLength(20, {message: "O limite de dígitos da senha foi atingido."})
    @Matches(/^\S+$/, { message: 'Não são permitidos espaços em branco.' })
    @IsString({message:"Senha deve ser uma string."})
    @IsNotEmpty({message: "Senha precisa ser preenchida."})
    senha: string; 
}