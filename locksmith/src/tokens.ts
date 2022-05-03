import jwt from 'jsonwebtoken';

import { User } from "./users";

import envalidate from '@siliconminds/envalidate';
envalidate(['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET']);

const ALLOWED_USER_FIELDS = [
  '_id',
  'token_version',
  'firstname',
  'lastname',
  'username',
  'email',
  'phone',
  'avatar',
  'roles',
  'blocked',
  'last_active',
];

const get_sanitized_user = (user: User) => {
  let sanitized = {};
  ALLOWED_USER_FIELDS.forEach(field => (user[field] != undefined) && (sanitized[field] = user[field]));
  return sanitized;
}

export default class Tokens {
  static get_access_token(user: User): string {
    return jwt.sign(get_sanitized_user(user), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
  }

  static get_refresh_token(user: User): string {
    return jwt.sign(get_sanitized_user(user), process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  }

  static verify_access_token(token: string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  }

  static verify_refresh_token(token: string) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  }
}