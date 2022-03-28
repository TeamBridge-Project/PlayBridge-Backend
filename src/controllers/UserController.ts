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
    this.controller.post('/:id/delete', this.delete);
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
    let result: any = await this.userService.deleteUser({ email: req.params.id });
    res.json({
      status: true,
      result
    });
  }

  public login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
      const user: any = await this.userService.findUser({ email: req.body.email, password: req.body.password });
      const accessToken = this.userService.generateAccessToken({ email: req.body.email });
      // jwt 리턴
    }
  }

  public register = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password && req.body.nickname && req.body.gender && req.body.birthday && req.body.agreeSms && req.body.agreeEmail) {
      let result: any = await this.userService.createUser({
        email: req.body.email,
        // uid: req.body.uid,
        password: req.body.password,
        nickname: req.body.nickname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        agreeSms: req.body.agreeSms,
        agreeEmail: req.body.agreeEmail
      });
      res.json({
        status: true,
        result
      });
    } else {
      res.status(400);
      res.json({
        status: false
      });
    }
  }
}

export default UserController;
