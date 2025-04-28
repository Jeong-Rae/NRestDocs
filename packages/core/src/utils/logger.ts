const RESET = "\x1b[0m";
const COLORS = {
    info: "\x1b[34m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
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
}

export default Logger;
