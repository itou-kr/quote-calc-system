import { format } from 'util';

export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...args: any[]): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...args: any[]): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, ...args: any[]): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, ...args: any[]): void;
}

export interface RootLogger extends Logger {
  createChild(name: string): Logger;
}

export class LoggerImpl implements RootLogger {
  private readonly name: string;

  constructor(name: string = 'ROOT') {
    this.name = name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  createChild(name: string): Logger {
    return new LoggerImpl(name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(level: 'error' | 'warn' | 'info' | 'debug', message: string, ...args: any[]): void {
    //eslint-disable-next-line no-console
    console[level](
      new Date().toISOString(),
      `[${level.toUpperCase().padEnd(5)}]`,
      `${this.name}`,
      '-',
      format(MessageChannel, ...args)
    );
  }
}