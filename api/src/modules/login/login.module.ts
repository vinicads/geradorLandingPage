import { Module, ValidationPipe  } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginFunctions } from './functions/login.functions';
import { usersFunctions } from '../users/functions/users.functions';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, LoginFunctions, usersFunctions, PrismaService, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class LoginModule {}

