import type { DocumentSnapshot } from "@/builders";
import { buildHttpRequestFieldContext } from "@/renderers/contexts/http-request-fields";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class HttpRequestFieldSnippetRenderer implements SnippetRenderer {
    readonly templateName = "request-fields";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const context = buildHttpRequestFieldContext(snapshot);

        const result = await renderer.render(content, context);
        return result;
    }
}
