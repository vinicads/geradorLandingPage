import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import * as path from 'path';
import { redesSociaisDTO } from './dto/redesSociais.dto';
import { usersFunctions } from '../users/functions/users.functions';
@Injectable()
export class RedesSociaisService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly usersFunctions: usersFunctions,
    private readonly geralFunctions: functionService,) { }

  async create(data: redesSociaisDTO, arquivos, res, req) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     let redesSociaisCreated = await this.prisma.redesSociais.create({
      data: {
        nome: data.nome,
        link: data.link,
        idautenticacao: Number(myData.idautenticacao)
      }
     })
     
     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const redesSociaisCaminho = path.join(caminhoUsuarios, 'redesSociais')
    const redesSociaisNovo = path.join(redesSociaisCaminho, String(redesSociaisCreated.idRedesSociais))
      let caminhoBanco = path.join(redesSociaisNovo, arquivos[0].originalname)
      await this.geralFunctions.deletePath(redesSociaisNovo);
      await this.geralFunctions.saveFiles(arquivos, redesSociaisNovo);
      await this.prisma.redesSociais.update({
        data: {
          logo: caminhoBanco
        },
        where: {
          idRedesSociais: Number(redesSociaisCreated.idRedesSociais)
        }
      });
    }
     return res.status(200).send("Rede social cadastrada com sucesso.");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async update(id, data: redesSociaisDTO, arquivos,req, res){
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     const redesSociaisExists = await this.prisma.redesSociais.findFirst({
      where: {
        idRedesSociais: Number(id)
      }
     });

     if (!redesSociaisExists){
      return res.status(404).send("A rede social enviada não foi encontrada no sistema.");
     }

     if (redesSociaisExists.idautenticacao != myData.idautenticacao){
      return res.status(401).send("Você não tem permissão para atualizar a rede social de outro usuario.");
     }

     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
      const redesSociaisCaminho = path.join(caminhoUsuarios, 'redesSociais')
      const redesSociaisEncontrado = path.join(redesSociaisCaminho, String(redesSociaisExists.idRedesSociais))
        let caminhoBanco = path.join(redesSociaisEncontrado, arquivos[0].originalname)
      await this.geralFunctions.deletePath(redesSociaisEncontrado);
      await this.geralFunctions.saveFiles(arquivos, redesSociaisEncontrado);
      data.logo = redesSociaisEncontrado
    }

     await this.prisma.redesSociais.update({
      where: {
        idRedesSociais: Number(id)
      },
      data:{
        nome: data.nome,
        link: data.link,
        logo: data.logo
      }
     })

     return res.status(200).send("Rede social atualizada com sucesso.");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async delete(id, req, res){
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

      const redesSociaisExists = await this.prisma.redesSociais.findFirst({
        where: {
          idRedesSociais: Number(id)
        }
       });
  
       if (!redesSociaisExists){
        return res.status(404).send("A rede social enviada não foi encontrada no sistema.");
       }
  
       if (redesSociaisExists.idautenticacao != myData.idautenticacao){
        return res.status(401).send("Você não tem permissão para apagar a rede social de outro usuario.");
       }

     await this.prisma.redesSociais.delete({
      where: {
        idRedesSociais: Number(id)
      }
     })

    const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const redesSociais = path.join(caminhoUsuarios, 'redesSociais')
    const redesSociaisID = path.join(redesSociais, String(redesSociaisExists.idRedesSociais))
    await this.geralFunctions.deletePath(redesSociaisID);

     return res.status(200).send("A rede social foi deletada do sistema");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async getAll(filters, start, quantity, req, res) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     filters.idautenticacao = Number(myData.idautenticacao)
      var contagem = await this.prisma.redesSociais.count({
        where: filters
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem
      }

      var data = await this.prisma.redesSociais.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
        orderBy: {
          nome: 'asc'
        },
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhuma rede social encontrada.");
      } else {
        var newData = {
          "redesSociais": data,
          "count": contagem
        }
        return res.status(200).send(newData);
      }

    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

