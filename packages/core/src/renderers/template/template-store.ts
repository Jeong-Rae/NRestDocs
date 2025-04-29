export type TemplateEntry = {
    content: string;
    extension: string;
};

export class TemplateStore {
    private readonly templates = new Map<string, TemplateEntry>();

    add(name: string, entry: TemplateEntry): void {
        this.templates.set(name, entry);
    }

    get(name: string): TemplateEntry {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template not found: ${name}`);
        }
        return template;
    }

    has(name: string): boolean {
        return this.templates.has(name);
    }

    list(): string[] {
        return Array.from(this.templates.keys());
    }
}
