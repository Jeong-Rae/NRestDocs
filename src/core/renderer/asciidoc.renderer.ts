import { BaseRenderer, RenderParams } from "./base.renderer";
import { StringLineBuilder } from "../../utils/stringlinebuilder";
import {
    renderTitle,
    renderOverview,
    renderRequestBlock,
    renderResponseBlock,
} from "./asciidoc-blocks";

export class AsciiDocRenderer extends BaseRenderer {
    render(params: RenderParams): string {
        const { identifier, method, path, requestBody, responseBody } = params;

        const sb = new StringLineBuilder();

        sb.append(renderTitle(identifier))
            .append(`:method: ${method}`)
            .append(`:path: ${path}`)
            .append("")
            .append(renderOverview(method, path))
            .append(renderRequestBlock(requestBody))
            .append(renderResponseBlock(responseBody));

        return sb.toString();
    }
}
