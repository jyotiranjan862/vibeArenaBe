import crypto from 'crypto';
import { UserRepository, userRepository } from '../user/user.repository';
import { RegisterInput, LoginInput } from './auth.validation';
import { ConflictError, UnauthorizedError } from '../../errors';
import { IUser } from '../user/user.model';

export class AuthService {
  constructor(private readonly userRepo: UserRepository = userRepository) {}

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }

  public async register(input: RegisterInput): Promise<IUser> {
    const existingEmail = await this.userRepo.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictError('User with this email already exists');
    }

    const existingUsername = await this.userRepo.findByUsername(input.username);
    if (existingUsername) {
      throw new ConflictError('Username is already taken');
    }

    const passwordHash = this.hashPassword(input.password);
    const user = await this.userRepo.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.passwordHash;
    return userObj as unknown as IUser;
  }

  public async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepo.findByEmail(input.email, true);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = this.verifyPassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // In a fully configured JWT setup, sign JWT here. We provide an opaque secure session token identifier.
    const token = crypto.randomBytes(32).toString('hex');

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.passwordHash;

    return {
      user: userObj as unknown as IUser,
      token,
    };
  }
}

export const authService = new AuthService();
