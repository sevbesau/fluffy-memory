import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import HttpException from './httpException';
import Users, { User } from './users';
import Tokens from './tokens';


export default class AuthController {

  static me() {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        let user;
        // try the access token
        let access_token;
        if (req.headers.authorization && /^Bearer /.test(req.headers.authorization)) access_token = req.headers.authorization.replace(/^Bearer /, '');
        try {
          const data = Tokens.verify_access_token(access_token);
          user = await Users.findOne({ _id: data._id, token_version: data.token_version, archived: false }).exec();
        } catch { }
        // try the refresh token
        if (!user) {
          const refresh_token = req.cookies['refresh-token'];
          if (!refresh_token) throw new HttpException(401, 'not authenticated');
          try {
            const data = Tokens.verify_refresh_token(refresh_token);
            user = await Users.findOne({ _id: data._id, token_version: data.token_version, archived: false }).exec();
          } catch {
            throw new HttpException(401, 'invalid refresh token')
          }
        }
        if (!user) throw new HttpException(401, 'user not found')
        await Users.updateOne({ _id: user._id }, { $set: { last_active: new Date() } })
        // we found a user without an access token, give him a new one
        res.header('authorization', `Bearer ${Tokens.get_access_token(user)}`);
        // set the sanitzed user on the request
        req.user = {};
        [
          '_id',
          'firstname',
          'lastname',
          'username',
          'email',
          'phone',
          'avatar',
          'roles',
          'last_active',
          'blocked',
        ].forEach(field => (user[field] != undefined) && (req.user[field] = user[field]));
        return next();
      } catch (error) {
        return next(error);
      }
    }
  }

  static check(roles?: string[] | string) {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        // dont do anything
        if (!roles) return next();
        if (!req.user) throw new HttpException(401, 'not authenticated');
        // check the users roles
        if (!Array.isArray(roles)) roles = [roles];
        if (roles.some(role => !req.user.roles.includes(role)))
          throw new HttpException(403, 'insufficient permissions');
        return next();
      } catch (error) {
        return next(error);
      }
    }
  }

  private static generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  private static hashPassword(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  static register() {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        // TODO more request validation
        if (!req.body.email || !req.body.password) throw new HttpException(400, 'not all fields are set');
        if (req.body.roles) throw new HttpException(400, 'please dont hack us, join us!')
        const emailExists = await Users.findOne({ email: req.body.email }).exec();
        if (emailExists) return res.status(409).json({ success: false, error: 'user with this email exists' });
        // ok, start creating the user
        const user: any = {};
        [
          'firstname',
          'lastname',
          'username',
          'email',
          'phone',
          'avatar',
        ].forEach(field => req.body[field] && (user[field] = req.body[field]));
        // create a salt and hash the password
        user.salt = AuthController.generateSalt();
        user.password = AuthController.hashPassword(req.body.password, user.salt);
        // save the user
        await new Users(user).save();
        return res.status(200).json({ success: true });
      } catch (error) {
        return next(error);
      }
    }
  }

  static login() {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        // TODO more request validation
        if (!req.body.email || !req.body.password) throw new HttpException(400, 'not all fields are set')
        // does the user exist?
        const user = await Users.findOne({ email: req.body.email }).exec();
        if (!user || !user._id) return res.status(400).json({ success: false, error: 'user not found' });
        // check the password
        // TODO refactor into function 
        let hash = AuthController.hashPassword(req.body.password, user.salt);
        if (hash != user.password) throw new HttpException(403, 'incorrect password');
        // TODO use more secure cookies
        // create and send tokens
        res.cookie('refresh-token', Tokens.get_refresh_token(user), { secure: true });
        res.header('authorization', `Bearer ${Tokens.get_access_token(user)}`);
        return res.json({ success: true });
      } catch (error) {
        return next(error);
      }
    }
  }

  static logout() {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.user) throw new HttpException(400, 'not logged in!');
        await Users.updateOne({ _id: req.user._id }, { $inc: { token_version: 1 } }).exec();
        return res.json({ success: true });
      } catch (error) {
        return next(error);
      }
    }
  }
}