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
import { FriendsService } from "src/friends/friends.service";
import { GameService } from "src/game/game.service";




@Controller('auth')
export class AuthController
{
    
    constructor( private readonly authService: AuthService,
    private jwtService: JwtService,private readonly websocketService: WebsocketService,private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,private readonly friendservice: FriendsService,private readonly gameservice: GameService){
    }
    @UseGuards(passlogin,IntraAuthGuard)
    @Get('42')
    @SetMetadata('isPublic', true)
    handlelogin(@Req() req,@Res() res){
       
     }
 
    @UseGuards(passlogin,IntraAuthGuard)
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
                
                res.redirect(`${process.env.url_front}/Changeinfo`);
                return;

            }
            res.redirect(`${process.env.url_front}/Home`);
        }
        
    }
    private isImageFile(filename: string): boolean {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = path.extname(filename).toLowerCase();
        return allowedExtensions.includes(ext);
      }
    @Post('update_user')
    @UseGuards(jwtguard)
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
          destination: './avatars',
          filename: (req, file, callback) => {
           
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
            callback(null, filename);
          },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
          },
      }))

    async updateuser(@Req() req:Request,@Res() res:Response,  @UploadedFile() file: Express.Multer.File,@Body() body: any)
    {
        const user = req.user as User;
        if (file && !this.isImageFile(file.originalname)) {
            this.websocketService.emiterrorToUser(user.id.toString(),"error occured");
            return res.status(400).send('Only image files are allowed');
          }
        if(user.login != body.name )
        {
            if (body.name == "") { this.websocketService.emiterrorToUser(user.id.toString(),`empty name`)
                 return ; } 
            if (body.name.length > 8 ) { this.websocketService.emiterrorToUser(user.id.toString(),`name is too long`) 
                return ; }
            const isexist = await this.authService.findUserbylogin(body.name);
            if (isexist)
            {
                this.websocketService.emiterrorToUser(user.id.toString(),`${body.name} name is already exist`)
                return ;
            }
            else
                user.login = body.name;
        }
        if (user.avatar != body.avatar)
        {
            user.avatar = `${process.env.url_back}/api/auth/${file.path}`;
        }
        await this.authService.saveuser(user);
        this.websocketService.emitToUser(user.id.toString(),"updated");
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
    @Get("numofnotif")
    @UseGuards(jwtguard)
    async numofnotif(@Req() req:Request,@Res() res:Response)
    {
        const user = req.user as User;
        if(user)
        {
            const n = await this.authService.findnumberofnotif(user.id);
            res.send(JSON.stringify(n));
        }
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
    @UseGuards(jwtguard)
    async getUserbyid(@Req() req:Request,@Res() res:Response,@Param('id',ParseIntPipe) id: number) {
        try{
            const user = req.user as User;
        const user1 = await this.authService.findUser(id);
        if(!user1)
        {
            throw new NotFoundException();
        }
        else
        {
            const games = await this.gameservice.findgames(user1);
            let totalwin :number = 0;
         for(let i = 0;i < games.length ; i++)
            {
                
                if(games[i].winner.id== user1.id)
                    totalwin++;
            } 
            const acheivment = await this.gameservice.acheivment(user1);
            const userwitgames = {
                id:user1.id,
                avatar: user1.avatar,
                login:user1.login,
                games:games,
                totalplayed:games.length,
                wins: totalwin ,
                loses:games.length - totalwin,
                acheivment:acheivment,

            }
            res.send(userwitgames)
        }
        }
        catch
        {
            throw new NotFoundException();
        }
        
       
            
    }
    
   
    @Get('logout')
        @UseGuards(jwtguard)
        async logout(@Req() req:Request,@Res() res:Response)
        {
            const user = req.user as User;
            
            res.clearCookie('jwt');
            user.status = "offline";
           await  this.authService.update(user);
           
            const friends = await this.friendservice.findAllacceotedfriends(user);
            for(let i = 0; i < friends.length;i++)
            {
                this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
            }
            this.websocketService.deletefrommap(user.id.toString());
            res.send("ok");
        } 

   
    //////////////////////////////
    
    
     
    
      
      
      
    

   
    
    
    
    

}