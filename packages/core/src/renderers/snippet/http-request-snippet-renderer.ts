import type { DocumentSnapshot } from "@/builders";
import { buildHttpRequestContext } from "@/renderers/contexts/http-request";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class HttpRequestSnippetRenderer implements SnippetRenderer {
    readonly templateName = "http-request";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const context = buildHttpRequestContext(snapshot);

        return renderer.render(content, context);
    }
}
