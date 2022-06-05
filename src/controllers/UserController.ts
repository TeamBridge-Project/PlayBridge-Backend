import express, { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import BasicController from './BasicController';
import UserService from '../services/UserService';
import GameService from '../services/GameService';
import { Error } from 'mongoose';

class UserController implements BasicController {
  public controller: express.Router = express.Router();
  private userService: UserService = new UserService();
  private gameService: GameService = new GameService();

  constructor() {
    this.init();
  }

  public init(): void {
    this.controller.get('/user', this.user);
    this.controller.post('/user', this.register);
    this.controller.post('/user/:uuid/profile', this.userProfile);
    this.controller.post('/user/:uuid/delete', this.delete);
    this.controller.post('/user/profile/:uuid/update', this.uploadProfileImage.single('profileIcon'), this.updateProfile);
    this.controller.post('/user/login', this.login);
    this.controller.post('/user/isvalid', this.isValid);
    this.controller.post('/user/removeplayinggames', this.removePlayingGames);
    this.controller.post('/user/addplayinggames', this.addPlayingGames);
  };

  private uploadProfileImage = multer({
    storage: multer.diskStorage({
      destination: function (req: Request, file: Express.Multer.File, cb: Function) {
        cb(null, 'profile-icon/');
      },
      filename: function (req: Request, file: Express.Multer.File, cb: Function) {
        cb(null, file.originalname);
      }
    })
  });

  public addPlayingGames = async (req: Request, res: Response) => { // 게임 추가
    /*
      #swagger.tags = ['User']
      #swagger.security = [{
        'AccessToken': [],
        'RefreshToken': []
      }]
      #swagger.parameters = [
        {
          name: 'playingGames',
          in: 'body',
          type: 'array',
          required: true
        },
        {
          name: 'uuid',
          in: 'body',
          type: 'string',
          required: true
        }
      ]
    */
    const user: any = this.userService.findUser({ email: req.email });
    if (!user || user.length == 0) {
      res.status(401);
      res.json({
        result: [],
        errors: [
          {
            error: 'UnauthorizedError',
            message: '권한이 없습니다.'
          }
        ]
      });
    } else {
      if (!req.body.playingGames || !req.body.uuid) {
        res.status(400);
        res.json({
          result: [],
          errors: [
            {
              error: 'ParamError',
              message: '파라미터가 부족하거나 없습니다.'
            }
          ]
        });
      } else {
        req.body.playingGames.forEach((element: any) => {
          this.userService.updateUser({ uuid: req.body.uuid }, { $push: { playingGames: element } });
        });
        res.json({
          result: [],
          errors: []
        });
      }
    }
  };

  public removePlayingGames = async (req: Request, res: Response) => { // 게임 삭제
    /*
      #swagger.tags = ['User']
      #swagger.security = [{
        'AccessToken': [],
        'RefreshToken': []
      }]
      #swagger.parameters = [
        {
          name: 'playingGames',
          in: 'body',
          type: 'array',
          required: true
        },
        {
          name: 'uuid',
          in: 'body',
          type: 'string',
          required: true
        }
      ]
    */
    const user: any = this.userService.findUser({ email: req.email });
    if (!user || user.length == 0) {
      res.status(401);
      res.json({
        result: [],
        errors: [
          {
            error: 'UnauthorizedError',
            message: '권한이 없습니다.'
          }
        ]
      });
    } else {
      if (!req.body.playingGames || !req.body.uuid) {
        res.status(400);
        res.json({
          result: [],
          errors: [
            {
              error: 'ParamError',
              message: '파라미터가 부족하거나 없습니다.'
            }
          ]
        });
      } else {
        req.body.playingGames.forEach((element: any) => {
          this.userService.updateUser({ uuid: req.body.uuid }, { $pull: { playingGames: element } });
        });
        res.json({
          result: [],
          errors: []
        });
      }
    }
  }

  public updateProfile = async (req: Request, res: Response) => { // 프로필 업데이트
    /*
      #swagger.tags = ['User']
      #swagger.security = [{
        'AccessToken': [],
        'RefreshToken': []
      }]
      #swagger.parameters = [
        {
          name: 'profileIcon',
          in: 'formData',
          type: 'file',
          required: false
        }
      ]
    */
    // interface Update {
    //   aboutMe: string | null,
    //   profileIcon: string | null
    // }
    let user: any = await this.userService.findUser({ email: req.email });
    if (!user || user.length == 0) {
      res.status(401);
      res.json({
        result: [],
        errors: [
          {
            error: 'UnauthorizedError',
            message: '권한이 없습니다.'
          }
        ]
      });
    } else {
      let update: any = { $set: {} };
      if (req.body.aboutMe) {
        update.$set.aboutMe = req.body.aboutMe;
      }
      if (req.file) {
        update.$set.profileIcon = `${process.env.SRVURL}/profile-icon` + req.file.filename;
      }

      let result = await this.userService.updateUser({ uuid: req.params.uuid }, { $set: update });
      res.json({
        result,
        errors: []
      });
    }
  };

  public isValid = async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['User']
    */
    let userInfo = { $or: <object[]>[] };
    if (req.body.nickname) {
      userInfo.$or.push({
        nickname: req.body.nickname
      });
    }
    if (req.body.email) {
      userInfo.$or.push({
        email: req.body.email
      });
    }

    let result: any = await this.userService.findUser(userInfo);
    if (!result || result.length == 0) {
      res.json({
        result: [],
        errors: []
      });
    } else {
      res.json({
        result: [],
        errors: [
          {
            error: 'NotValidError',
            message: '중복이 있습니다.'
          }
        ]
      });
    }
  };

  // public userByNickname = async (req: Request, res: Response) => {
  //   
  // }

  public userProfile = async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['User']
      #swagger.security = [{
        'AccessToken': [],
        'RefreshToken': []
      }]
    */
    let result: any = await this.userService.findUser({
      uuid: req.params.uuid
    }, {
      _id: 0,
      password: 0,
      agreeEmail: 0,
      refreshToken: 0
    });
    if (req.email != result[0].email) {      
      delete result[0].email;
      delete result[0].credit;
      res.json({
        result,
        errors: []
      });
    } else {
      delete result[0].email;
      res.json({
        result,
        errors: []
      });
    }
  }

  public user = async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['User']
      #swagger.parameters = [
        {
          name: 'page',
          in: 'query',
          type: 'number',
          required: false
        }
      ]
    */
    if (req.query.page) {
      const limit = 4;
      const skip = (parseInt(req.query.page.toString()) - 1) * 4;
      let result: any = await this.userService.findUser({}, { _id: 0, refreshToken: 0 }, limit, skip);
      res.json({
        result,
        errors: []
      });
    } else {
      let result: any = await this.userService.findUser({}, { _id: 0, refreshToken: 0 });
      res.json({
        result,
        errors: []
      });
    }
  }

  public delete = async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['User']
      #swagger.security = [{
        'AccessToken': [],
        'RefreshToken': []
      }]
    */
    let user: any = await this.userService.findUser({ uuid: req.params.uuid });
    if (user[0].email == req.email) {
      let result: any = await this.userService.deleteUser({ uuid: req.params.uuid });
      res.json({
        result,
        errors: []
      });
    } else {
      res.status(401);
      res.json({
        result: [],
        errors: [
          {
            error: 'UnauthorizedError',
            message: '권한이 없습니다.'
          }
        ]
      });
    }
  }

  public login = async (req: Request, res: Response) => {
    // #swagger.tags = ['User']
    if (req.body.email && req.body.password) {
      const user: any = await this.userService.findUser({ email: req.body.email, password: req.body.password });
      if (user.length > 0) {
        const accessToken: string = UserService.generateAccessToken({ email: user[0].email });
        const refreshToken: string = UserService.generateRefreshToken({ email: user[0].email });
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
          result: [
            {
              uuid: user[0].uuid
            }
          ],
          errors: []
        });
      } else {
        res.status(400);
        res.json({
          result: [],
          errors: [
            {
              error: 'NoUserError',
              message: '사용자가 존재하지 않습니다.'
            }
          ]
        });
      }
    } else {
      res.json({
        result: [],
        errors: [
          {
            error: 'ParamError',
            message: '파라미터가 없거나 부족합니다.'
          }
        ]
      });
    }
  }

  public register = async (req: Request, res: Response) => {
    // #swagger.tags = ['User']
    if (req.body.email
      && req.body.password
      && req.body.nickname
      && req.body.gender
      && req.body.birthday
      && req.body.agreeEmail != null
    ) {
      try {
        const user: any = await this.userService.findUser({ email: req.body.email });
        if (user.length == 0) {
          const accessToken: string = UserService.generateAccessToken({ email: req.body.email });
          const refreshToken: string = UserService.generateRefreshToken({ email: req.body.email });
          const userUuid: string = uuid();

          await this.userService.createUser({
            uuid: userUuid,
            email: req.body.email,
            password: req.body.password,
            nickname: req.body.nickname,
            profileIcon: null,
            gender: req.body.gender,
            birthday: req.body.birthday,
            credit: 1000,
            agreeEmail: req.body.agreeEmail,
            playingGames: [],
            aboutMe: null,
            refreshToken: refreshToken,
            registeredDate: new Date()
          });
          res.set('X-Access-Token', accessToken);
          res.set('X-Refresh-Token', refreshToken);
          res.json({
            result: [
              {
                uuid: userUuid
              }
            ],
            errors: []
          });
        } else {
          res.status(400);
          res.json({
            result: [],
            errors: [
              {
                error: 'ExistError',
                message: '이미 존재하는 사용자입니다.'
              }
            ]
          });
        }
      } catch (e) {
        if (e instanceof Error.ValidationError) {
          res.status(500);
          res.json({
            result: [],
            errors: [
              {
                error: 'ValidationError',
                message: e.message
              }
            ]
          });
        }
      }
    } else {
      res.status(400);
      res.json({
        result: [],
        errors: [
          {
            error: 'ParamError',
            message: '파라미터가 없거나 부족합니다.'
          }
        ]
      });
    }
  }
}

export default UserController;
