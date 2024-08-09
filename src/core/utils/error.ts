export function generateError(msg: string): string {
  return `[𖣠] Launched error: ${msg}`;
}

export default function error(msg: string): never {
  throw new Error(generateError(msg));
}
