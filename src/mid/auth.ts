import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

declare global {
  namespace Express {
    interface Request {
      email: string | null
    }
  }
};

const noAuthList: Array<{ path: string, method: string }> = [
  {
    path: '/favicon.ico',
    method: 'GET'
  },
  {
    path: '/user',
    method: 'POST'
  },
  {
    path: '/user/login',
    method: 'POST'
  },
  {
    path: '/user/register',
    method: 'POST'
  },
  {
    path: '/user/isvalid',
    method: 'POST'
  },
  {
    path: '/game',
    method: 'GET'
  },
  {
    path: '/api-docs',
    method: 'GET'
  }
];

async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userService: UserService = new UserService();
  const noAuthPath = noAuthList.find(element => element.path == req.path);
  const noAuthMethod = noAuthList.find(element => element.method == req.method);

  if (req.header('X-Access-Token') && req.header('X-Refresh-Token')) {
    const accessToken: string | null = verifyToken(req.header('X-Access-Token')!);
    const refreshTokenUser: any = await userService.findUser({ refreshToken: req.header('X-Refresh-Token') });

    if (!accessToken) {
      if (refreshTokenUser.length == 0) {
        res.status(401);
        res.json({
          status: false,
          result: '인증 오류'
        });
      } else {
        const newAccessToken: string = UserService.generateAccessToken({ email: accessToken });
        res.set('X-Access-Token', newAccessToken);
        req.email = accessToken;
        next();
      }
    } else {
      if (refreshTokenUser.length == 0) {
        const newRefreshToken: string = UserService.generateRefreshToken({ email: accessToken });
        res.set('X-Refresh-Token', newRefreshToken);
        req.email = accessToken;
        next();
      } else {
        req.email = accessToken;
        next();
      }
    }
  } else if ((noAuthPath && noAuthMethod) || req.path.match(/api-docs/)) {
    next();
  } else {
    res.status(401);
    res.json({
      status: false,
      result: '인증 오류'
    });
  }
}

function verifyToken(token: string): string | null {
  try {
    const decoded = JSON.parse(JSON.stringify(jwt.verify(token, process.env.JWTSECRET!)));
    return decoded.email;
  } catch (e) {
    return null;
  }
}

export default auth;
