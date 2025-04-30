import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty } from "es-toolkit/compat";

export type ResponseBodySnippetContext = {
    language: string;
    body: string;
};

export function buildResponseBodyContext(snapshot: DocumentSnapshot): ResponseBodySnippetContext {
    const { responseBody } = snapshot.http;
    if (isEmpty(responseBody)) {
        return {
            language: "json",
            body: "\n",
        };
    }
    return {
        language: "json",
        body: JSON.stringify(responseBody, null, 2) + "\n",
    };
}
