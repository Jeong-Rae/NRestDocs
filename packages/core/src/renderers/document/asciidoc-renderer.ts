import type { DocumentSnapshot } from "@/builders";
import Logger from "@/utils/logger";
import { CurlSnippetRenderer } from "../snippet/curl-snippet-renderer";
import { HttpRequestBodySnippetRenderer } from "../snippet/http-request-body";
import { HttpRequestFieldSnippetRenderer } from "../snippet/http-request-fields";
import { HttpRequestHeadersSnippetRenderer } from "../snippet/http-request-headers";
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
        new HttpRequestBodySnippetRenderer(store),
        new HttpRequestHeadersSnippetRenderer(store),
        new HttpRequestFieldSnippetRenderer(store),
    ];
    return new AsciiDocRenderer(snippets);
}
