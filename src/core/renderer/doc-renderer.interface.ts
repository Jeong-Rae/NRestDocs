import { DocumentSnippets } from "./doc-snipperts.type";

export interface RenderParams {
    identifier: string;
    method: string;
    path: string;
    requestBody: any;
    responseBody: any;
}

export interface DocRenderer {
    renderSnippets(params: RenderParams): DocumentSnippets;
}
