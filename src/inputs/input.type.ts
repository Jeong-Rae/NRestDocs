import type { Builder, TypeSet } from "../descriptors";
import type { ParamKinds, PathParamDescriptor, QueryParamDescriptor } from "../descriptors";

export type PartialPathParam = Partial<Omit<PathParamDescriptor, "kind">> & { name: string };
export type PartialQueryParam = Partial<Omit<QueryParamDescriptor, "kind">> & { name: string };

export type PathParamsInput =
    | (Builder<PathParamDescriptor, TypeSet, typeof ParamKinds.Path> | PartialPathParam)[]
    | Record<string, Omit<PartialPathParam, "name">>;

export type QueryParamsInput =
    | (Builder<QueryParamDescriptor, TypeSet, typeof ParamKinds.Query> | PartialQueryParam)[]
    | Record<string, Omit<PartialQueryParam, "name">>;
