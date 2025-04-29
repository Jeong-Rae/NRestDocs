import type { DocumentSnapshot } from "@/builders";
import { buildHttpRequestBodyContext } from "@/renderers/contexts/http-request-body";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class HttpRequestBodySnippetRenderer implements SnippetRenderer {
    readonly templateName = "request-body";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const context = buildHttpRequestBodyContext(snapshot);

        const result = await renderer.render(content, context);
        return result;
    }
}
