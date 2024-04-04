import { Body, Controller,ForbiddenException,Get, HttpCode, HttpException, HttpStatus, Inject, NotFoundException, Param, ParseIntPipe, Post, Req, Res, SetMetadata, UnauthorizedException, UseGuards } from "@nestjs/common";
import { IntraAuthGuard } from "./intra42/intraguard";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import {Response,Request} from "express"
import { WebsocketService } from "src/realtime/Websocketservice";
import { RoomMember } from "src/typeorm/entities/RoomMember";
import { jwtguard } from "../guards/jwtguqrd";
import { passlogin } from "./intra42/passlogin";
import { TwoFactorAuthenticationService } from "./2fa.service";
import {  UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from  'path'

import { User } from "src/typeorm/entities/User";
import * as fs from 'fs';




@Controller('auth')
export class AuthController
{
    
    constructor( private readonly authService: AuthService,
    private jwtService: JwtService,private readonly websocketService: WebsocketService,private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService){
    }
    @UseGuards(passlogin,IntraAuthGuard)//passlogin
    @Get('42')
    @SetMetadata('isPublic', true)
    handlelogin(@Req() req,@Res() res){
       
     }
 
    @UseGuards(passlogin,IntraAuthGuard)//passlogin
    @Get('42/redirect')
    @SetMetadata('isPublic', true)
    async handleredirect(@Req() req,@Res({passthrough: true}) res: Response){
        
        const jwt = await this.jwtService.signAsync({id:req.user.id});
        res.cookie('jwt',jwt,{httpOnly: true});
        const us = await this.authService.findUser(req.user.id);
        if(req.user.isTwoFactorAuthenticationEnabled == true)
        {
            us.HasAccess = false;

            await this.authService.update(us);
            res.redirect(`${process.env.url_front}/2fa`);
        } 
        else 
        {
            if(us.isNew)
            {
                this.authService.updateUser(req.user.id);
                res.redirect(`${process.env.url_front}/Changeinfo`);
                return;

            }
            res.redirect(`${process.env.url_front}/Home`);
        }
        
    } 
    @Post('update_user')
    @UseGuards(jwtguard)
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
          destination: './avatars', // Adjust the path as necessary
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
            callback(null, filename);
          },
        }),
      }))

    async updateuser(@Req() req:Request,@Res() res:Response,  @UploadedFile() file: Express.Multer.File,@Body() body: any)
    {
        console.log("here");
        const user = req.user as User;
        if(user.login != body.name )
        {
            const isexist = await this.authService.findUserbylogin(body.name);
            if(isexist)
            {
                this.websocketService.emiterrorToUser(user.id.toString(),`${body.name} name is already exist`)
                return ;
            }
            else
                user.login = body.name;
        }
        if(user.avatar != body.avatar)
        {
            user.avatar = `${process.env.url_back}/api/auth/${file.path}`;
        }
        await this.authService.saveuser(user);
        this.websocketService.emitToUser(user.id.toString(),"updated");
        console.log(user);
        res.status(200).send("ok");
        
    }
    
    @Get("avatars/:filename")
    @UseGuards(jwtguard)
    viewFiles(@Param("filename") filename: string, @Res() res) {
        const file = path.join(__dirname, '../../', 'avatars', filename)
        if (!fs.existsSync(file)) {
            throw new HttpException('File Not Found', HttpStatus.NOT_FOUND);
        }
        res.sendFile(file);
    }
    @Get('user')
    async getUser(@Req() req:Request,@Res() res:Response) {
        try{
            const cookie = req.cookies['jwt']; 
            if(!cookie)
            {
                throw new UnauthorizedException();
            }
            const data = await this.jwtService.verifyAsync(cookie);
            if(!data)
            {
                throw new UnauthorizedException();
            }
            const user = await this.authService.findUser(data['id']);

            if(user.HasAccess == false)
            {
                throw new UnauthorizedException("2FA");
            }
            const numberofnotif = await this.authService.findnumberofnotif(user.id);
            res.send(user)
        } 
        catch(e)
        {
            if(e.message == "2FA")
                throw new UnauthorizedException("2FA");
            else
                throw new UnauthorizedException(); 
        }
            
    }
    @Get('user/:id')
    async getUserbyid(@Req() req:Request,@Res() res:Response,@Param('id',ParseIntPipe) id: number) {
        
        const cookie = req.cookies['jwt'];
        if(!cookie)
            throw new UnauthorizedException();
        const data = await this.jwtService.verifyAsync(cookie);
        if(!data)
        { 
            throw new UnauthorizedException();
        }
        const user = await this.authService.findUser(id);
        if(!user)
            throw new NotFoundException();
        else
            res.send(user)
       
            
    }
    @Post('logout')
    async logout(@Res({passthrough: true}) res:Response)
    {
        res.clearCookie('jwt');
        return{message: "success" }
    } 
   
    //////////////////////////////
    
    
     
    
      
      
      
    

   
    
    
    
    

}