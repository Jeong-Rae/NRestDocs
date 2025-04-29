import type { DocumentSnapshot } from "@/builders";
import { compact, join } from "es-toolkit/compat";
import { CurlSnippetRenderer } from "../snippet/curl-snippet-renderer";
import type { SnippetRenderer } from "../snippet/snippet-renderer.type";
import { TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(private snippets: SnippetRenderer[] = []) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const parts = await Promise.all(this.snippets.map((s) => s.render(snapshot)));
        return join(compact(parts), "\n\n");
    }
}

export async function createAsciiDocRenderer(): Promise<AsciiDocRenderer> {
    const store = new TemplateStore();
    await store.load({ useDefault: false });

    const snippets = [new CurlSnippetRenderer(store)];
    return new AsciiDocRenderer(snippets);
}
