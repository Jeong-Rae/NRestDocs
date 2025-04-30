import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty } from "es-toolkit/compat";

export type RequestBodySnippetContext = {
    body: string;
};

export function buildRequestBodyContext(snapshot: DocumentSnapshot): RequestBodySnippetContext {
    const { requestBody } = snapshot.http;
    if (isEmpty(requestBody)) {
        return {
            body: "\n",
        };
    }
    return {
        body: JSON.stringify(requestBody, null, 2) + "\n",
    };
}
