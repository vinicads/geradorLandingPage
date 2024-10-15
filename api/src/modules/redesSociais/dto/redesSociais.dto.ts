
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString, IsDate, ArrayMinSize, ArrayMaxSize, Min } from 'class-validator';

export class redesSociaisDTO {
   
    @MaxLength(45, {message: "O limite de dígitos do nome da rede social foi atingido. [nome]"})
    @IsString({message:"Nome da rede social deve ser uma string. [nome]"})
    @IsNotEmpty({message: "Nome da rede social precisa ser preenchido. [nome]"})
    nome: string;

    @IsString({message:"Link deve ser uma string. [link]"})
    @IsNotEmpty({message: "Link precisa ser preenchido. [link]"})
    link: string;

    @IsString({message:"Logo deve ser uma string. [logo]"})
    @IsOptional()
    logo: string;
}
