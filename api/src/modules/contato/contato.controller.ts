import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ContatoService } from './contato.service';
import { contatoDTO } from './dto/contato.dto';

@Controller('contato')
export class ContatoController {
  constructor(private readonly ContatoService: ContatoService,) { }
  
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("contato") sobre: contatoDTO,
    @Req() req: Request) {
        return this.ContatoService.create(sobre, res, req);
  }

  @Get()
  async findAll(  @Res() res: Response, 
    @Req() req: Request) {
        return this.ContatoService.getAll(req ,res);
  }


}
