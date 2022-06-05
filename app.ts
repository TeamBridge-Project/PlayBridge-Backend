import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swagger from './modules/swagger';

import auth from './src/mid/auth';

import UserController from './src/controllers/UserController';
import GameController from './src/controllers/GameController';

const routes: Array<object> = [
  {
    controller: new UserController(),
    path: '/user'
  },
  {
    controller: new GameController(),
    path: '/game'
  }
];

const middlewares: Array<any> = [
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  methodOverride(),
  cors({ exposedHeaders: ['X-Access-Token', 'X-Refresh-Token'] }),
  auth
]

class App {
  public app: express.Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.dbConnection();
    this.setMiddleware();
    this.getRouting();
    mongoose.connection.on('disconnected', this.dbConnection);
  }

  private dbConnection(): void {
    mongoose.connect(process.env.DB_URL!, { dbName: 'playbridge', authSource: 'playbridge' }, function (err) {
      if (err) {
        console.error(`mongodb connection error`, err);
      }
      console.log('mongodb connected');
    });
  }

  private setMiddleware(): void {
    middlewares.forEach((middleware: any) => {
      this.app.use(middleware);
    });
  }

  private getRouting(): void {
    // swagger 정의
    this.app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs));
    this.app.use('/profile-icon', express.static('./profile-icon'));
    routes.forEach((route: any) => {
      this.app.use(route.controller.controller);
    });
  }
}

export default new App().app;
