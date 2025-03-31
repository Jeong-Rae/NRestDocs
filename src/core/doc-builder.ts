import { Response } from "supertest";
import { DocOptions } from "../types/doc-options";
import { getNRestDocsConfig } from "./config";
import { FieldBuilderOptional } from "./withField";

export class DocRequestBuilder {
    private readonly supertestPromise: Promise<Response>;
    private options: DocOptions = {};

    constructor(supertestPromise: Promise<Response>) {
        this.supertestPromise = supertestPromise;
    }

    /** API 설명 추가 */
    withDescription(desc: string): this {
        this.options.description = desc;
        return this;
    }

    /** 요청 필드 정의 */
    withRequestFields(fields: FieldBuilderOptional[]): this {
        this.options.requestFields = fields.map((field) => {
            const descriptor = field.toDescriptor();
            return {
                field: descriptor.field,
                type: descriptor.type,
                description: descriptor.description,
                optional: descriptor.optional,
            };
        });
        return this;
    }

    /** 응답 필드 정의 */
    withResponseFields(fields: FieldBuilderOptional[]): this {
        this.options.responseFields = fields.map((field) => {
            const descriptor = field.toDescriptor();
            return {
                field: descriptor.field,
                type: descriptor.type,
                description: descriptor.description,
                optional: descriptor.optional,
            };
        });
        return this;
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        const request = response.request as any;
        const requestBody = request?._data ?? {};

        // 요청 URL, Query, Headers (데모용)
        const requestUrl = new URL(request?.url || "", "http://localhost");
        const requestPath = requestUrl.pathname;
        const requestQuery = Object.fromEntries(requestUrl.searchParams);
        const requestHeaders = request?.header || {};

        console.log(`--- Doc Identifier: ${identifier} ---`);
        console.log("Global Config:", config);
        console.log("Doc Options:", JSON.stringify(this.options, null, 2));
        console.log("Request Path:", requestPath);
        console.log("Request Query:", requestQuery);
        console.log("Request Headers:", requestHeaders);
        console.log("Request Body:", requestBody);
        console.log("Response Status:", response.status);
        console.log("Response Body:", response.body);
        console.log("Response Text:", response.text);
        console.log("---------------------------------------");

        return response;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(
    supertestPromise: Promise<Response>
): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
