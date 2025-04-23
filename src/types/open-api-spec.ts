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

interface Response {
    description: string;
    headers: Record<string, Header | Reference>;
    content: Record<string, MediaType>;
    links: Record<string, Link | Reference>;
}

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
