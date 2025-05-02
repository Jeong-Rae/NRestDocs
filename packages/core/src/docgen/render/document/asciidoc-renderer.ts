import type { DocumentSnapshot } from "@/docgen/builders";
import { compact, join } from "es-toolkit/compat";
import {
    CurlSnippetRenderer,
    HttpRequestSnippetRenderer,
    HttpResponseSnippetRenderer,
    PathParametersSnippetRenderer,
    QueryParametersSnippetRenderer,
    RequestBodySnippetRenderer,
    RequestCookiesSnippetRenderer,
    RequestFieldsSnippetRenderer,
    RequestHeadersSnippetRenderer,
    ResponseBodySnippetRenderer,
    ResponseCookiesSnippetRenderer,
    ResponseFieldsSnippetRenderer,
    ResponseHeadersSnippetRenderer,
    type SnippetRenderer,
} from "../snippet";
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

    const snippets = [
        CurlSnippetRenderer.of(store),
        HttpRequestSnippetRenderer.of(store),
        HttpResponseSnippetRenderer.of(store),
        PathParametersSnippetRenderer.of(store),
        QueryParametersSnippetRenderer.of(store),
        RequestHeadersSnippetRenderer.of(store),
        ResponseHeadersSnippetRenderer.of(store),
        RequestCookiesSnippetRenderer.of(store),
        ResponseCookiesSnippetRenderer.of(store),
        RequestBodySnippetRenderer.of(store),
        ResponseBodySnippetRenderer.of(store),
        RequestFieldsSnippetRenderer.of(store),
        ResponseFieldsSnippetRenderer.of(store),
    ];
    return new AsciiDocRenderer(snippets);
}
