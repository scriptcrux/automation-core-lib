type LogLevel = 'INFO' | 'ERROR' | 'WARN';
type LogListener = (level: LogLevel, message: string) => void;

export class TestLogger {
    private static listeners: LogListener[] = [];

    static registerLogListener(listener: LogListener): void {
        this.listeners.push(listener);
    }

    static clearLogListeners(): void {
        this.listeners = [];
    }

    private static notify(level: LogLevel, formattedMessage: string): void {
        for (const listener of this.listeners) {
            try {
                listener(level, formattedMessage);
            } catch (error) {
                console.error(
                    `[ERROR] [${new Date().toISOString()}]: Log listener failed: ${error instanceof Error ? error.message : String(error)
                    }`
                );
            }
        }
    }

    static info(message: string): void {
        const formatted = `[INFO] [${new Date().toISOString()}]: ${message}`;
        console.log(formatted);
        this.notify('INFO', formatted);
    }

    static error(message: string): void {
        const formatted = `[ERROR] [${new Date().toISOString()}]: ${message}`;
        console.error(formatted);
        this.notify('ERROR', formatted);
    }

    static warn(message: string): void {
        const formatted = `[WARN] [${new Date().toISOString()}]: ${message}`;
        console.warn(formatted);
        this.notify('WARN', formatted);
    }
}