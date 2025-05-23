import { ConfigService } from "@/config/config.service";
import type {
    CookieDescriptor,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    HttpBody,
    HttpHeaders,
    HttpMethod,
    HttpQuery,
    HttpStatusCode,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
    SupertestRequest,
} from "@/core";
import { createAsciiDocRenderer } from "@/docgen/render";
import { createWriter } from "@/docgen/writers";
import { InvalidTypeError, MissingFieldError } from "@/errors";
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
import { type Filename, isValidFilename } from "@/utils/fs/filename";
import { extractHttpRequest, extractHttpResponse } from "@/utils/http-trace-extractor";
import type { Response as SupertestResponse } from "supertest";
import type { DocumentSnapshot } from "./document.type";

type PathSet = { __path: "set" };
type PathUnset = { __path: "unset" };

export class DocumentBuilder<PathState = PathUnset> {
    // HTTP 실행 및 기본 정보
    private readonly supertestPromise: Promise<SupertestResponse>;
    private httpMethod?: HttpMethod;
    private httpUrl?: URL;
    private httpStatusCode?: HttpStatusCode;
    private httpRequestHeaders?: HttpHeaders;
    private httpResponseHeaders?: HttpHeaders;
    private httpRequestBody?: HttpBody;
    private httpResponseBody?: HttpBody;
    private httpRequestCookies?: string;
    private httpResponseCookies?: string;
    private httpRequestQuery?: HttpQuery;
    private httpRequestPath?: string;
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
                method: this.httpMethod as HttpMethod,
                url: this.httpUrl as URL,
                path: this.httpRequestPath as string,
                statusCode: this.httpStatusCode as HttpStatusCode,
                requestHeaders: this.httpRequestHeaders as HttpHeaders,
                responseHeaders: this.httpResponseHeaders as HttpHeaders,
                requestQuery: this.httpRequestQuery as HttpQuery,
                requestBody: this.httpRequestBody as HttpBody,
                responseBody: this.httpResponseBody as HttpBody,
                requestCookies: this.httpRequestCookies as string,
                responseCookies: this.httpResponseCookies as string,
            },
            parameters: {
                path: this.pathParameters ?? [],
                query: this.queryParameters ?? [],
                form: this.formParameters ?? [],
            },
            fields: {
                request: this.requestFields ?? [],
                response: this.responseFields ?? [],
            },
            parts: {
                part: this.requestParts ?? [],
                body: this.requestPartBodies ?? {},
                fields: this.requestPartFields ?? {},
            },
            headers: {
                request: this.requestHeaders ?? [],
                response: this.responseHeaders ?? [],
            },
            cookies: {
                request: this.requestCookies ?? [],
                response: this.responseCookies ?? [],
            },
        };

        return snapshot;
    }

    /**
     * Request Path를 등록할 수 있다.
     * @param path {string} 등록 가능한 Path
     * @returns
     * @example
     * / setRequestPath("/users/:userId/posts/:postId")
     * / setRequestPath("/users/{userId}/posts/{postId}")
     */
    setRequestPath(path: string): DocumentBuilder<PathSet> {
        this.httpRequestPath = path;
        return this;
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

    private extractHttpTrace(
        supertestRequest: SupertestRequest,
        supertestResponse: SupertestResponse
    ) {
        const {
            body: requestBody,
            headers: requestHeaders,
            method,
            url,
            cookies,
            query,
        } = extractHttpRequest(supertestRequest);
        this.httpMethod = method;
        this.httpUrl = url;
        this.httpRequestCookies = cookies;
        this.httpRequestHeaders = requestHeaders;
        this.httpRequestBody = requestBody as HttpBody;
        this.httpRequestQuery = query;

        const {
            body: responseBody,
            headers: responseHeaders,
            statusCode,
        } = extractHttpResponse(supertestResponse);
        this.httpStatusCode = statusCode;
        this.httpResponseHeaders = responseHeaders;
        this.httpResponseBody = responseBody as HttpBody;
    }

    /**
     * trigger supertest request and generate document
     * @param identifier document identifier
     * @returns supertest response
     */
    async doc(this: DocumentBuilder<PathSet>, identifier: Filename): Promise<SupertestResponse> {
        await ConfigService.init();

        if (!isValidFilename(identifier)) {
            throw new InvalidTypeError({
                context: "DocumentBuilder.doc",
                fieldName: "identifier",
                expected: "valid filename string (no control/special characters)",
                actual: identifier,
            });
        }

        if (!this.httpRequestPath) {
            throw new MissingFieldError({
                context: "DocumentBuilder.doc",
                fieldName: "httpRequestPath",
                suggestion: "Call `setRequestPath()` before invoking `doc()`.",
            });
        }

        const response = await this.supertestPromise;
        this.extractHttpTrace(response.request as SupertestRequest, response);

        const renderer = await createAsciiDocRenderer();
        const documents = await renderer.render(this.snapshot());

        const writer = createWriter(ConfigService.get());
        await writer.write(identifier, documents);

        return response;
    }
}

/**
 * Proxy function that receives a supertest Promise and returns a DocumentBuilder for API documentation generation.
 *
 * This function takes a Promise from a supertest HTTP request and wraps it with a DocumentBuilder instance.
 * The returned DocumentBuilder allows you to chain methods to set request/response parameters, headers, cookies, body, and more for documentation purposes.
 *
 * @template PathUnset Initial state type for DocumentBuilder (path not set)
 * @param {Promise<SupertestResponse>} supertestPromise The Promise object from a supertest HTTP request
 * @returns {DocumentBuilder<PathUnset>} A DocumentBuilder instance (with path unset)
 *
 * @example
 * import { defineField, docRequest } from "@nrestdocs/core";
 * import request from "supertest";
 *
 * await docRequest(
 *   request(app.getHttpServer())
 *     .post("/orders")
 *     .send({ productId: 1, qty: 1 })
 *     .expect(201)
 * )
 *   .setRequestPath("/orders")
 *   .withRequestFields([
 *     defineField("productId").type("number"),
 *     defineField("qty").type("number"),
 *   ])
 *   .doc("orders-create");
 *
 * @see DocumentBuilder
 */
export function docRequest(
    supertestPromise: Promise<SupertestResponse>
): DocumentBuilder<PathUnset> {
    return new DocumentBuilder(supertestPromise);
}
