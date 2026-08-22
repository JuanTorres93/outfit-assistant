export function getGetters(obj: unknown): string[] {
  const proto = Object.getPrototypeOf(obj);

  return Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter(([key, descriptor]) => typeof descriptor.get === 'function')
    .map(([key]) => key);
}
