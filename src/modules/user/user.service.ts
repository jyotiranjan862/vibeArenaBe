import { UserRepository, userRepository } from './user.repository';
import { IUser } from './user.model';
import { NotFoundError } from '../../errors';

export class UserService {
  constructor(private readonly userRepo: UserRepository = userRepository) {}

  public async getUserProfile(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    return user;
  }

  public async searchUsers(query: string, limit: number): Promise<IUser[]> {
    return this.userRepo.searchUsers(query, limit);
  }
}

export const userService = new UserService();
