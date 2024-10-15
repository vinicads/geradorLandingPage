import { Injectable, Res } from '@nestjs/common';
import { LoginFunctions } from './functions/login.functions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { usersFunctions } from '../users/functions/users.functions';
import { loginDTO } from './dto/login.dto';
import { PrismaService } from 'src/database/PrismaService';
@Injectable()
export class LoginService {
  constructor(
    private readonly usersFunctions: usersFunctions,
    private readonly loginFunctions: LoginFunctions,
    private readonly prisma: PrismaService,
    private jwt: JwtService,) { }

  async verify(data: loginDTO, res, req) {
    const cookies = req.cookies;
    if (cookies.meuToken) {
      res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        withCredentials: true,
        path: "/",
      });
      return res.status(400).send("Tente novamente, por favor")
    } else {
      try {
        var resultado = await this.usersFunctions.verifyUser(data.email);
        if (resultado) {
            var token = await this.loginFunctions.generateToken(data.email);
            bcrypt.compare(data.senha, resultado.senha, function (err, result) {
              if (result) {
               
                const dados = {
                  "autenticacao": resultado,
                }
                res.cookie('meuToken', token, {
                  secure: false,
                  httpOnly: true,
                  withCredentials: true,
                  sameSite: 'lax',
                  maxAge: Number(String(process.env.tempoCookie)),
                  path: "/",
                })
                
                return res.status(200).send(dados);
              } else {
                return res.status(401).send('Senha invalida.');
              }
            })

        } else {
          return res.status(404).send("Usuário não encontrado.");
        }
      } catch (error) {
        return res.status(400).send("Dados incorretos." + error);
      }
    }
  }

  async find(req, res) {
    const cookies = req.cookies;
    if (cookies.meuToken) {
      const resultado = await this.loginFunctions.verifyToken(cookies.meuToken);
      if (resultado){
        var newResultado = await this.usersFunctions.verifyUser(resultado.email);
        if(newResultado){
        
          const newDados= {
            "autenticacao": newResultado,
          };
            return res.status(200).send(newDados);
        }else{
          return res.cookie('meuToken', "token", {
            maxAge: 1,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            withCredentials: true,
            path: "/",
          }).status(400).send("Token invalido.");
        }
        
      }else {
         res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        withCredentials: true,
        path: "/",
      });
      var dados = {
        "message": "Token inválido.",
      }
        return res.status(401).send(dados)
      }
    } else {
      var dados = {
        "message": "Primeiro faça login",
      }
      return res.status(401).send(dados);
    }

  }

  async logout(req, res) {
    const cookies = req.cookies;
    if (cookies.meuToken) {
      res.cookie('meuToken', "token", {
        maxAge: 1,
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        withCredentials: true,
        path: "/",
      });
    }
    return res.status(200).send('Saiu com sucesso!');
  }

}

