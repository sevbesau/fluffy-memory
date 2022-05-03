import express from 'express';
import { Project } from '../../models/projects';
import { User } from '../../users';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
