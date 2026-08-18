import { userTestCreateProps } from '@/../tests/createEntitiesTest/userCreate';
import { getGetters } from '@/application-layer/dtos/__tests__/_getGettersUtil';
import { User } from '@/domain/entities/User/User';

const sampleUser = User.create({
  ...userTestCreateProps,

  passwordChangedAt: new Date(),
  passwordResetToken: 'sampleHashedResetToken',
  passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
});

const allUserGetters = getGetters(sampleUser);

export const userDTOProperties = allUserGetters.filter(
  (getter) => !getter.toLocaleLowerCase().includes('password'),
);
