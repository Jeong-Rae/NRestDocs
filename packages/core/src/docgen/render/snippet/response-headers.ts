import type { DocumentSnapshot } from "@/docgen/builders";
import { buildResponseHeadersContext } from "../contexts";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class ResponseHeadersSnippetRenderer implements SnippetRenderer {
    readonly templateName = "response-headers";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const context = buildResponseHeadersContext(snapshot);

        const result = await renderer.render(content, context);
        return result;
    }
}
