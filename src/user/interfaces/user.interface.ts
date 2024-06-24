import { Document } from 'mongoose'

declare global {
  namespace Express {
    export interface User extends Document {
      
      readonly _id: string;
      readonly username: string;
      readonly email: string;
      readonly password: string;
      readonly refreshTokens: string[];
      readonly userId: string;
    }
  }
}