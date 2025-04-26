import type {
    AllowedType,
    BaseDescriptor,
    Builder,
    CookieDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    ParamKind,
    ParamKinds,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
    TypeSet,
} from "@/descriptors";

export type PartialDescriptor<
    K extends ParamKind,
    D extends BaseDescriptor<K, AllowedType<K>>,
> = Partial<Omit<D, "kind">> & { name: string };

export type ArrayOrRecord<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>> =
    | (Builder<Partial<D>, TypeSet, K> | PartialDescriptor<K, D>)[]
    | Record<string, Omit<PartialDescriptor<K, D>, "name">>;

export type PartialQueryParam = Partial<Omit<QueryParamDescriptor, "kind">> & { name: string };
export type PartialFormParam = Partial<Omit<FormParamDescriptor, "kind">> & { name: string };
export type PartialPathParam = Partial<Omit<PathParamDescriptor, "kind">> & { name: string };
export type PartialRequestPart = Partial<Omit<PartDescriptor, "kind">> & { name: string };
export type PartialHeader = Partial<Omit<HeaderDescriptor, "kind">> & { name: string };
export type PartialCookie = Partial<Omit<CookieDescriptor, "kind">> & { name: string };

export type QueryParamsInput = ArrayOrRecord<typeof ParamKinds.Query, QueryParamDescriptor>;

export type FormParamsInput = ArrayOrRecord<typeof ParamKinds.Form, FormParamDescriptor>;

export type PathParamsInput = ArrayOrRecord<typeof ParamKinds.Path, PathParamDescriptor>;

export type RequestPartInput = ArrayOrRecord<typeof ParamKinds.Part, PartDescriptor>;

export type RequestHeaderInput = ArrayOrRecord<typeof ParamKinds.Header, HeaderDescriptor>;

export type RequestCookieInput = ArrayOrRecord<typeof ParamKinds.Cookie, CookieDescriptor>;
