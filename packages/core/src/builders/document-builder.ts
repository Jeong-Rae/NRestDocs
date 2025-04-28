import {
    type CookieDescriptor,
    type FieldDescriptor,
    type FormParamDescriptor,
    type HeaderDescriptor,
    type PartDescriptor,
    type PathParamDescriptor,
    type QueryParamDescriptor,
    definePath,
} from "@/descriptors";
import {
    type CookieInput,
    type FieldInput,
    type FormParamsInput,
    type HeaderInput,
    type PathParamsInput,
    type QueryParamsInput,
    type RequestPartInput,
    applyCookie,
    applyFields,
    applyFormParameters,
    applyHeader,
    applyPathParameters,
    applyQueryParameters,
    applyRequestPart,
} from "@/inputs";
import type { HttpBody, HttpCookies, HttpHeaders, HttpMethod, HttpStatusCode } from "@/types";
import { extractHttpRequest, extractHttpResponse } from "@/utils/http-trace-extractor";
import type { Response as SupertestResponse } from "supertest";
import type { DocumentSnapshot } from "./model";

export class DocumentBuilder {
    // HTTP 실행 및 기본 정보
    private readonly supertestPromise: Promise<SupertestResponse>;
    private httpMethod?: HttpMethod;
    private httpPath?: string;
    private statusCode?: HttpStatusCode;
    private httpHeaders?: HttpHeaders;
    private httpBody?: HttpBody;
    private httpCookies?: HttpCookies;

    // 요청 파라미터
    private pathParameters?: PathParamDescriptor[];
    private queryParameters?: QueryParamDescriptor[];
    private formParameters?: FormParamDescriptor[];

    // 요청 멀티파트
    private requestParts?: PartDescriptor[];
    private requestPartBodies?: Record<string, true>;
    private requestPartFields?: Record<string, FieldDescriptor[]>;

    // 요청 헤더/쿠키
    private requestHeaders?: HeaderDescriptor[];
    private requestCookies?: CookieDescriptor[];

    // 요청 바디
    private requestFields?: FieldDescriptor[];

    // 응답 헤더/쿠키
    private responseHeaders?: HeaderDescriptor[];
    private responseCookies?: CookieDescriptor[];

    // 응답 바디
    private responseFields?: FieldDescriptor[];

    constructor(supertestPromise: Promise<SupertestResponse>) {
        this.supertestPromise = supertestPromise;
    }

    snapshot(): DocumentSnapshot {
        const snapshot: DocumentSnapshot = {
            http: {
                method: this.httpMethod,
                path: this.httpPath,
                statusCode: this.statusCode,
                headers: this.httpHeaders,
                body: this.httpBody,
                cookies: this.httpCookies,
            },
            parameters: {
                path: this.pathParameters,
                query: this.queryParameters,
                form: this.formParameters,
            },
            fields: {
                request: this.requestFields,
                response: this.responseFields,
            },
            parts: {
                part: this.requestParts,
                body: this.requestPartBodies,
                fields: this.requestPartFields,
            },
            headers: {
                request: this.requestHeaders,
                response: this.responseHeaders,
            },
            cookies: {
                request: this.requestCookies,
                response: this.responseCookies,
            },
        };

        return snapshot;
    }

    /**
     * Response Fields를 등록할 수 있다.
     * @param fields {FieldInput} 등록 가능한 Field 입력
     * @example
     * / withResponseFields([ defineField("user.name").type("string"), defineField("user.age").type("number") ])
     * / withResponseFields([ { name: "user.name", "type": "string" }, { name: "user.age", "type": "number" } ])
     * / withResponseFields({ user: { name: { type: "string" }, age: { type: "number" } } })
     * @returns
     */
    withResponseFields(fields: FieldInput): this {
        this.responseFields = applyFields(fields);
        return this;
    }

    /**
     * Request Fields를 등록할 수 있다.
     * @param fields {FieldInput} 등록 가능한 Field 입력
     * @returns
     * @example
     * / withRequestFields([ defineField("user.name").type("string"), defineField("user.age").type("number") ])
     * / withRequestFields([ { name: "user.name", "type": "string" }, { name: "user.age", "type": "number" } ])
     * / withRequestFields({ user: { name: { type: "string" }, age: { type: "number" } } })
     */
    withRequestFields(fields: FieldInput): this {
        this.requestFields = applyFields(fields);
        return this;
    }

    /**
     * Query Parameters를 등록할 수 있다.
     * @param params {QueryParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withQueryParameters([ defineQuery("page").type("number").format("int32"), defineQuery("limit").type("number").format("int32") ])
     * / withQueryParameters([ { name: "page", "type": "number", "format": "int32" }, { name: "limit", "type": "number", "format": "int32" } ])
     * / withQueryParameters({ page: { type: "number", "format": "int32" }, limit: { type: "number", "format": "int32" } })
     * @returns
     */
    withQueryParameters(params: QueryParamsInput): this {
        this.queryParameters = applyQueryParameters(params);
        return this;
    }

    /**
     * Form Parameters를 등록할 수 있다.
     * @param params {FormParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withFormParameters([ defineForm("username").type("string").format("email"), defineForm("password").type("string").format("password") ])
     * / withFormParameters([ { name: "username", "type": "string", "format": "email" }, { name: "password", "type": "string", "format": "password" } ])
     * / withFormParameters({ username: { type: "string", "format": "email" }, password: { type: "string", "format": "password" } })
     * @returns
     */
    withFormParameters(params: FormParamsInput): this {
        this.formParameters = applyFormParameters(params);
        return this;
    }

    /**
     * Path Parameters를 등록할 수 있다.
     * @param params {PathParamsInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withPathParameters([ definePath("userId").type("string").format("uuid"), definePath("postId").type("string").format("uuid") ])
     * / withPathParameters([ { name: "userId", "type": "string", "format": "uuid" }, { name: "postId", "type": "string", "format": "uuid" } ])
     * / withPathParameters({ userId: { type: "string", "format": "uuid" }, postId: { type: "string", "format": "uuid" } })
     * @returns
     */
    withPathParameters(params: PathParamsInput): this {
        this.pathParameters = applyPathParameters(params);
        return this;
    }

    /**
     * Request Part를 등록할 수 있다.
     * @param params {RequestPartInput} 등록 가능한 Parameter 입력 배열 또는 레코드
     * @example
     * / withRequestParts([ definePart("file").type("string").format("binary"), definePart("metadata").type("object") ])
     * / withRequestParts([ { name: "file", "type": "string", "format": "binary" }, { name: "metadata", "type": "object" } ])
     * / withRequestParts({ file: { type: "string", "format": "binary" }, metadata: { type: "object" } })
     * @returns
     */
    withRequestParts(params: RequestPartInput): this {
        this.requestParts = applyRequestPart(params);
        return this;
    }

    /**
     * Request Part의 바디를 등록할 수 있다.
     * @param partName {string} 등록 가능한 Part 이름
     * @returns
     * @example
     * / ("metadata")
     */
    withRequestPartBody(partName: string): this {
        if (!this.requestPartBodies) {
            this.requestPartBodies = {};
        }
        this.requestPartBodies[partName] = true;
        return this;
    }

    /**
     * Request Part의 필드를 등록할 수 있다.
     * @param partName {string} 등록 가능한 Part 이름
     * @param fields {FieldInput} 등록 가능한 Field 배열
     * @returns
     * @example
     * / withRequestPartFields("metadata", [ defineField("name").type("string"), defineField("size").type("number") ])
     */
    withRequestPartFields(partName: string, fields: FieldInput): this {
        if (!this.requestPartFields) {
            this.requestPartFields = {};
        }
        this.requestPartFields[partName] = applyFields(fields);
        return this;
    }

    /**
     * Response Header를 등록할 수 있다.
     * @param headers {HeaderInput} 등록 가능한 Header 입력 배열 또는 레코드
     * @returns
     * @example
     * / withResponseHeaders([ defineHeader("Authorization"), defineHeader("Server") ])
     * / withResponseHeaders([ { name: "Authorization" }, { name: "Server" } ])
     * / withResponseHeaders({ Authorization: {}, Server: {} })
     */
    withResponseHeaders(headers: HeaderInput): this {
        this.responseHeaders = applyHeader(headers);
        return this;
    }

    /**
     * Request Header를 등록할 수 있다.
     * @param headers {HeaderInput} 등록 가능한 Header 입력 배열 또는 레코드
     * @returns
     * @example
     * / withRequestHeaders([ defineHeader("Authorization"), defineHeader("X-Forwarded-For") ])
     * / withRequestHeaders([ { name: "Authorization" }, { name: "X-Forwarded-For" } ])
     * / withRequestHeaders({ Authorization: {}, "X-Forwarded-For": {} })
     */
    withRequestHeaders(headers: HeaderInput): this {
        this.requestHeaders = applyHeader(headers);
        return this;
    }

    /**
     * Response Cookie를 등록할 수 있다.
     * @param cookies {CookieInput} 등록 가능한 Cookie 입력 배열 또는 레코드
     * @returns
     * @example
     * / withRequestCookies([ defineCookie("connect.sid").type("string").format("base64") ])
     * / withRequestCookies([ { name: "connect.sid", "type": "string", "format": "base64" } ])
     * / withRequestCookies({ connect.sid: { type: "string", "format": "base64" } })
     */
    withResponseCookies(cookies: CookieInput): this {
        this.responseCookies = applyCookie(cookies);
        return this;
    }

    /**
     * Request Cookie를 등록할 수 있다.
     * @param cookies {CookieInput} 등록 가능한 Cookie 입력 배열 또는 레코드
     * @returns
     * @example
     * / withRequestCookies([ defineCookie("connect.sid").type("string").format("base64") ])
     * / withRequestCookies([ { name: "connect.sid", "type": "string", "format": "base64" } ])
     * / withRequestCookies({ connect.sid: { type: "string", "format": "base64" } })
     */
    withRequestCookies(cookies: CookieInput): this {
        this.requestCookies = applyCookie(cookies);
        return this;
    }

    /**
     * 문서 생성
     * @param identifier document identifier
     * @returns supertest response
     */
    async doc(identifier: string): Promise<SupertestResponse> {
        const response = await this.supertestPromise;
        const httpRequest = extractHttpRequest(response);
        const {
            body: requestBody,
            headers: requestHeaders,
            method,
            url: { pathname },
        } = httpRequest;
        const httpResponse = extractHttpResponse(response);
        const { body: responseBody, headers: responseHeaders, statusCode } = httpResponse;
        console.log(
            requestBody,
            requestHeaders,
            method,
            pathname,
            responseBody,
            responseHeaders,
            statusCode
        );

        return response;
    }
}

/**
 * supertest Promise를 받아 DocumentBuilder 감싸기
 * @param supertestPromise supertest Promise
 * @returns DocRequestBuilder
 */
export function docRequest(supertestPromise: Promise<SupertestResponse>): DocumentBuilder {
    return new DocumentBuilder(supertestPromise);
}
