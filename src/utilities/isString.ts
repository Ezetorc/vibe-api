export function isString (object: unknown): object is string {
  return !object || typeof object !== 'string'
}
