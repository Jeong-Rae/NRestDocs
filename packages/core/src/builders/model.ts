import type {
    CookieDescriptor,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "@/descriptors";
import type { HttpBody, HttpCookies, HttpHeaders, HttpMethod, HttpStatusCode } from "@/types";

export type DocumentSnapshot = {
    http: Partial<{
        method: HttpMethod;
        path: string;
        statusCode: HttpStatusCode;
        headers: HttpHeaders;
        body: HttpBody;
        cookies: HttpCookies;
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
