import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions, MulterFile } from 'multer';
import { ServicosService } from './servicos.service';
import { servicosDTO } from './dto/servicos.dto';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly ServicosService: ServicosService,) { }
  
  @Post()
  @UseInterceptors(FilesInterceptor('arquivos'))
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response,
    @Body("servicos") servicos: servicosDTO,
    @UploadedFiles() arquivos: MulterFile[],
    @Req() req: Request) {
      if (arquivos.length > 0){
        let tiposAceitosImagem = ['jpeg', 'jpg', 'png', 'ico']
        let arquivoName = arquivos[0].originalname.split('.');
        if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
          throw new HttpException("Tipo de arquivo não aceito.", HttpStatus.BAD_REQUEST);
        }
      }
        return this.ServicosService.create(servicos, arquivos, res, req);
  }

  @Get()
  async findAll(  @Res() res: Response, 
    @Query('titulo') titulo: string,
    @Query('start') start: number,
    @Query('quantity') quantity: number,
    @Req() req: Request) {

      let filters: any = {};
      if (titulo) {
        filters.titulo = {
          contains: titulo,
        };
      }

        return this.ServicosService.getCurso(filters, start, quantity, req ,res);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('arquivos'))
  async update(@Res() res: Response, @Param('id') id: number,
  @Body("servicos") servicos: servicosDTO,
  @UploadedFiles() arquivos: MulterFile[],
    @Req() req: Request) {
      if (arquivos.length > 0){
        let tiposAceitosImagem = ['jpeg', 'jpg', 'png', 'ico']
        let arquivoName = arquivos[0].originalname.split('.');
        if (!tiposAceitosImagem.includes(arquivoName[arquivoName.length - 1].toLowerCase())) {
          throw new HttpException("Tipo de arquivo não aceito.", HttpStatus.BAD_REQUEST);
        }
      }
      return this.ServicosService.update(id, servicos, arquivos, req, res);
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number, @Req() req: Request) {
    return this.ServicosService.delete(id, req, res);
  }


}
