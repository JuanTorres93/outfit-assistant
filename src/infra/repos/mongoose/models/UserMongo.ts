import mongoose from 'mongoose';

import { UserCreateProps } from '@/domain/entities/User/User';

const userSchema = new mongoose.Schema<UserCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  passwordChangedAt: {
    type: Date,
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetTokenExpiresAt: {
    type: Date,
    required: false,
  },

  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const UserMongo = mongoose.models.User || mongoose.model<UserCreateProps>('User', userSchema);

export default UserMongo;
