import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import * as path from 'path';
import { contatoDTO } from './dto/contato.dto';
import { usersFunctions } from '../users/functions/users.functions';
@Injectable()
export class ContatoService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly usersFunctions: usersFunctions,
    private readonly geralFunctions: functionService,) { }

  async create(data: contatoDTO, res, req) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

      const contatoExists = await this.prisma.contato.findFirst({
        where: {
          idautenticacao: Number(myData.idautenticacao)
        }
      })

      if (contatoExists){
        await this.prisma.contato.update({
          where: {
            idContato: Number(contatoExists.idContato)
          },
          data
        })
        return res.status(200).send("Contatos atualizados com sucesso.");
      }else{
        await this.prisma.contato.create({
          data: {
            email: data.email,
            numero: data.numero,
            cep: data.cep,
            idautenticacao: Number(myData.idautenticacao)
          }
        })
        return res.status(200).send("Contatos cadastrados com sucesso.");
      }

    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async getAll(req, res) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }


      var data = await this.prisma.contato.findFirst({
        where: {
          idautenticacao: Number(myData.idautenticacao)
        },
      });

      if (!data) {
        return res.status(404).send("Nenhum contato encontrado.");
      } else {
        var newData = {
          "contato": data,
        }
        return res.status(200).send(newData);
      }

    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

