import { Logger } from 'tslog';

export default interface ILogger {
  logger: unknown;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}
