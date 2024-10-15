import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { UsersService } from './users.service';
import { usersDTO } from './dto/users.dto';

import { PrismaService } from 'src/database/PrismaService';
import { usersFunctions } from './functions/users.functions';
import { usersSemSenhaDTO } from './dto/usersSemSenha.dto copy';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly usersFunctions: usersFunctions,
    private prisma: PrismaService) { }
  @Post()
  @UsePipes(ValidationPipe)
  
  async create(@Res() res: Response,
    @Body("autenticacao") autenticacao: usersDTO,
    @Req() req: Request) {
        return this.usersService.create(autenticacao, res, req);
  }


  @Put()
  async update(@Res() res: Response,
    @Body("autenticacao") autenticacao: usersSemSenhaDTO,
    @Req() req: Request) {
        return this.usersService.update(autenticacao, res, req);  
  }


  @Delete()
  async remove(@Res() res: Response, @Req() req: Request) {
    return this.usersService.delete(res, req); 
  }
}
