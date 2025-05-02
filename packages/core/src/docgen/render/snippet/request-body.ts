import type { DocumentSnapshot } from "@/docgen/builders";
import { buildRequestBodyContext } from "../contexts";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export class RequestBodySnippetRenderer implements SnippetRenderer {
    readonly templateName = "request-body";

    constructor(private readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const { extension, content } = this.store.get(this.templateName);
        const renderer = createTemplateRenderer(extension);
        const { context, isEmpty } = buildRequestBodyContext(snapshot);

        if (isEmpty) {
            return "";
        }

        const result = await renderer.render(content, context);
        return result;
    }
}
