import type { DocumentSnapshot } from "@/docgen/builders";

export interface SnippetRenderer {
    readonly templateName: string;
    render(snapshot: DocumentSnapshot): Promise<string>;
}
