import { User, UserProfile } from '../entity/user/user.entity';
import { AuthProvider } from '../entity/user/AuthProvider';

export interface CreateUserData {
  email: string;
  username?: string;
  avatar?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  providers?: AuthProvider[];
  verificationCode?: number;
  verificationExpiry?: Date;
  passwordHash?: string;
  role?: 'citizen' | 'admin';
  profile?: UserProfile;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRepository {
  createUser(userData: CreateUserData): Promise<User>;
  findAllUsers(skip?: number, limit?: number): Promise<{ users: User[]; total: number }>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  findByProvider(type: string, providerId: string): Promise<User | null>;
  updateUser(id: string, user: User): Promise<User | null>;
}
