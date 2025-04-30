import type { DocumentSnapshot } from "@/builders";

export interface SnippetRenderer {
    readonly templateName: string;
    render(snapshot: DocumentSnapshot): Promise<string>;
}
