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
