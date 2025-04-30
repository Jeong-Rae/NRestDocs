import type {
    AllowedType,
    BaseDescriptor,
    Builder,
    CookieDescriptor,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    ParamKind,
    ParamKinds,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
    TypeSet,
} from "@/descriptors";
import type { KeyedCollection } from "@/types/collection";

export type PartialDescriptor<
    K extends ParamKind,
    D extends BaseDescriptor<K, AllowedType<K>>,
> = Partial<Omit<D, "kind">> & { name: string };

export type DescriptorInput<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>> =
    | PartialDescriptor<K, D>
    | KeyedCollection<"name", PartialDescriptor<K, D>>
    | Builder<Partial<D>, TypeSet, K>
    | Array<Builder<Partial<D>, TypeSet, K>>;

/**
 * 파라미터별 입력 타입 정의
 */
export type FieldInput = DescriptorInput<typeof ParamKinds.Field, FieldDescriptor>;
export type QueryParamsInput = DescriptorInput<typeof ParamKinds.Query, QueryParamDescriptor>;
export type FormParamsInput = DescriptorInput<typeof ParamKinds.Form, FormParamDescriptor>;
export type PathParamsInput = DescriptorInput<typeof ParamKinds.Path, PathParamDescriptor>;
export type RequestPartInput = DescriptorInput<typeof ParamKinds.Part, PartDescriptor>;
export type HeaderInput = DescriptorInput<typeof ParamKinds.Header, HeaderDescriptor>;
export type CookieInput = DescriptorInput<typeof ParamKinds.Cookie, CookieDescriptor>;
