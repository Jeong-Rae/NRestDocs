import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty } from "es-toolkit/compat";
import { type SnippetRenderer, snippetRegistry } from "../snippet";
import { TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(private snippets: SnippetRenderer[] = []) {}

    async render(snapshot: DocumentSnapshot): Promise<Record<string, string>> {
        const documents: Record<string, string> = {};
        await Promise.all(
            this.snippets.map(async (snippet) => {
                const rendered = await snippet.render(snapshot);
                if (isEmpty(rendered)) {
                    return;
                }
                documents[snippet.templateName] = rendered;
            })
        );
        return documents;
    }
}

export async function createAsciiDocRenderer(): Promise<AsciiDocRenderer> {
    const store = new TemplateStore();
    await store.load();

    const registry = snippetRegistry(store);

    const snippets = [
        registry.curlRequest,
        registry.httpRequest,
        registry.httpResponse,
        registry.pathParameters,
        registry.queryParameters,
        registry.requestHeaders,
        registry.responseHeaders,
        registry.requestCookies,
        registry.responseCookies,
        registry.requestBody,
        registry.responseBody,
        registry.requestFields,
        registry.responseFields,
    ];
    return new AsciiDocRenderer(snippets);
}
