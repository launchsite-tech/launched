/**
 * @internal
 *
 * Generate an error message.
 *
 * @param msg - The error message
 */
export function generateError(msg: string): string {
  return `[𖣠] Launched error: ${msg}`;
}

/**
 * @internal
 *
 * Throw an error.
 *
 * @param msg - The error message
 */
export default function error(msg: string): never {
  throw new Error(generateError(msg));
}
