export interface RenderParams {
    identifier: string;
    method: string;
    path: string;
    requestBody: any;
    responseBody: any;
}

export interface DocRenderer {
    /** 전체 문서 렌더링 */
    renderFull(params: RenderParams): string;

    /** 개별 스니펫: Overview */
    snippetOverview(params: RenderParams): string;

    /** 개별 스니펫: Request */
    snippetRequest(params: RenderParams): string;

    /** 개별 스니펫: Response */
    snippetResponse(params: RenderParams): string;
}
