import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { LoginFunctions } from '../login/functions/login.functions';
import { functionService } from 'src/middlewares/geralFunctions';
import * as path from 'path';
import { sobreDTO } from './dto/sobre.dto';
import { usersFunctions } from '../users/functions/users.functions';
@Injectable()
export class SobreService {
  constructor(private prisma: PrismaService,
    private readonly loginFunctions: LoginFunctions,
    private readonly usersFunctions: usersFunctions,
    private readonly geralFunctions: functionService,) { }

  async create(data: sobreDTO, arquivos, res, req) {
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     let sobreCreated = await this.prisma.sobre.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        idautenticacao: Number(myData.idautenticacao)
      }
     })
     
     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const sobreCaminho = path.join(caminhoUsuarios, 'sobre')
    const sobreNovo = path.join(sobreCaminho, String(sobreCreated.idSobre))
      let caminhoBanco = path.join(sobreNovo, arquivos[0].originalname)
      await this.geralFunctions.deletePath(sobreNovo);
      await this.geralFunctions.saveFiles(arquivos, sobreNovo);
      await this.prisma.sobre.update({
        data: {
          foto: caminhoBanco
        },
        where: {
          idSobre: Number(sobreCreated.idSobre)
        }
      });
    }
     return res.status(200).send("Sobre cadastrado com sucesso.");
    } catch (error) {
      return res.status(500).send("Dados incorretos." + error);
    }
  }

  async update(id, data: sobreDTO, arquivos,req, res){
    try {
      const myData = await this.usersFunctions.getMyData(req);
      if (!myData){
        return res.status(401).send("Não foi possível obter seus dados.");
      }

     const sobreExists = await this.prisma.sobre.findFirst({
      where: {
        idSobre: Number(id)
      }
     });

     if (!sobreExists){
      return res.status(404).send("O sobre enviado não foi encontrado no sistema.");
     }

     if (sobreExists.idautenticacao != myData.idautenticacao){
      return res.status(401).send("Você não tem permissão para atualizar o sobre de outro usuario.");
     }

     if (arquivos.length > 0) {
      const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
      const sobreCaminho = path.join(caminhoUsuarios, 'sobre')
      const sobreNovo = path.join(sobreCaminho, String(sobreExists.idSobre))
        let caminhoBanco = path.join(sobreNovo, arquivos[0].originalname)
      await this.geralFunctions.deletePath(sobreNovo);
      await this.geralFunctions.saveFiles(arquivos, sobreNovo);
      data.foto = caminhoBanco
    }

     await this.prisma.sobre.update({
      where: {
        idSobre: Number(id)
      },
      data:{
        titulo: data.titulo,
        descricao: data.descricao,
        foto: data.foto
      }
     })

     return res.status(200).send("Sobre atualizado com sucesso.");
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

      const sobreExists = await this.prisma.sobre.findFirst({
        where: {
          idSobre: Number(id)
        }
       });
  
       if (!sobreExists){
        return res.status(404).send("O sobre enviado não foi encontrado no sistema.");
       }
  
       if (sobreExists.idautenticacao != myData.idautenticacao){
        return res.status(401).send("Você não tem permissão para apagar o sobre de outro usuario.");
       }

     await this.prisma.servicos.delete({
      where: {
        idServicos: Number(id)
      }
     })

    const caminhoUsuarios = path.join('usuarios', String(myData.idautenticacao))
    const sobre = path.join(caminhoUsuarios, 'sobre')
    const sobreID = path.join(sobre, String(sobreExists.idSobre))
    await this.geralFunctions.deletePath(sobreID);

     return res.status(200).send("O sobre foi deletado do sistema");
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
      var contagem = await this.prisma.sobre.count({
        where: filters
      });

      if (!start) {
        start = 0;
      }

      if (!quantity) {
        quantity = contagem
      }

      var data = await this.prisma.sobre.findMany({
        where: filters,
        skip: Number(start),
        take: Number(quantity),
        orderBy: {
          titulo: 'asc'
        },
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send("Nenhum sobre encontrado.");
      } else {
        var newData = {
          "sobre": data,
          "count": contagem
        }
        return res.status(200).send(newData);
      }

    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

