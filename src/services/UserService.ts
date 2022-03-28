import UserRepository from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';

class UserService extends UserRepository {
  private accessOptions = {
    expiresIn: '3d',
    issuer: 'PlayBridge',
    subject: 'accessToken'
  };

  private refreshOptions = {
    expiresIn: '30d',
    issuer: 'PlayBridge',
    subject: 'refreshToken'
  };

  public findUser(filter: object) {
    return this.find(filter);
  }

  public createUser(query: object) {
    return this.create(query);
  }

  public deleteUser(filter: object) {
    return this.deleteOne(filter);
  }

  public generateAccessToken(payload: object) {
    const accessToken = jwt.sign(payload, process.env.ACCESSSECRET!, this.accessOptions);
    return accessToken;
  }

  public generateRefreshToken(payload: object) {
    const refreshToken = jwt.sign(payload, process.env.REFRESHSECRET!, this.accessOptions)
  }
}

export default UserService;
