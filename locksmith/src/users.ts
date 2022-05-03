import mongoose, { Types } from 'mongoose';

// TODO migrate roles to a groups system

export interface User {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  roles: string[];
  last_active: Date;
  archived: boolean;
  blocked: boolean;
  salt: string;
  password: string;
  reset_tokens: string[];
  token_version: number;
}

const Schema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    salt: String,
    avatar: String,
    roles: {
      type: Array,
      default: ['user'],
    },
    reset_tokens: [String],
    last_active: Date,
    token_version: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true, // creates createdAt and updatedAt
  },
);

const UserModel = mongoose.model<User>('users', Schema);
export default UserModel;
