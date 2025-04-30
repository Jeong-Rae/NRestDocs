import type {
    CookieDescriptor,
    DescriptorKind,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "@/core";
import { type DescriptorBuilder, createDescriptorBuilder } from "./descriptor-builder";
import type { TypeUnset } from "./state";

type DescriptorFactory<N extends string, K extends DescriptorKind, D> = DescriptorBuilder<
    Partial<D> & { kind: K; name: N },
    TypeUnset,
    K
>;

export const descriptorFactory =
    <K extends DescriptorKind>(k: K) =>
    <N extends string>(name: N) =>
        createDescriptorBuilder(k, name) as DescriptorFactory<
            N,
            K,
            K extends "query"
                ? QueryParamDescriptor
                : K extends "form"
                  ? FormParamDescriptor
                  : K extends "path"
                    ? PathParamDescriptor
                    : K extends "header"
                      ? HeaderDescriptor
                      : K extends "cookie"
                        ? CookieDescriptor
                        : K extends "part"
                          ? PartDescriptor
                          : FieldDescriptor
        >;
