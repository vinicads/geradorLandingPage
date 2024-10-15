import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { usersFunctions } from './functions/users.functions';
import { usersDTO } from './dto/users.dto';
import { usersSemSenhaDTO } from './dto/usersSemSenha.dto copy';
import { functionService } from 'src/middlewares/geralFunctions';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private readonly usersFunctions: usersFunctions,
    private readonly loginFunctions: LoginFunctions,
private readonly geralFuntions: functionService,) { }

  async create(data: usersDTO, res, req) {
    try {
      var resultado = await this.usersFunctions.verifyUser(data.email);

      if (resultado) {
        return res.status(403).send("Usuário já cadastrado.");
      }

      try {
        await this.usersFunctions.cadastroAutenticacao(data);
        const myData = await this.usersFunctions.getMyData(req);
        if (!myData){
          var token = await this.loginFunctions.generateToken(data.email);
          res.cookie('meuToken', token, {
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: Number(String(process.env.tempoCookie)),
            path: "/",
          })
        }
      } catch (error) {
        return res.status(400).send("Dados incorretos." + error);
      }
  
      return res.status(200).send("Cadastro de usuário realizado.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }


  async update(data: usersSemSenhaDTO,  res, req) {
    try {
        let myData
      try {
        myData = await this.usersFunctions.getMyData(req);
        
        if (!myData) {
          
          return res.status(404).send("Autenticação não encontrada.");
        }
      } catch (error) {
        return res.status(404).send("Autenticação não encontrada.");
      }
     
      var resultado = await this.usersFunctions.verifyUser(data.email, myData.idautenticacao);

      if (resultado) {
        return res.status(403).send("Usuário já cadastrado.");
      }

      await this.usersFunctions.updateAuth(myData.idautenticacao, data);

      if (data.email != myData.email){
        var token = await this.loginFunctions.generateToken(data.email);
        res.cookie('meuToken', token, {
          secure: false,
          httpOnly: true,
          withCredentials: true,
          sameSite: 'lax',
          maxAge: Number(String(process.env.tempoCookie)),
          path: "/",
        })
      }
      return res.status(200).send("Atualizado com sucesso.");
    } catch (error) {
      return res.status(400).send("Dados incorretos." + error);
    }
  }


  async delete(res, req) {
    try {
      let myData
      try {
        myData = await this.usersFunctions.getMyData(req);

        if (!myData) {
          return res.status(404).send("Autenticação não encontrada.");
        }
      } catch (error) {
        return res.status(404).send("Autenticação não encontrada.");
      }
     
      await this.usersFunctions.deletaAutenticacao(myData.idautenticacao)
        res.cookie('meuToken', "token", {
          maxAge: 1,
          secure: false,
          sameSite: 'lax',
          httpOnly: true,
          withCredentials: true,
          path: "/",
        });

      return res.status(200).send("Usuário apagado.");
    } catch (error) {
      return res.status(400).send(error);
    }
  }

}

