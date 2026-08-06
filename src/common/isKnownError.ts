import { isDomainError } from '@/domain/common/domainErrors';
import { isAdapterError } from '@/interface-adapters/common/adapterErrors';

export function isKnownError(error: Error): boolean {
  return isDomainError(error) || isAdapterError(error);
}
