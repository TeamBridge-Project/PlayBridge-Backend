import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import auth from './src/mid/auth';

import userController from './src/controllers/UserController';

const routes: Array<any> = [
  new userController()
];

const middlewares: Array<any> = [
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  methodOverride(),
  cors(),
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
    mongoose.connect(process.env.DB_URL!, { dbName: 'subproject', authSource: 'subproject' }, function (err) {
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
    routes.forEach((route: any) => {
      this.app.use(route.url, route.controller);
    });
  }
}

export default new App().app;
