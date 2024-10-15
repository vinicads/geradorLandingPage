import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import { LoginFunctions } from 'src/modules/login/functions/login.functions';

@Injectable()
export class usersFunctions {
    constructor(private prisma: PrismaService,
        private readonly loginFunctions: LoginFunctions) { }
    

    async cadastroAutenticacao(data) {
        data.senha = await this.encryptPassword(data.senha)
        return await this.prisma.autenticacao.create({
            data
        });
    }

    async encryptCode(code){
        var codeenc = await bcrypt.hash(code, 10)
        return codeenc;
    }


    async updateAuth(id, data) {
        if (data.senha){
            var senhaenc = await this.encryptPassword(data.senha)
            data.senha = senhaenc
        }else{
            delete data.senha;
        }
        return await this.prisma.autenticacao.update({
            data,
            where: {
                idautenticacao: Number(id)
            }
        })
    }

    async encryptPassword(password){
        var senhaenc = await bcrypt.hash(password, 10)
        return senhaenc;
    }

    async getMyData(req){
        const cookies = req.cookies;
        if (cookies.meuToken) {
            const resultado = await this.loginFunctions.verifyToken(cookies.meuToken)
            if (resultado) {
                const data = await this.prisma.autenticacao.findFirst({
                    where: {
                        email: resultado.email
                    },
                });

                if (data){
                    return data;
                }
            }
        }
        return null
    }


    async verifyUser(email, id?) {
        if (id) {
            return await this.prisma.autenticacao.findFirst({
                where: {
                    email,
                    NOT: {
                        idautenticacao: Number(id)
                    }
                }
            })
        } else {
            return await this.prisma.autenticacao.findFirst({
                where: {
                    email
                }
            })
        }
    }


    async deletaAutenticacao(id) {
        await this.prisma.info.deleteMany({
            where: {
                idautenticacao: Number(id)
            }
        })

        await this.prisma.contato.deleteMany({
            where: {
                idautenticacao: Number(id)
            }
        })

        await this.prisma.redesSociais.deleteMany({
            where: {
                idautenticacao: Number(id)
            }
        })

        await this.prisma.servicos.deleteMany({
            where: {
                idautenticacao: Number(id)
            }
        })

        await this.prisma.sobre.deleteMany({
            where: {
                idautenticacao: Number(id)
            }
        })

        return await this.prisma.autenticacao.delete({
            where: {
                idautenticacao: Number(id)
            }
        })
    }

}
