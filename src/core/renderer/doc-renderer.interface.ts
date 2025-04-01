import { DocumentSnippets } from "./doc-snipperts.type";
import { HttpMethod } from "../../types/http";

export interface RenderParams {
    identifier: string;
    method: HttpMethod;
    path: string;
    requestBody: unknown;
    responseBody: unknown;
}

export interface DocRenderer {
    /**
     * 스니펫을 렌더링합니다.
     * @param _params 렌더링에 필요한 파라미터
     * @returns 렌더링된 스니펫
     */
    renderSnippets(_params: RenderParams): DocumentSnippets;
}
