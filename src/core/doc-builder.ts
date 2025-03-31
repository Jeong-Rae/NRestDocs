import { Response } from 'supertest';
import { DocOptions, FieldDescriptor } from '../types';
import { getNRestDocsConfig } from './config';

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
    withRequestFields(fields: FieldDescriptor[]): this {
        this.options.requestFields = fields;
        return this;
    }

    /** 응답 필드 정의 */
    withResponseFields(fields: FieldDescriptor[]): this {
        this.options.responseFields = fields;
        return this;
    }

    /**
     * supertest 요청을 실행하고, 설정된 옵션과 응답 정보를 콘솔에 출력
     */
    async doc(identifier: string): Promise<Response> {
        const response = await this.supertestPromise;
        const config = getNRestDocsConfig();

        // TODO: 콘솔에 정보 출력 (추후 렌더러와 strict 검증 추가 예정)
        console.log(`--- Doc Identifier: ${identifier} ---`);
        console.log('Global Config:', config);
        console.log('Doc Options:', this.options);
        console.log('Response Status:', response.status);
        console.log('Response Body:', response.body);
        console.log('---------------------------------------');

        return response;
    }
}

/** supertest Promise를 받아 DocRequestBuilder로 감싸기 */
export function docRequest(supertestPromise: Promise<Response>): DocRequestBuilder {
    return new DocRequestBuilder(supertestPromise);
}
