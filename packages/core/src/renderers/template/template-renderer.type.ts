export interface TemplateRenderer {
    render(template: string, data: unknown): Promise<string>;
}
