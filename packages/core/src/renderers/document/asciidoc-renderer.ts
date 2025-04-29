import type { DocumentSnapshot } from "@/builders";
import { compact, join } from "es-toolkit/compat";
import { CurlSnippetRenderer } from "../snippet/curl-snippet-renderer";
import type { SnippetRenderer } from "../snippet/snippet-renderer.type";
import { DEFAULT_TEMPLATE_NAMES, type TemplateStore } from "../template";

export class AsciiDocRenderer {
    constructor(
        private readonly store: TemplateStore,
        private readonly snippets: SnippetRenderer[] = [new CurlSnippetRenderer(this.store)]
    ) {}

    async load(): Promise<void> {
        await this.store.load(DEFAULT_TEMPLATE_NAMES);
    }

    async render(snapshot: DocumentSnapshot): Promise<string> {
        const parts = await Promise.all(this.snippets.map((s) => s.render(snapshot)));
        return join(compact(parts), "\n\n");
    }
}
