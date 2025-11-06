// ...existing code...
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export class LoggerImpl {
  private priority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
  };
  private level: LogLevel;

  constructor(level: LogLevel = "info") {
    this.level = level;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    return this.priority[level] >= this.priority[this.level];
  }

  private format(level: LogLevel, msg: unknown, ...args: unknown[]): string {
    const body =
      typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    const rest = args.length ? " " + args.map(a => (typeof a === "string" ? a : JSON.stringify(a))).join(" ") : "";
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${body}${rest}`;
  }

  private write(stream: NodeJS.WriteStream, level: LogLevel, msg: unknown, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;
    stream.write(this.format(level, msg, ...args) + "\n");
  }

  debug(msg: unknown, ...args: unknown[]): void {
    this.write(process.stdout, "debug", msg, ...args);
  }

  info(msg: unknown, ...args: unknown[]): void {
    this.write(process.stdout, "info", msg, ...args);
  }

  warn(msg: unknown, ...args: unknown[]): void {
    this.write(process.stderr, "warn", msg, ...args);
  }

  error(msg: unknown, ...args: unknown[]): void {
    this.write(process.stderr, "error", msg, ...args);
  }
}

export const Logger = new LoggerImpl();         // デフォルトインスタンス（level: info）
export const NoopLogger = new LoggerImpl("silent"); // ログを抑制したい場合に使用
// 型として使いたい場合にエクスポート
export type Logger = LoggerImpl;