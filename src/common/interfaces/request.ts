import { User } from '@supabase/supabase-js';

export interface IExtendedUser extends User {
  sub: string;
}
export interface IExtendedRequest extends Request {
  user?: IExtendedUser;
}
