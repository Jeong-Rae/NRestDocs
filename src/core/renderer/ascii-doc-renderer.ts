import { DocRenderer, RenderParams } from "./doc-renderer.interface";
import {
    snippetOverview,
    snippetRequestBlock,
    snippetResponseBlock,
    snippetTitle,
} from "./ascii-doc-snippet";
import { DocumentSnippets } from "./doc-snipperts.type";

export class AsciiDocRenderer implements DocRenderer {
    renderSnippets(params: RenderParams): DocumentSnippets {
        const { identifier, method, path, requestBody, responseBody } = params;

        return {
            title: snippetTitle(identifier),
            overview: snippetOverview(method, path),
            request: snippetRequestBlock(requestBody),
            response: snippetResponseBlock(responseBody),
        };
    }
}
