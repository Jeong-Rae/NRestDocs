import type { DocumentSnapshot } from "@/docgen/builders";
import { buildRequestHeadersContext } from "../contexts";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class RequestHeadersSnippetRenderer implements SnippetRenderer {
    readonly templateName = "request-headers";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const { context, isEmpty } = buildRequestHeadersContext(snapshot);

        if (isEmpty) {
            return "";
        }

        const result = await renderer.render(content, context);
        return result;
    }
}
