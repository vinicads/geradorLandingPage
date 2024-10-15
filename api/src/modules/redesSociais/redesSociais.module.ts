import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import { RedesSociaisController } from './redesSociais.controller';
import { RedesSociaisService } from './redesSociais.service';
import { usersFunctions } from '../users/functions/users.functions';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
  ],
  controllers: [RedesSociaisController],
  providers: [RedesSociaisService, PrismaService, functionService, usersFunctions,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class RedesSociaisModule {}

