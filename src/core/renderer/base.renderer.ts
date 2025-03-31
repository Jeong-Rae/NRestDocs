export type RenderParams = {
    identifier: string;
    method: string;
    path: string;
    requestBody: any; // 실제 request JSON
    responseBody: any; // 실제 response JSON
};

export abstract class BaseRenderer {
    /**
     * 주어진 파라미터를 바탕으로 문서를 작성한다.
     */
    abstract render(params: RenderParams): string;
}
