import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogadoMiddleware } from './middlewares/logado.middleware';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_PIPE } from '@nestjs/core';
import { LoginModule } from './modules/login/login.module';
import { UsersModule } from './modules/users/users.module';
import { RedesSociaisModule } from './modules/redesSociais/redesSociais.module';
import { RedesSociaisController } from './modules/redesSociais/redesSociais.controller';
import { ServicosModule } from './modules/servicos/titulo.module';
import { SobreModule } from './modules/sobre/sobre.module';
import { ServicosController } from './modules/servicos/servicos.controller';
import { SobreController } from './modules/sobre/sobre.controller';
import { ContatoModule } from './modules/contato/contato.module';
import { ContatoController } from './modules/contato/contato.controller';
@Module({
  imports: [ 
    JwtModule.register({
    secret: process.env.secret,
    signOptions: { expiresIn: Number(process.env.tempoToken) },
  }),
  MulterModule.register({
    dest: './uploads/temp', 
  }),
  LoginModule,
  UsersModule,
  RedesSociaisModule,
  ServicosModule,
  SobreModule,
  ContatoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogadoMiddleware)
      .exclude(
        'login/(.*)',
      )
      .forRoutes(
        RedesSociaisController,
        ServicosController,
        SobreController,
        ContatoController
      )
  }
}
