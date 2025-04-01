import { DocRenderer, RenderParams } from "./doc-renderer.interface";
import { StringLineBuilder } from "../../utils/stringlinebuilder";
import {
    snippetTitle,
    snippetOverview,
    snippetRequestBlock,
    snippetResponseBlock,
} from "./asciidoc-snippet";

export class AsciiDocRenderer implements DocRenderer {
    renderFull(params: RenderParams): string {
        const { identifier, method, path, requestBody, responseBody } = params;

        const sb = new StringLineBuilder();

        sb.append(snippetTitle(identifier))
            .append(`:method: ${method}`)
            .append(`:path: ${path}`)
            .append("")
            .append(snippetOverview(method, path))
            .append(snippetRequestBlock(requestBody))
            .append(snippetResponseBlock(responseBody));

        return sb.toString();
    }

    snippetOverview(params: RenderParams): string {
        return snippetOverview(params.method, params.path);
    }

    snippetRequest(params: RenderParams): string {
        return snippetRequestBlock(params.requestBody);
    }

    snippetResponse(params: RenderParams): string {
        return snippetResponseBlock(params.responseBody);
    }
}
