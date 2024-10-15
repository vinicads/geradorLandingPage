import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogadoMiddleware implements NestMiddleware {
    constructor(private jwt: JwtService,){}
  use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;
if (cookies.meuToken){
    try {
        this.jwt.verify(cookies.meuToken);
        next();
  
    } catch (error) {
        return res.status(400).send("Token invalido");
    }
}else{
    return res.status(401).send("Primeiro faça login");
}
    
  }
}
