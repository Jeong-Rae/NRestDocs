import { isEmpty } from "es-toolkit/compat";
import type { ParameterDescriptor } from "../types";
import type { OpenAPI_V3_1 } from "../types/open-api-spec";
import { normalizeDescriptors } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";

export function applyPathParameters(
    params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
): ParameterDescriptor[] {
    return normalizeDescriptors(params);
}

export function applyQueryParameters(
    params: (DescriptorBuilder<ParameterDescriptor> | ParameterDescriptor)[]
): ParameterDescriptor[] {
    return normalizeDescriptors(params);
}

export function renderParameters(
    descriptors: ParameterDescriptor[] | undefined,
    location: "path" | "query" | "header" | "cookie"
): OpenAPI_V3_1.Parameter[] | undefined {
    if (isEmpty(descriptors)) {
        return undefined;
    }

    return descriptors.map<OpenAPI_V3_1.Parameter>((d) => ({
        name: d.name,
        in: location,
        description: d.description,
        required: location === "path" ? true : !d.optional,
        schema: {} as OpenAPI_V3_1.Schema,
        deprecated: false,
        style: "simple",
        explode: false,
        allowReserved: false,
        allowEmptyValue: false,
    }));
}
