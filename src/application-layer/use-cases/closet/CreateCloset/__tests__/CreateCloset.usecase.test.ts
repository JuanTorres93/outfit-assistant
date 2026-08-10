import { beforeEach, describe, expect, it } from 'vitest';

import { closetTestCreateProps } from '@/../tests/createEntitiesTest/closetCreate';
import { IdGenerator } from '@/application-layer/services/IdGenerator.port';
import { AlreadyExistsDomainError } from '@/domain/common/domainErrors';
import { Closet } from '@/domain/entities/Closet/Closet';
import { MemoryClosetsRepo } from '@/infra/repos/Memory/MemoryClosetsRepo';
import { CryptoUUIDIdGenerator } from '@/infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';

import { CreateClosetUsecase } from '../CreateCloset.usecase';

describe('CreateClosetUsecase', () => {
  let closetsRepo: MemoryClosetsRepo;
  let idGenerator: IdGenerator;

  let createClosetUsecase: CreateClosetUsecase;
  let closet: Closet;

  beforeEach(async () => {
    closetsRepo = new MemoryClosetsRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    createClosetUsecase = new CreateClosetUsecase(closetsRepo, idGenerator);

    closet = await createClosetUsecase.execute({
      userId: closetTestCreateProps.userId,
    });
  });

  describe('Execute', () => {
    it('should create closet', () => {
      expect(closet.userId).toBe(closetTestCreateProps.userId);
      expect(closet.garmentIds).toEqual([]);
      expect(closet.id).toBeDefined();
      expect(closet.createdAt).toBeDefined();
      expect(closet.updatedAt).toBeDefined();
    });

    it('should persist the closet in the repo', async () => {
      const savedCloset = await closetsRepo.getById(closet.id);

      expect(savedCloset).not.toBeNull();
      expect(savedCloset?.toCreateProps()).toEqual(closet.toCreateProps());
    });
  });

  describe('Errors', () => {
    it('should throw error when user already has a closet', async () => {
      await expect(
        createClosetUsecase.execute({ userId: closetTestCreateProps.userId }),
      ).rejects.toThrow(AlreadyExistsDomainError);
    });
  });
});
