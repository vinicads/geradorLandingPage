import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class LoginFunctions {
    constructor(
    private jwt: JwtService,
    private prisma: PrismaService) { }

    async generateToken(email){
        var token = this.jwt.sign({email})
        return token
    }

    async verifyToken(token){
        var result
        try{
        const { email } = this.jwt.verify(token);
        result = {
            email
        };
        return result
    } catch (error) {
        result = null;
        return result;
    }
  
    }
}
