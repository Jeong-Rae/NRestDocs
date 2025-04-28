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
    http: Partial<{
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
    }>;
    parameters: Partial<{
        path: PathParamDescriptor[];
        query: QueryParamDescriptor[];
        form: FormParamDescriptor[];
    }>;
    fields: Partial<{
        request: FieldDescriptor[];
        response: FieldDescriptor[];
    }>;
    parts: Partial<{
        part: PartDescriptor[];
        body: Record<string, true>;
        fields: Record<string, FieldDescriptor[]>;
    }>;
    headers: Partial<{
        request: HeaderDescriptor[];
        response: HeaderDescriptor[];
    }>;
    cookies: Partial<{
        request: CookieDescriptor[];
        response: CookieDescriptor[];
    }>;
};
