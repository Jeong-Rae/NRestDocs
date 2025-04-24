import { isArray, isFunction } from "es-toolkit/compat";
import { type Builder, ParamKinds, type PathParamDescriptor, type TypeSet } from "../descriptors";
import type { PartialPathParam, PathParamsInput } from "./input.type";

/** 배열,Record,Builder -> PathParamDescriptor[] 로 정규화 */
export function applyPathParameters(input: PathParamsInput): PathParamDescriptor[] {
    if (isArray(input)) {
        return input.map(normalize);
    }
    return Object.entries(input).map(([name, rest]) => normalize({ name, ...rest }));
}

/* 단일 항목 정규화 */
function normalize(
    raw: Builder<Partial<PathParamDescriptor>, TypeSet, typeof ParamKinds.Path> | PartialPathParam
): PathParamDescriptor {
    // Builder 인스턴스 → .build() 호출
    if (isFunction((raw as Record<string, unknown>)["build"])) {
        return (raw as Builder<PathParamDescriptor, TypeSet, typeof ParamKinds.Path>).build();
    }

    const descriptor = raw as PartialPathParam;
    return {
        kind: ParamKinds.Path,
        name: descriptor.name,
        type: descriptor.type ?? "string",
        description: descriptor.description ?? "",
        ...(descriptor.optional === true && { optional: true }),
    };
}
