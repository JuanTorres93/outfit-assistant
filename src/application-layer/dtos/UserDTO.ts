import { User } from '@/domain/entities/User/User';

export type UserDTO = {
  id: string;

  name: string;
  email: string;

  createdAt?: string;
  updatedAt?: string;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,

    name: user.name,
    email: user.email,

    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toUserFromDTO(userDTO: UserDTO, passwordProps: PasswordRelatedProps): User {
  const user = User.create({
    id: userDTO.id,

    name: userDTO.name,
    email: userDTO.email,

    hashedPassword: passwordProps.hashedPassword,
    passwordChangedAt: passwordProps.passwordChangedAt,
    passwordResetToken: passwordProps.passwordResetToken,
    passwordResetTokenExpiresAt: passwordProps.passwordResetTokenExpiresAt,

    createdAt: userDTO?.createdAt ? new Date(userDTO.createdAt) : undefined,
    updatedAt: userDTO?.updatedAt ? new Date(userDTO.updatedAt) : undefined,
  });

  return user;
}

export type PasswordRelatedProps = {
  hashedPassword: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
};
