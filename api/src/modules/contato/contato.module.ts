import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import { usersFunctions } from '../users/functions/users.functions';
import { ContatoController } from './contato.controller';
import { ContatoService } from './contato.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
  ],
  controllers: [ContatoController],
  providers: [ContatoService, PrismaService, functionService, usersFunctions,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class ContatoModule {}

