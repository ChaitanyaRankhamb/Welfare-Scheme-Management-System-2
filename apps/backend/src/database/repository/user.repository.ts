import { IUserRepository, CreateUserData } from '../../repository/user.repository';
import { UserId } from '../../entity/user/userId';
import { UserModel } from '../mongo/models/user.model';
import { User } from '../../entity/user/user.entity';

export class UserModelRepo implements IUserRepository {

  private mapToDomain(userDoc: any): User {
    return new User(
      new UserId(userDoc._id.toString()),
      userDoc.email,
      userDoc.username,
      userDoc.avatar,
      userDoc.emailVerified,
      userDoc.isActive,
      userDoc.providers,
      userDoc.verificationCode,
      userDoc.verificationExpiry,
      userDoc.createdAt,
      userDoc.updatedAt,
      userDoc.passwordHash,
      userDoc.role,
      userDoc.profile
    );
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const newUser = new UserModel({
      email: userData.email,
      username: userData.username,
      avatar: userData.avatar,
      emailVerified: userData.emailVerified,
      isActive: userData.isActive,
      providers: userData.providers,
      verificationCode: userData.verificationCode,
      verificationExpiry: userData.verificationExpiry,
      passwordHash: userData.passwordHash,
      role: userData.role,
      profile: userData.profile
    });

    const savedUser = await newUser.save();
    return this.mapToDomain(savedUser);
  }

  async findAllUsers(skip = 0, limit = 20, status?: 'active' | 'inactive'): Promise<{ users: User[]; total: number }> {
    const filters: any = { role: 'citizen' };
    
    if (status === 'active') {
      filters.isActive = true;
    } else if (status === 'inactive') {
      filters.isActive = false;
    }

    const [docs, total] = await Promise.all([
      UserModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(filters)
    ]);
    return {
      users: docs.map(doc => this.mapToDomain(doc)),
      total
    };
  }

  async findUserById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    return this.mapToDomain(userDoc);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return this.mapToDomain(userDoc);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) return null;
    return this.mapToDomain(userDoc);
  }

  async findByProvider(type: string, providerId: string) {
    const userDoc = await UserModel.findOne({ 'providers.type': type, 'providers.providerId': providerId });
    if (!userDoc) return null;
    return this.mapToDomain(userDoc);
  }

  async updateUser(id: string, user: User): Promise<User | null> {
    const updatedDoc = await UserModel.findByIdAndUpdate(
      id,
      {
        email: user.getEmail(),
        username: user.getUsername(),
        avatar: user.getAvatar(),
        emailVerified: user.isEmailVerified(),
        isActive: user.isUserActive(),
        providers: user.getProviders(),
        verificationCode: user.getVerificationCode(),
        verificationExpiry: user.getVerificationExpiry(),
        passwordHash: user.getPasswordHash(),
        role: user.getRole(),
        profile: user.getProfile()
      },
      { new: true }
    );

    if (!updatedDoc) return null;
    return this.mapToDomain(updatedDoc);
  }
}

export const userRepository = new UserModelRepo();
