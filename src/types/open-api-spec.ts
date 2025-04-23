import type { JSONSchema } from "./json";

interface Components {
    schemas: Record<string, Schema>;
}

interface ExternalDocumentation {
    url: string;
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
