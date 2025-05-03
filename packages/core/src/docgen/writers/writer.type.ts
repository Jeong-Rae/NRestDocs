export interface DocumentWriter {
    write(identifier: string, snippets: Record<string, string>): Promise<void>;
}
