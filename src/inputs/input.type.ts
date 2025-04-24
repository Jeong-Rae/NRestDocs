import type { Builder } from "../descriptors/builder";
import type { PathParamDescriptor, QueryParamDescriptor } from "../descriptors/types";

export type PartialPathParam = Partial<Omit<PathParamDescriptor, "kind">> & { name: string };
export type PartialQueryParam = Partial<Omit<QueryParamDescriptor, "kind">> & { name: string };

export type PathParamsInput =
    | (Builder<PathParamDescriptor, unknown> | PartialPathParam)[]
    | Record<string, Omit<PartialPathParam, "name">>;

export type QueryParamsInput =
    | (Builder<QueryParamDescriptor, unknown> | PartialQueryParam)[]
    | Record<string, Omit<PartialQueryParam, "name">>;
