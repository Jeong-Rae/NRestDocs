import type { DocumentSnapshot } from "@/docgen/builders";
import { compact, join } from "es-toolkit/compat";
import { type SnippetRenderer, snippetRegistry } from "../snippet";
import { TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(private snippets: SnippetRenderer[] = []) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const rendered = await Promise.all(this.snippets.map((s) => s.render(snapshot)));
        const parts = compact(rendered);
        return join(parts, "\n\n");
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
