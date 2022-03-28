import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

function auth(req: Request, res: Response, next: NextFunction): void {
  if (req.headers['X-Access-Token']) {
    jwt.verify(req.headers['X-Access-Token'].toString(), process.env.ACCESSSECRETKEY!, function (err, decoded): void {
      if (err || !decoded) {
        res.status(401);
        res.json({
          status: false,
          message: '권한이 없습니다.'
        });
      } else {
        next();
      }
    });
  } else {
    res.status(401);
    res.json({
      status: false,
      message: '권한이 없습니다.'
    });
  }
}

export default auth;
