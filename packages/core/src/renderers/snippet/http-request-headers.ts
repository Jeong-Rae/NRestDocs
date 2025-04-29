import type { DocumentSnapshot } from "@/builders";
import { buildHttpRequestHeadersContext } from "@/renderers/contexts/http-request-headers";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class HttpRequestHeadersSnippetRenderer implements SnippetRenderer {
    readonly templateName = "request-headers";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const context = buildHttpRequestHeadersContext(snapshot);

        const result = await renderer.render(content, context);
        return result;
    }
}
