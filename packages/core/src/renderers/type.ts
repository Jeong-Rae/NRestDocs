export interface TemplateRenderer {
    render(template: string, data: any): Promise<string>;
}
