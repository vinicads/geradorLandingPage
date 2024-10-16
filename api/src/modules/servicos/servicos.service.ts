import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import * as path from 'path';
import { servicosDTO } from './dto/servicos.dto';
import { usersFunctions } from '../users/functions/users.functions';
@Injectable()
export class ServicosService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly usersFunctions: usersFunctions,
    private readonly geralFunctions: functionService,) { }

  async create(data: servicosDTO, arquivos, res, req) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     let servicosCreated = await this.prisma.servicos.create({
      data: {
        titulo: data.titulo,
        texto: data.texto,
        idautenticacao: Number(myData.idautenticacao)
      }
     })
     
     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const servicosCaminho = path.join(caminhoUsuarios, 'servicos')
    const servicosNovo = path.join(servicosCaminho, String(servicosCreated.idServicos))
      let caminhoBanco = path.join(servicosNovo, arquivos[0].originalname)
      await this.geralFunctions.deletePath(servicosNovo);
      await this.geralFunctions.saveFiles(arquivos, servicosNovo);
      await this.prisma.servicos.update({
        data: {
          logo: caminhoBanco
        },
        where: {
          idServicos: Number(servicosCreated.idServicos)
        }
      });
    }
     return res.status(200).send("Serivico cadastrado com sucesso.");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async update(id, data: servicosDTO, arquivos,req, res){
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     const servicosExists = await this.prisma.servicos.findFirst({
      where: {
        idServicos: Number(id)
      }
     });

     if (!servicosExists){
      return res.status(404).send("O servico enviado não foi encontrado no sistema.");
     }

     if (servicosExists.idautenticacao != myData.idautenticacao){
      return res.status(401).send("Você não tem permissão para atualizar o servico de outro usuario.");
     }

     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
      const servicosCaminho = path.join(caminhoUsuarios, 'servicos')
      const servicosNovo = path.join(servicosCaminho, String(servicosExists.idServicos))
        let caminhoBanco = path.join(servicosNovo, arquivos[0].originalname)
      await this.geralFunctions.deletePath(servicosNovo);
      await this.geralFunctions.saveFiles(arquivos, servicosNovo);
      data.logo = caminhoBanco
    }

     await this.prisma.servicos.update({
      where: {
        idServicos: Number(id)
      },
      data:{
        titulo: data.titulo,
        texto: data.texto,
        logo: data.logo
      }
     })

     return res.status(200).send("Servico atualizado com sucesso.");
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

      const servicosExists = await this.prisma.servicos.findFirst({
        where: {
          idServicos: Number(id)
        }
       });
  
       if (!servicosExists){
        return res.status(404).send("O servico enviado não foi encontrado no sistema.");
       }
  
       if (servicosExists.idautenticacao != myData.idautenticacao){
        return res.status(401).send("Você não tem permissão para apagar o servico de outro usuario.");
       }

     await this.prisma.servicos.delete({
      where: {
        idServicos: Number(id)
      }
     })

    const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const servicos = path.join(caminhoUsuarios, 'servicos')
    const servicosID = path.join(servicos, String(servicosExists.idServicos))
    await this.geralFunctions.deletePath(servicosID);

     return res.status(200).send("O servico foi deletado do sistema");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async getCurso(filters, start, quantity, req, res) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     filters.idautenticacao = Number(myData.idautenticacao)
      var contagem = await this.prisma.servicos.count({
        where: filters
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem
      }

      var data = await this.prisma.servicos.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
        orderBy: {
          titulo: 'asc'
        },
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhum servico encontrado.");
      } else {
        var newData = {
          "servicos": data,
          "count": contagem
        }
        return res.status(200).send(newData);
      }

    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

