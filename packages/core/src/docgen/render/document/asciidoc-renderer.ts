import type { DocumentSnapshot } from "@/docgen/builders";
import { compact, join } from "es-toolkit/compat";
import { ResponseHeadersSnippetRenderer, type SnippetRenderer } from "../snippet";
import { TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(private snippets: SnippetRenderer[] = []) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const parts: string[] = [];
        this.snippets.forEach(async (s) => {
            const part = await s.render(snapshot);
            console.log(part);
        });
        return join(compact(parts), "\n\n");
    }
}

export async function createAsciiDocRenderer(): Promise<AsciiDocRenderer> {
    const store = new TemplateStore();
    await store.load();

    const snippets = [
        // new CurlSnippetRenderer(store),
        // new HttpRequestSnippetRenderer(store),
        // new HttpResponseSnippetRenderer(store),
        // new PathParametersSnippetRenderer(store),
        // new QueryParametersSnippetRenderer(store),
        // new RequestHeadersSnippetRenderer(store),
        new ResponseHeadersSnippetRenderer(store),
        // new RequestCookiesSnippetRenderer(store),
        // new ResponseCookiesSnippetRenderer(store),
        // new RequestBodySnippetRenderer(store),
        // new ResponseBodySnippetRenderer(store),
        // new RequestFieldsSnippetRenderer(store),
        // new ResponseFieldsSnippetRenderer(store),
    ];
    return new AsciiDocRenderer(snippets);
}
