export default function error(msg: string): never {
  throw new Error(`Launched error: ${msg}`);
}
