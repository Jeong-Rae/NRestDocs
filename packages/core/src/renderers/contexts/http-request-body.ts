import type { DocumentSnapshot } from "@/builders";

export type HttpRequestBodySnippetContext = {
    body: string;
};

export function buildHttpRequestBodyContext(
    snapshot: DocumentSnapshot
): HttpRequestBodySnippetContext {
    const { requestBody } = snapshot.http;
    return {
        body: JSON.stringify(requestBody, null, 2) + "\n",
    };
}
