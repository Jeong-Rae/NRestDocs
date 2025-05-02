import type { DocumentSnapshot } from "@/docgen/builders";
import type { Context } from "../contexts";
import type { TemplateStore } from "../template";
import { createTemplateRenderer } from "../template/template-factory";
import type { SnippetRenderer } from "./snippet-renderer.type";

export abstract class BaseSnippetRenderer<C> implements SnippetRenderer {
    abstract readonly templateName: string;

    abstract buildContext(snapshot: DocumentSnapshot): Context<C>;

    constructor(protected readonly store: TemplateStore) {}

    async render(snapshot: DocumentSnapshot): Promise<string> {
        if (!this.store) {
            throw new Error("TemplateStore instance is required.");
        }
        const template = this.store.get(this.templateName);
        if (!template) {
            console.warn(`Template not found: ${this.templateName}`);
            return "";
        }
        const { extension, content } = template;
        const renderer = createTemplateRenderer(extension);

        const { context, isEmpty } = this.buildContext(snapshot);
        if (isEmpty) {
            return "";
        }

        return renderer.render(content, context);
    }
}

export function makeSnippetRenderer<C>(
    templateName: string,
    contextBuilder: (s: DocumentSnapshot) => Context<C>
) {
    return (store: TemplateStore): SnippetRenderer =>
        new (class extends BaseSnippetRenderer<C> {
            readonly templateName = templateName;
            buildContext = contextBuilder;
            constructor() {
                super(store);
            }
        })();
}
