export interface IFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface IRegisterUserParams {
    name: string;
    email: string;
    password: string;
  }



export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRelations extends User {
  accounts: Account[];
  sessions: Session[];
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUserWithRelations extends SafeUser {
  accounts: Account[];
  sessions: Session[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface AccountWithUser extends Account {
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface SessionWithUser extends Session {
  user: User;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateAccountInput {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface CreateSessionInput {
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface CreateVerificationTokenInput {
  identifier: string;
  token: string;
  expires: Date;
}