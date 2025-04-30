import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty } from "es-toolkit/compat";

export type RequestBodySnippetContext = {
    language: string;
    body: string;
};

export function buildRequestBodyContext(snapshot: DocumentSnapshot): RequestBodySnippetContext {
    const { requestBody } = snapshot.http;
    if (isEmpty(requestBody)) {
        return {
            language: "json",
            body: "\n",
        };
    }
    return {
        language: "json",
        body: JSON.stringify(requestBody, null, 2) + "\n",
    };
}
