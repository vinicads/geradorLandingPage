import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { RedesSociaisService } from './redesSociais.service';
import { redesSociaisDTO } from './dto/redesSociais.dto';

@Controller('redesSociais')
export class RedesSociaisController {
  constructor(private readonly RedesSociaisService: RedesSociaisService,) { }
  
  @Post()
  @UseInterceptors(FilesInterceptor('arquivos'))
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("redesSociais") redesSociais: redesSociaisDTO,
    @UploadedFiles() arquivos: MulterFile[],
    @Req() req: Request) {
      if (arquivos.length > 0){
        let tiposAceitosImagem = ['jpeg', 'jpg', 'png', 'ico']
        let arquivoName = arquivos[0].originalname.split('.');
        if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
          throw new HttpException("Tipo de arquivo não aceito.", HttpStatus.BAD_REQUEST);
        }
      }
        return this.RedesSociaisService.create(redesSociais, arquivos, res, req);
  }

  @Get()
  async findAll(  @Res() res: Response, 
    @Query('nome') nome: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Req() req: Request) {

      let filters: any = {};
      if (nome) {
        filters.nome = {
          contains: nome,
        };
      }

        return this.RedesSociaisService.getCurso(filters, start, quantity, req ,res);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async update(@Res() res: Response, @Param('id') id: number,
  @Body("redesSociais") redesSociais: redesSociaisDTO,
  @UploadedFiles() arquivos: MulterFile[],
    @Req() req: Request) {
      if (arquivos.length > 0){
        let tiposAceitosImagem = ['jpeg', 'jpg', 'png', 'ico']
        let arquivoName = arquivos[0].originalname.split('.');
        if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
          throw new HttpException("Tipo de arquivo não aceito.", HttpStatus.BAD_REQUEST);
        }
      }
      return this.RedesSociaisService.update(id, redesSociais, arquivos, req, res);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    return this.RedesSociaisService.delete(id, req, res);
  }


}
