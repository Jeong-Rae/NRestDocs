const RESET = "\x1b[0m";
const COLORS = {
    info: "\x1b[34m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[32m",
};

class Logger {
    static info(...args: unknown[]): void {
        console.log(`${COLORS.info}[INFO]${RESET}`, ...args);
    }

    static warn(...args: unknown[]): void {
        console.warn(`${COLORS.warn}[WARN]${RESET}`, ...args);
    }

    static error(...args: unknown[]): void {
        console.error(`${COLORS.error}[ERROR]${RESET}`, ...args);
    }

    static debug(...args: unknown[]): void {
        console.debug(`${COLORS.debug}[DEBUG]${RESET}`, ...args);
    }
}

export default Logger;
