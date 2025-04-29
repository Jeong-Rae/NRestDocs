import type {
    CookieDescriptor,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "@/descriptors";
import type { HttpBody, HttpHeaders, HttpMethod, HttpQuery, HttpStatusCode } from "@/types";

export type DocumentSnapshot = {
    http: {
        method: HttpMethod;
        url: URL;
        statusCode: HttpStatusCode;
        requestHeaders: HttpHeaders;
        responseHeaders: HttpHeaders;
        requestBody: HttpBody;
        responseBody: HttpBody;
        requestCookies: string;
        responseCookies: string;
        requestQuery: HttpQuery;
    };
    parameters: {
        path: PathParamDescriptor[];
        query: QueryParamDescriptor[];
        form: FormParamDescriptor[];
    };
    fields: {
        request: FieldDescriptor[];
        response: FieldDescriptor[];
    };
    parts: {
        part: PartDescriptor[];
        body: Record<string, true>;
        fields: Record<string, FieldDescriptor[]>;
    };
    headers: {
        request: HeaderDescriptor[];
        response: HeaderDescriptor[];
    };
    cookies: {
        request: CookieDescriptor[];
        response: CookieDescriptor[];
    };
};
