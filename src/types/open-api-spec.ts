import type { JSONSchema } from "./json";

interface Server {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariable>;
}

interface ServerVariable {
    enum?: string[];
    default: string;
    description?: string;
}

interface Components {
    schemas: Record<string, Schema>;
    responses: Record<string, Response | Reference>;
    parameters: Record<string, Parameter | Reference>;
    examples: Record<string, Example | Reference>;
    requestBodies: Record<string, RequestBody | Reference>;
    headers: Record<string, Header | Reference>;
    securitySchemes: Record<string, SecurityScheme | Reference>;
    links: Record<string, Link | Reference>;
    callbacks: Record<string, Callback | Reference>;
}

type HttpMethod = "get" | "post" | "put" | "delete" | "options" | "head" | "patch" | "trace";

interface PathItem extends Partial<Record<HttpMethod, Operation>> {
    $ref?: string;
    summary?: string;
    description?: string;
    servers?: Server[];
    parameters?: (Parameter | Reference)[];
}

interface Operation {
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

interface ExternalDocumentation {
    url: string;
    description?: string;
}

type Parameter = ParameterWithSchema | ParameterWithContent;

interface ParameterBase {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    description?: string;
    required: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
}

interface ParameterWithSchema extends ParameterBase {
    style?: "simple";
    explode?: boolean;
    allowReserved?: boolean;
    schema: Schema;
    example?: unknown;
    examples?: Record<string, Example | Reference>;
    content: never;
}

interface ParameterWithContent extends ParameterBase {
    content: Record<string, MediaType>;
    style: never;
    explode: never;
    schema: never;
    example: never;
    examples: never;
}

interface RequestBody {
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
type HttpStatusCodeServerError = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

interface Responses extends Partial<Record<HttpStatusCode, Response | Reference>> {
    default: Response | Reference;
}

interface Response {
    description: string;
    headers: Record<string, Header | Reference>;
    content: Record<string, MediaType>;
    links: Record<string, Link | Reference>;
}

interface Callback extends Record<Expression, PathItem> {}

interface MediaType {
    schema: Schema;
    example?: unknown;
    examples?: Record<string, Example | Reference>;
    encoding?: Record<string, Encoding>;
}

interface Encoding {
    contentType: string;
    headers: Record<string, Header | Reference>;
    style: "string";
    explode: boolean;
    allowReserved: boolean;
}

interface Example {
    summary?: string;
    description?: string;
    value?: unknown;
    externalValue?: string;
}

interface Link {
    operationRef?: string;
    operationId?: string;
    parameters?: Record<string, unknown>;
    requestBody?: unknown;
    description?: string;
    server?: Server;
}

type Header = HeaderWithSchema | HeaderWithContent;

interface HeaderBase {
    description?: string;
    required: boolean;
    deprecated: boolean;
}

interface HeaderWithSchema extends HeaderBase {
    style: "simple";
    explode: boolean;
    schema: Schema | Reference;
    example?: unknown;
    examples?: Record<string, Example | Reference>;
    content: never;
}

interface HeaderWithContent extends HeaderBase {
    content: Record<string, MediaType>;
    style: never;
    explode: never;
    schema: never;
    example: never;
    examples: never;
}

interface Reference {
    $ref: string;
    summary?: string;
    description?: string;
}

interface Schema extends JSONSchema {
    discriminator?: Discriminator;
    xml?: XML;
    externalDocs?: ExternalDocumentation;
    example?: unknown;
}

interface Discriminator {
    propertyName: string;
    mapping: Record<string, string>;
    example?: unknown;
}

interface XML {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}

export type SecurityScheme =
    | ApiKeySecurityScheme
    | HttpSecurityScheme
    | MutualTlsSecurityScheme
    | OAuth2SecurityScheme
    | OpenIdConnectSecurityScheme;

export type SecuritySchemeType = "apiKey" | "http" | "mutualTLS" | "oauth2" | "openIdConnect";

interface SecuritySchemeBase {
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

interface OAuthFlows {
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

interface OAuthFlowBase {
    refreshUrl?: string;
    scopes: Record<string, string>;
}

interface OAuthFlowImplicit extends OAuthFlowBase {
    authorizationUrl: string;
}

interface OAuthFlowAuthorizationCode extends OAuthFlowBase {
    authorizationUrl: string;
    tokenUrl: string;
}

interface OAuthFlowPassword extends OAuthFlowBase {
    tokenUrl: string;
}

interface OAuthFlowClientCredentials extends OAuthFlowBase {
    tokenUrl: string;
}

interface SecurityRequirement extends Record<string, string[]> {}

// Utility types

type Expression = string;
