import {
  PasswordRelatedProps,
  UserDTO,
  toUserDTO,
  toUserFromDTO,
} from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/User/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

import UserMongo from '../models/UserMongo';

export class MongooseUsersRepo implements UsersRepo {
  async save(user: User): Promise<void> {
    await UserMongo.findOneAndUpdate(
      { id: user.id },
      {
        ...user.toCreateProps(),
      },
      { upsert: true },
    );
  }

  async getAll(): Promise<User[]> {
    const userDocs = await UserMongo.find();

    return userDocs.map((userDoc) => {
      const userDTO: UserDTO = toUserDTO(userDoc.toObject());

      const passwordProps: PasswordRelatedProps = this.getPasswordPropsFromDoc(userDoc);

      return toUserFromDTO(userDTO, passwordProps);
    });
  }

  async getById(id: string): Promise<User | null> {
    const userDoc = await UserMongo.findOne({ id });

    if (!userDoc) return null;

    const userDTO: UserDTO = toUserDTO(userDoc.toObject());

    const passwordProps: PasswordRelatedProps = this.getPasswordPropsFromDoc(userDoc);

    return toUserFromDTO(userDTO, passwordProps);
  }

  async getByEmail(email: string): Promise<User | null> {
    const userDoc = await UserMongo.findOne({ email });

    if (!userDoc) return null;

    const userDTO: UserDTO = toUserDTO(userDoc.toObject());

    const passwordProps: PasswordRelatedProps = this.getPasswordPropsFromDoc(userDoc);

    return toUserFromDTO(userDTO, passwordProps);
  }

  async getByPasswordResetToken(token: string): Promise<User | null> {
    const userDoc = await UserMongo.findOne({ passwordResetToken: token });

    if (!userDoc) return null;

    const userDTO: UserDTO = toUserDTO(userDoc.toObject());

    const passwordProps: PasswordRelatedProps = this.getPasswordPropsFromDoc(userDoc);

    return toUserFromDTO(userDTO, passwordProps);
  }

  async deleteById(id: string): Promise<void> {
    await UserMongo.deleteOne({ id });
  }

  private getPasswordPropsFromDoc(userDoc: any): PasswordRelatedProps {
    return {
      hashedPassword: userDoc.hashedPassword,
      passwordChangedAt: userDoc.passwordChangedAt,
      passwordResetToken: userDoc.passwordResetToken,
      passwordResetTokenExpiresAt: userDoc.passwordResetTokenExpiresAt,
    };
  }
}
