import { isArray, isFunction } from "es-toolkit/compat";
import { type Builder, ParamKinds, type QueryParamDescriptor } from "../descriptors";
import type { PartialQueryParam, QueryParamsInput } from "./input.type";

/** 배열,Record,Builder -> QueryParamDescriptor[] 로 정규화 */
export function applyQueryParameters(input: QueryParamsInput): QueryParamDescriptor[] {
    if (isArray(input)) {
        return input.map(normalize);
    }
    return Object.entries(input).map(([name, rest]) => normalize({ name, ...rest }));
}

/* 단일 항목 정규화 */
function normalize(raw: Builder<any, any> | PartialQueryParam): QueryParamDescriptor {
    if (isFunction((raw as any).build)) {
        return (raw as Builder<QueryParamDescriptor, any>).build();
    }

    const descriptor = raw as PartialQueryParam;
    return {
        kind: ParamKinds.Query,
        name: descriptor.name,
        type: descriptor.type ?? "string",
        description: descriptor.description ?? "",
        ...(descriptor.optional === true && { optional: true }),
    };
}
