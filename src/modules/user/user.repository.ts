import { UserModel, IUser } from './user.model';

export class UserRepository {
  public async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select('-passwordHash').lean<IUser | null>().exec();
  }

  public async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username: username.toLowerCase() }).select('-passwordHash').lean<IUser | null>().exec();
  }

  public async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  public async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        isOnline,
        lastSeenAt: new Date(),
      },
    }).exec();
  }

  public async searchUsers(query: string, limit = 20): Promise<IUser[]> {
    return UserModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('username email avatarUrl isOnline lastSeenAt')
      .limit(limit)
      .lean<IUser[]>()
      .exec();
  }
}

export const userRepository = new UserRepository();
