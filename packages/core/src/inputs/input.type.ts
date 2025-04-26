import type {
    Builder,
    FormParamDescriptor,
    HeaderDescriptor,
    ParamKinds,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
    TypeSet,
} from "@/descriptors";

export type PartialQueryParam = Partial<Omit<QueryParamDescriptor, "kind">> & { name: string };
export type PartialFormParam = Partial<Omit<FormParamDescriptor, "kind">> & { name: string };
export type PartialPathParam = Partial<Omit<PathParamDescriptor, "kind">> & { name: string };
export type PartialRequestPart = Partial<Omit<PartDescriptor, "kind">> & { name: string };
export type PartialHeader = Partial<Omit<HeaderDescriptor, "kind">> & { name: string };

export type QueryParamsInput =
    | (Builder<QueryParamDescriptor, TypeSet, typeof ParamKinds.Query> | PartialQueryParam)[]
    | Record<string, Omit<PartialQueryParam, "name">>;

export type FormParamsInput =
    | (Builder<FormParamDescriptor, TypeSet, typeof ParamKinds.Form> | PartialFormParam)[]
    | Record<string, Omit<PartialFormParam, "name">>;

export type PathParamsInput =
    | (Builder<PathParamDescriptor, TypeSet, typeof ParamKinds.Path> | PartialPathParam)[]
    | Record<string, Omit<PartialPathParam, "name">>;

export type RequestPartInput =
    | (Builder<PartDescriptor, TypeSet, typeof ParamKinds.Part> | PartialRequestPart)[]
    | Record<string, Omit<PartialRequestPart, "name">>;

export type RequestHeaderInput =
    | (Builder<HeaderDescriptor, TypeSet, typeof ParamKinds.Header> | PartialHeader)[]
    | Record<string, Omit<PartialHeader, "name">>;
