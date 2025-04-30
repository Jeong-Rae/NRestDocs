import type { JSONSchema } from "./json-schema.type";

export namespace OpenAPI_V3_1 {
    export interface OpenAPI {
        openapi: string;
        info: Info;
        jsonSchemaDialect: string;
        servers?: Server[];
        paths: Paths;
        webhooks?: Record<string, PathItem>;
        components?: Components;
        security?: SecurityRequirement[];
        tags?: Tag[];
        externalDocs?: ExternalDocumentation;
    }

    export interface Info {
        title: string;
        summary?: string;
        description?: string;
        termsOfService?: string;
        contact?: Contact;
        license?: License;
        version: string;
    }

    export interface Contact {
        name?: string;
        url?: string;
        email?: string;
    }

    export interface License {
        name: string;
        identifier?: string;
        url?: string;
    }

    export interface Server {
        url: string;
        description?: string;
        variables?: Record<string, ServerVariable>;
    }

    export interface ServerVariable {
        enum?: string[];
        default: string;
        description?: string;
    }

    export interface Components {
        schemas: Record<string, Schema>;
        responses: Record<string, Response | Reference>;
        parameters: Record<string, Parameter | Reference>;
        examples: Record<string, Example | Reference>;
        requestBodies: Record<string, RequestBody | Reference>;
        headers: Record<string, Header | Reference>;
        securitySchemes: Record<string, SecurityScheme | Reference>;
        links: Record<string, Link | Reference>;
        callbacks: Record<string, Callback | Reference>;
        pathItems: Record<string, PathItem>;
    }

    export interface Paths {
        [key: `/${string}`]: PathItem;
    }

    export type HttpMethod =
        | "get"
        | "post"
        | "put"
        | "delete"
        | "options"
        | "head"
        | "patch"
        | "trace";

    export interface PathItem extends Partial<Record<HttpMethod, Operation>> {
        $ref?: string;
        summary?: string;
        description?: string;
        servers?: Server[];
        parameters?: (Parameter | Reference)[];
    }

    export interface Operation {
        tags?: string[];
        summary?: string;
        description?: string;
        externalDocs?: ExternalDocumentation;
        operationId?: string;
        parameters?: (Parameter | Reference)[];
        requestBody?: RequestBody | Reference;
        responses?: Responses;
        callbacks?: Record<string, Callback | Reference>;
        deprecated?: boolean;
        security?: SecurityRequirement[];
        servers?: Server[];
    }

    export interface ExternalDocumentation {
        url: string;
        description?: string;
    }

    export type Parameter = ParameterWithSchema | ParameterWithContent;

    export interface ParameterBase {
        name: string;
        in: "query" | "header" | "path" | "cookie";
        description?: string;
        required: boolean; // default: false
        deprecated: boolean; // default: false
        allowEmptyValue: boolean; // default: false
    }

    export interface ParameterWithSchema extends ParameterBase {
        style: "simple";
        explode: boolean; // default: false
        allowReserved: boolean; // default: false
        schema: Schema;
        example?: unknown;
        examples?: Record<string, Example | Reference>;
        content: never;
    }

    export interface ParameterWithContent extends ParameterBase {
        content: Record<string, MediaType>;
        style: never;
        explode: never;
        schema: never;
        example: never;
        examples: never;
    }

    export interface RequestBody {
        description?: string;
        content: Record<string, MediaType>;
        required: boolean; // default: false
    }

    export type HttpStatusCode =
        | HttpStatusCodeInformational
        | HttpStatusCodeSuccess
        | HttpStatusCodeRedirection
        | HttpStatusCodeClientError
        | HttpStatusCodeServerError;

    type HttpStatusCodeInformational = 100 | 101 | 102 | 103 | 104;
    type HttpStatusCodeSuccess = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
    type HttpStatusCodeRedirection = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
    type HttpStatusCodeClientError =
        | 400
        | 401
        | 402
        | 403
        | 404
        | 405
        | 406
        | 407
        | 408
        | 409
        | 410
        | 411
        | 412
        | 413
        | 414;
    type HttpStatusCodeServerError =
        | 500
        | 501
        | 502
        | 503
        | 504
        | 505
        | 506
        | 507
        | 508
        | 510
        | 511;

    export interface Responses extends Partial<Record<HttpStatusCode, Response | Reference>> {
        default: Response | Reference;
    }

    export interface Response {
        description: string;
        headers: Record<string, Header | Reference>;
        content: Record<string, MediaType>;
        links: Record<string, Link | Reference>;
    }

    export interface Callback extends Record<Expression, PathItem> {}

    export interface MediaType {
        schema: Schema;
        example?: unknown;
        examples?: Record<string, Example | Reference>;
        encoding?: Record<string, Encoding>;
    }

    export interface Encoding {
        contentType: string;
        headers: Record<string, Header | Reference>;
        style: string;
        explode: boolean;
        allowReserved: boolean;
    }

    export interface Example {
        summary?: string;
        description?: string;
        value?: unknown;
        externalValue?: string;
    }

    export interface Link {
        operationRef?: string;
        operationId?: string;
        parameters?: Record<string, unknown>;
        requestBody?: unknown;
        description?: string;
        server?: Server;
    }

    type Header = HeaderWithSchema | HeaderWithContent;

    export interface HeaderBase {
        description?: string;
        required: boolean; // default: false
        deprecated: boolean; // default: false
    }

    export interface HeaderWithSchema extends HeaderBase {
        style: "simple";
        explode: boolean; // default: false
        schema: Schema | Reference;
        example?: unknown;
        examples?: Record<string, Example | Reference>;
        content: never;
    }

    export interface HeaderWithContent extends HeaderBase {
        content: Record<string, MediaType>;
        style: never;
        explode: never;
        schema: never;
        example: never;
        examples: never;
    }

    export interface Tag {
        name: string;
        description?: string;
        externalDocs?: ExternalDocumentation;
    }

    export interface Reference {
        $ref: string;
        summary?: string;
        description?: string;
    }

    export interface Schema extends JSONSchema {
        discriminator?: Discriminator;
        xml?: XML;
        externalDocs?: ExternalDocumentation;
        example?: unknown;
    }

    export interface Discriminator {
        propertyName: string;
        mapping: Record<string, string>;
        example?: unknown;
    }

    export interface XML {
        name?: string;
        namespace?: string;
        prefix?: string;
        attribute: boolean; // default: false
        wrapped: boolean; // default: false
    }

    export type SecurityScheme =
        | ApiKeySecurityScheme
        | HttpSecurityScheme
        | MutualTlsSecurityScheme
        | OAuth2SecurityScheme
        | OpenIdConnectSecurityScheme;

    export type SecuritySchemeType = "apiKey" | "http" | "mutualTLS" | "oauth2" | "openIdConnect";

    export interface SecuritySchemeBase {
        type: SecuritySchemeType;
        description?: string;
    }

    export interface ApiKeySecurityScheme extends SecuritySchemeBase {
        type: "apiKey";
        name: string;
        in: "query" | "header" | "cookie";
    }

    export interface HttpSecurityScheme extends SecuritySchemeBase {
        type: "http";
        scheme: string;
        bearerFormat?: string;
    }

    export interface MutualTlsSecurityScheme extends SecuritySchemeBase {
        type: "mutualTLS";
    }

    export interface OAuth2SecurityScheme extends SecuritySchemeBase {
        type: "oauth2";
        flows: OAuthFlows;
    }

    export interface OpenIdConnectSecurityScheme extends SecuritySchemeBase {
        type: "openIdConnect";
        openIdConnectUrl: string;
    }

    export interface OAuthFlows {
        implicit?: OAuthFlow;
        password?: OAuthFlow;
        clientCredentials?: OAuthFlow;
        authorizationCode?: OAuthFlow;
    }

    type OAuthFlow =
        | OAuthFlowImplicit
        | OAuthFlowAuthorizationCode
        | OAuthFlowPassword
        | OAuthFlowClientCredentials;

    export interface OAuthFlowBase {
        refreshUrl?: string;
        scopes: Record<string, string>;
    }

    export interface OAuthFlowImplicit extends OAuthFlowBase {
        authorizationUrl: string;
    }

    export interface OAuthFlowAuthorizationCode extends OAuthFlowBase {
        authorizationUrl: string;
        tokenUrl: string;
    }

    export interface OAuthFlowPassword extends OAuthFlowBase {
        tokenUrl: string;
    }

    export interface OAuthFlowClientCredentials extends OAuthFlowBase {
        tokenUrl: string;
    }

    export interface SecurityRequirement extends Record<string, string[]> {}

    // Utility types

    export type Expression = string;
}
