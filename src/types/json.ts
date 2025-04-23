type PrimitiveTypeName = "string" | "number" | "integer" | "object" | "array" | "boolean" | "null";

interface MetaKeywords {
    $schema?: string;
    $id?: string;
    $ref?: string;
    $anchor?: string;
    $defs?: Record<string, JSONSchema>;
    title?: string;
    description?: string;
    default?: unknown;
    examples?: unknown[];
    deprecated?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
}

interface TypeKeywords {
    type?: PrimitiveTypeName | PrimitiveTypeName[];
    enum?: unknown[];
    const?: unknown;
}

interface StringKeywords {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
}

interface NumericKeywords {
    minimum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
}

interface ArrayKeywords {
    items?: JSONSchema | JSONSchema[];
    prefixItems?: JSONSchema[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}

interface ObjectKeywords {
    properties?: Record<string, JSONSchema>;
    required?: string[];
    additionalProperties?: boolean | JSONSchema;
    propertyNames?: JSONSchema;
    minProperties?: number;
    maxProperties?: number;
    patternProperties?: Record<string, JSONSchema>;
    dependentRequired?: Record<string, string[]>;
    dependentSchemas?: Record<string, JSONSchema>;
}

interface LogicalKeywords {
    allOf?: JSONSchema[];
    anyOf?: JSONSchema[];
    oneOf?: JSONSchema[];
    not?: JSONSchema;
    if?: JSONSchema;
    then?: JSONSchema;
    else?: JSONSchema;
}

export type JSONSchema = MetaKeywords &
    TypeKeywords &
    StringKeywords &
    NumericKeywords &
    ArrayKeywords &
    ObjectKeywords &
    LogicalKeywords;
