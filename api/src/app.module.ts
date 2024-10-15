import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogadoMiddleware } from './middlewares/logado.middleware';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express/multer';
import { APP_PIPE } from '@nestjs/core';
import { LoginModule } from './modules/login/login.module';
import { UsersModule } from './modules/users/users.module';
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
  UsersModule
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
      )
  }
}
