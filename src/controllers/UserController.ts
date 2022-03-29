import express, { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import BasicController from './BasicController';
import UserService from '../services/UserService';

class UserController implements BasicController {
  public url: string = '/user';
  public controller: express.Router = express.Router();
  private userService: UserService = new UserService();

  constructor() {
    this.init();
  }

  public init(): void {
    this.controller.get('/', this.user);
    this.controller.post('/', this.register);
    this.controller.post('/:nickname/delete', this.delete);
    this.controller.post('/login', this.login);
  };

  public user = async (req: Request, res: Response) => {
    let result: any = await this.userService.findUser({});
    res.json({
      status: true,
      result
    });
  }

  public delete = async (req: Request, res: Response) => {
    let result: any = await this.userService.deleteUser({ nickname: req.params.nickname });
    res.json({
      status: true,
      result
    });
  }

  public login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
      const user: any = await this.userService.findUser({ email: req.body.email, password: req.body.password });
      if (user.length > 0) {
        const accessToken: string = UserService.generateAccessToken({});
        const refreshToken: string = UserService.generateRefreshToken({});
        await this.userService.updateUser({
          email: req.body.email,
          password: req.body.password
        }, {
          $set: {
            refreshToken: refreshToken
          }
        });
        res.set('X-Access-Token', accessToken);
        res.set('X-Refresh-Token', refreshToken);
        res.json({
          status: true,
          result: []
        });
      }
    }
  }

  public register = async (req: Request, res: Response) => {
    if (req.body.email
      && req.body.password
      && req.body.nickname
      && req.body.gender
      && req.body.birthday
      && req.body.agreeSms != null
      && req.body.agreeEmail != null
    ) {
      const user: any = await this.userService.findUser({});
      if (user.length == 0) {
        const accessToken: string = UserService.generateAccessToken({});
        const refreshToken: string = UserService.generateRefreshToken({});
        await this.userService.createUser({
          email: req.body.email,
          password: req.body.password,
          nickname: req.body.nickname,
          gender: req.body.gender,
          birthday: req.body.birthday,
          agreeSms: req.body.agreeSms,
          agreeEmail: req.body.agreeEmail,
          refreshToken: refreshToken
        });
        res.set('X-Access-Token', accessToken);
        res.set('X-Refresh-Token', refreshToken);
        res.json({
          status: true,
          result: []
        });
      } else {
        res.status(400);
        res.json({
          status: false,
          result: []
        });
      }
    } else {
      res.status(400);
      res.json({
        status: false,
        result: []
      });
    }
  }
}

export default UserController;
