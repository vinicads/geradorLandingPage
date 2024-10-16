import { Module, ValidationPipe  } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import { usersFunctions } from '../users/functions/users.functions';
import { SobreController } from './sobre.controller';
import { SobreService } from './sobre.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.tempoToken },
    }),
  ],
  controllers: [SobreController],
  providers: [SobreService, PrismaService, functionService, usersFunctions,
    LoginFunctions, {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class SobreModule {}

