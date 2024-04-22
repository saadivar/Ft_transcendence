import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: `${process.env.url_front}`, credentials: true, preflightContinue: true, });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ limit: '2mb' }));
  await app.listen(3000);
  
}
bootstrap();

// import * as session from 'express-session'

// app.use(session({
//   secret: 'zabawshtasaba',
//   saveUninitialized: false,
//   resave: false,
//   cookie:{
//     maxAge:60000,
//   },
// }));

// app.use(passport.initialize());
// app.use(passport.session());