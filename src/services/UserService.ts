import UserRepository from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';

const accessOptions = {
  expiresIn: '3d',
  issuer: 'PlayBridge',
  subject: 'accessToken'
};

const refreshOptions = {
  expiresIn: '30d',
  issuer: 'PlayBridge',
  subject: 'refreshToken'
};

class UserService extends UserRepository {
  public findUser(filter: object) {
    return this.find(filter);
  }

  public createUser(query: object) {
    return this.create(query);
  }

  public updateUser(filter: object, query: object) {
    return this.updateOne(filter, query);
  }

  public deleteUser(filter: object) {
    return this.deleteOne(filter);
  }

  public static generateAccessToken(payload: object) {
    const accessToken = jwt.sign(payload, process.env.JWTSECRET!, accessOptions);
    return accessToken;
  }

  public static generateRefreshToken(payload: object) {
    const refreshToken = jwt.sign(payload, process.env.JWTSECRET!, refreshOptions);
    return refreshToken;
  }
}

export default UserService;
