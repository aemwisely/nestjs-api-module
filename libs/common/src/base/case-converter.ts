export function toSnakeCaseKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export function toCamelCaseKey(key: string): string {
  return key.replace(/[_-]([a-zA-Z0-9])/g, (_, character: string) => character.toUpperCase());
}

export function keysToSnakeCase<T>(value: T): T {
  return convertObjectKeys(value, toSnakeCaseKey);
}

export function keysToCamelCase<T>(value: T): T {
  return convertObjectKeys(value, toCamelCaseKey);
}

function convertObjectKeys<T>(value: T, convertKey: (key: string) => string): T {
  if (Array.isArray(value)) {
    return value.map((item) => convertObjectKeys(item, convertKey)) as T;
  }

  if (!isConvertibleObject(value)) {
    return value;
  }

  return Object.entries(value).reduce(
    (converted, [key, item]) => ({
      ...converted,
      [convertKey(key)]: convertObjectKeys(item, convertKey),
    }),
    {} as T,
  );
}

function isConvertibleObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (value instanceof Date || Buffer.isBuffer(value)) {
    return false;
  }

  return Object.prototype.toString.call(value) === '[object Object]';
}
