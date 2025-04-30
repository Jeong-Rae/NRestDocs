import type { DocumentSnapshot } from "@/docgen/builders";
import Logger from "@/utils/logger";
import {
    CurlSnippetRenderer,
    HttpRequestSnippetRenderer,
    RequestBodySnippetRenderer,
    RequestCookiesSnippetRenderer,
    RequestFieldsSnippetRenderer,
    RequestHeadersSnippetRenderer,
} from "../snippet";
import { PathParametersSnippetRenderer } from "../snippet/path-parameters";
import { QueryParametersSnippetRenderer } from "../snippet/query-parameters";
import type { SnippetRenderer } from "../snippet/snippet-renderer.type";
import { TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(private snippets: SnippetRenderer[] = []) {}

    async render(snapshot: DocumentSnapshot): Promise<void> {
        this.snippets.forEach(async (s) => {
            const part = await s.render(snapshot);
            Logger.info(part);
        });
        // return join(compact(parts), "\n\n");
    }
}

export async function createAsciiDocRenderer(): Promise<AsciiDocRenderer> {
    const store = new TemplateStore();
    await store.load();

    const snippets = [
        new CurlSnippetRenderer(store),
        new HttpRequestSnippetRenderer(store),
        new RequestBodySnippetRenderer(store),
        new RequestHeadersSnippetRenderer(store),
        new RequestFieldsSnippetRenderer(store),
        new RequestCookiesSnippetRenderer(store),
        new PathParametersSnippetRenderer(store),
        new QueryParametersSnippetRenderer(store),
    ];
    return new AsciiDocRenderer(snippets);
}
