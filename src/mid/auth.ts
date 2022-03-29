import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

const noAuthList: Array<{ path: string, method: string }> = [
  {
    path: '/user',
    method: 'POST'
  },
  {
    path: '/user/login',
    method: 'POST'
  }
];

async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userService: UserService = new UserService();
  const noAuthPath = noAuthList.find(element => element.path == req.path);
  const noAuthMethod = noAuthList.find(element => element.method == req.method);

  if (req.header('X-Access-Token') && req.header('X-Refresh-Token')) {
    const accessToken: string | jwt.JwtPayload | null = verifyToken(req.header('X-Access-Token')!);
    const refreshTokenUser: any = await userService.findUser({ refreshToken: req.header('X-Refresh-Token') });

    if (!accessToken) {
      if (refreshTokenUser.length == 0) {
        res.status(401);
        res.json({
          status: false,
          result: '인증 오류'
        });
      } else {
        const newAccessToken: string = UserService.generateAccessToken({});
        res.set('X-Access-Token', newAccessToken);
        next();
      }
    } else {
      if (refreshTokenUser.length == 0) {
        const newRefreshToken: string = UserService.generateRefreshToken({});
        res.set('X-Refresh-Token', newRefreshToken);
        next();
      } else {
        next();
      }
    }
  } else if (noAuthPath && noAuthMethod) {
    next();
  } else {
    res.status(401);
    res.json({
      status: false,
      result: '인증 오류'
    });
  }
}

function verifyToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWTSECRET!);
  } catch (e) {
    return null;
  }
}

export default auth;
