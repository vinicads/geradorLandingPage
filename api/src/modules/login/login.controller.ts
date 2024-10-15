import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, ValidationPipe, UsePipes, Req } from '@nestjs/common';
import { response } from 'express';
import { LoginService } from './login.service';
import { loginDTO } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Res() res: Response, @Req() req: Request,
    @Body() login: loginDTO) {
    return this.loginService.verify(login, res, req);
  }

  @Get()
  find(@Req() req: Request, @Res() res: Response) {
    return this.loginService.find(req, res);
  }

  @Get("/logout")
  logout(@Req() req: Request, @Res() res: Response) {
    return this.loginService.logout(req, res);
  }


}
