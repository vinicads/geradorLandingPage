
import { IsString, IsNumber, IsNotEmpty, IsEnum, Matches, MaxLength, MinLength, IsOptional, IsEmail, IsBoolean, IsDateString, IsDate, ArrayMinSize, ArrayMaxSize, Min } from 'class-validator';

export class sobreDTO {
   
    @MaxLength(45, {message: "O limite de dígitos do titulo foi atingido. [titulo]"})
    @IsString({message:"Titulo deve ser uma string. [titulo]"})
    @IsNotEmpty({message: "Titulo precisa ser preenchido. [titulo]"})
    titulo: string;

    @IsString({message:"Descricao deve ser uma string. [descricao]"})
    @IsNotEmpty({message: "Descricao precisa ser preenchido. [descricao]"})
    descricao: string;

    @IsString({message:"Foto deve ser uma string. [foto]"})
    @IsOptional()
    foto: string;
}
